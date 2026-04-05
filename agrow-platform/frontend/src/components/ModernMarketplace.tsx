'use client';

import { useState, useEffect, useMemo } from 'react';
import { ShoppingBag, Star, AlertCircle, Check, Info, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
    id: string;
    name: string;
    chemicalName?: string;
    type: 'mineral' | 'chemical' | 'organic';
    price: number;
    image: string;
    description: string;
    category: string;
}

interface ModernMarketplaceProps {
    detectedDisease?: string | null;
    matchReliability?: number;
    onPurchaseSuccess?: () => void;
}

export default function ModernMarketplace({ detectedDisease, matchReliability = 0, onPurchaseSuccess }: ModernMarketplaceProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('recommended');
    const [isPurchasing, setIsPurchasing] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/products');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data);
                }
            } catch (error) {
                console.error('Marketplace: Failed to fetch products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handlePurchase = async (product: Product) => {
        setIsPurchasing(product.id);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/purchases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product.id,
                    productName: product.name,
                    price: product.price
                })
            });
            if (res.ok) {
                if (onPurchaseSuccess) onPurchaseSuccess();
                // We could show a custom success modal here
            }
        } catch (error) {
            alert('Procurement failed. Check connection.');
        } finally {
            setIsPurchasing(null);
        }
    };

    // Filter products based on diagnosis or category
    const filteredProducts = useMemo(() => {
        if (loading) return [];

        if (selectedCategory === 'recommended') {
            if (!detectedDisease || detectedDisease.toLowerCase() === 'healthy') {
                return products.filter(p => p.type === 'organic').slice(0, 4);
            }
            // For now, recommendation based on product name/category matches or type
            // In a real app, this would be a backend call or sophisticated mapping
            // But for today, we'll recommend organic & protectors for diseases
            return products.filter(p => 
                p.category === 'Protection' || 
                p.type === 'organic'
            ).slice(0, 4);
        }

        return products.filter(p => {
            if (selectedCategory === 'fungicides') return p.category === 'Protection';
            if (selectedCategory === 'fertilizer') return p.category === 'Fertilizer';
            if (selectedCategory === 'organic') return p.type === 'organic';
            return true;
        });

    }, [products, detectedDisease, selectedCategory, loading]);

    const categories = [
        { id: 'recommended', label: 'AI Recommended', count: detectedDisease ? '!' : '*' },
        { id: 'fungicides', label: 'Protection', count: products.filter(p => p.category === 'Protection').length },
        { id: 'fertilizer', label: 'Nutrients', count: products.filter(p => p.category === 'Fertilizer').length },
        { id: 'organic', label: 'Bio-Organic', count: products.filter(p => p.type === 'organic').length },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing with Global Hub...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Category Filter */}
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-6 py-4 rounded-3xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 border ${selectedCategory === cat.id
                            ? 'bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-200 ring-4 ring-slate-900/5'
                            : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200'
                            }`}
                    >
                        {cat.label} <span className={`ml-2 px-1.5 py-0.5 rounded-lg text-[8px] ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-300'}`}>{cat.count}</span>
                    </button>
                ))}
            </div>

            {/* Recommended Alert if Disease Detected */}
            {detectedDisease && detectedDisease.toLowerCase() !== 'healthy' && selectedCategory === 'recommended' && (
                <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-[2.5rem] p-8 flex items-start gap-6 shadow-sm"
                >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-500 shadow-sm border border-amber-50">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-amber-700 font-black text-xs uppercase tracking-[0.2em] mb-2">Neural Remediation Protocol</p>
                        <p className="text-slate-600 text-sm leading-relaxed font-medium">
                            Diagnosis confirmed: <strong className="text-slate-900">{detectedDisease}</strong>. The neural system has prioritized these botanical solutions to neutralize the threat and restore vitality.
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, idx) => (
                            <ProductCard 
                                key={product.id} 
                                product={product} 
                                index={idx} 
                                isPurchasing={isPurchasing === product.id}
                                onBuy={() => handlePurchase(product)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-24 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200 shadow-sm">
                                <ShoppingBag className="w-10 h-10" />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Neural Hub: Batch Currently Offline</p>
                            <button
                                onClick={() => setSelectedCategory('recommended')}
                                className="mt-6 px-8 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                            >
                                Reset Hub Filters
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function ProductCard({ product, index, isPurchasing, onBuy }: { product: Product; index: number; isPurchasing: boolean; onBuy: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
            layout
            className="group relative bg-white rounded-[3rem] border border-slate-100 overflow-hidden hover:border-emerald-200 transition-all duration-700 hover:shadow-[0_32px_64px_-16px_rgba(16,185,129,0.1)] flex flex-col h-[480px]"
        >
            {/* Visual Header */}
            <div className="relative h-56 bg-slate-50 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/20 z-10" />
                <img 
                    src={product.image} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale-[0.2] group-hover:grayscale-0" 
                    alt={product.name} 
                />
                
                {/* Type Badge */}
                <div className="absolute top-6 left-6 z-20">
                    <span className={`backdrop-blur-xl px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                        product.type === 'organic' 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' 
                        : product.type === 'chemical'
                        ? 'bg-blue-500/10 border-blue-500/20 text-blue-600'
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                    }`}>
                        {product.type}
                    </span>
                </div>

                {/* Rating Overlay */}
                <div className="absolute bottom-4 right-6 z-20 bg-white/70 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1.5 border border-white/50 shadow-sm">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-slate-700">4.9</span>
                </div>
            </div>

            {/* Content Body */}
            <div className="p-8 flex flex-col flex-1 relative">
                <div className="mb-4">
                    <p className="text-[9px] text-emerald-500 font-black uppercase tracking-[0.3em] mb-1.5">{product.chemicalName || 'Neural Compound'}</p>
                    <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter group-hover:text-emerald-600 transition-colors duration-500">{product.name}</h3>
                </div>

                <p className="text-xs text-slate-500 font-medium leading-relaxed mb-8 line-clamp-3">
                    {product.description}
                </p>

                {/* Action Footer */}
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Global Price</p>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900 tracking-tight">₹{product.price}</span>
                            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">/ Unit</span>
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onBuy}
                        disabled={isPurchasing}
                        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
                            isPurchasing 
                            ? 'bg-slate-100 text-slate-400' 
                            : 'bg-slate-900 text-white hover:bg-emerald-500 shadow-slate-200'
                        }`}
                    >
                        {isPurchasing ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <ArrowRight className="w-6 h-6" />
                        )}
                        
                        {/* Tooltip hover effect if needed */}
                    </motion.button>
                </div>
            </div>

            {/* Hover Accent */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </motion.div>
    );
}
