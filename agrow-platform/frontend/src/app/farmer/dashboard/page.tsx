"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, Loader2, AlertTriangle, CheckCircle, Leaf, MapPin, LogOut, CreditCard, Sparkles, Terminal, Activity, ShieldCheck, Info, Microscope, QrCode, User as UserIcon, ArrowRight, ShoppingBag, Box, History as HistoryIcon, Store, ChevronRight, BarChart3, CloudRain, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FarmerCard from '@/components/FarmerCard';
import LeafScanner from '@/components/LeafScanner';
import ModernMarketplace from '@/components/ModernMarketplace';

interface AnalysisLog {
    step: string;
    timestamp: string;
    status: 'info' | 'success' | 'warning';
}

interface Scan {
    id: string;
    imageUrl: string;
    predictedDisease: string;
    scientificName?: string;
    commonName?: string;
    confidence: number;
    status: 'Healthy' | 'Action Needed' | 'Critical';
    createdAt: string;
    advice: string;
    crop: string;
    symptoms?: string[];
    treatmentOrganic?: string;
    treatmentChemical?: string;
    analysisLogs?: AnalysisLog[];
    region?: string;
}

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

interface Purchase {
    id: string;
    userId: string;
    productId: string;
    productName: string;
    price: number;
    createdAt: string;
    status: 'ordered' | 'processing' | 'shipped' | 'in-transit' | 'out-for-delivery' | 'delivered';
    trackingId?: string;
    estimatedArrival?: string;
    logs?: Array<{
        event: string;
        location: string;
        timestamp: string;
        status: 'completed' | 'current' | 'upcoming';
    }>;
}

interface User {
    name: string;
    phone?: string;
    profileImage?: string | null;
    farmDetails: {
        location: string;
        crop: string;
        area: string;
    };
}

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [scans, setScans] = useState<Scan[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [uploadImage, setUploadImage] = useState<string | null>(null);
    const [showIdentityCard, setShowIdentityCard] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [activeTab, setActiveTab] = useState<'lab' | 'marketplace' | 'logistics'>('lab');
    const [analysisStatus, setAnalysisStatus] = useState<string>('Initializing');
    const [isPurchasing, setIsPurchasing] = useState<string | null>(null);
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

    // Disease Mapping Integration
    const [detectedDisease, setDetectedDisease] = useState<string | null>(null);
    const [matchReliability, setMatchReliability] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (!token || !userData) {
            router.push('/login');
            return;
        }
        setUser(JSON.parse(userData));
        fetchScans(token);
        fetchProducts();
        fetchPurchases(token);
    }, [router]);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/products');
            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (error) {
            console.error('Failed to fetch products');
        }
    };

    const fetchPurchases = async (token: string) => {
        try {
            const res = await fetch('http://localhost:3001/api/purchases', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPurchases(data);
            }
        } catch (error) {
            console.error('Failed to fetch purchases');
        }
    };

    const handlePurchaseSuccess = () => {
        const token = localStorage.getItem('token');
        if (token) fetchPurchases(token);
        setActiveTab('logistics');
    };

    const fetchScans = async (token: string) => {
        try {
            const res = await fetch('http://localhost:3001/api/scans', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setScans(data);
            }
        } catch (error) {
            console.error('Failed to fetch scans');
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadImage(reader.result as string);
                performScan(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const performScan = async (imgBase64: string) => {
        setIsScanning(true);
        setCurrentStep(0);

        // Standardized Neural Flash / Animation Pulse on Start
        const scannerFlash = document.createElement('div');
        scannerFlash.className = 'fixed inset-0 z-100 bg-white pointer-events-none mix-blend-overlay';
        document.body.appendChild(scannerFlash);

        const flashAnim = scannerFlash.animate([
            { opacity: 0 },
            { opacity: 0.6, offset: 0.1 },
            { opacity: 0 }
        ], { duration: 600, easing: 'ease-out' });

        flashAnim.onfinish = () => scannerFlash.remove();

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:3001/api/scans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    imageUrl: imgBase64,
                    crop: user?.farmDetails.crop
                })
            });

            if (res.ok) {
                const newScan = await res.json();
                if (newScan.analysisLogs) {
                    const totalDuration = 8000; // 8 seconds
                    const stepDuration = totalDuration / newScan.analysisLogs.length;
                    for (let i = 0; i < newScan.analysisLogs.length; i++) {
                        setCurrentStep(i);
                        setAnalysisStatus(newScan.analysisLogs[i].step);
                        await new Promise(r => setTimeout(r, stepDuration));
                    }
                }
                setScans(prev => [newScan, ...prev]);
            }
        } catch (error) {
            alert('AI Scan Engine Offline');
        } finally {
            setIsScanning(false);
        }
    };

    const handleScanComplete = (data: { disease: string | null; confidence: number; navigateToMarket?: boolean }) => {
        setDetectedDisease(data.disease);
        setMatchReliability(data.confidence);

        if (data.navigateToMarket) {
            setActiveTab('marketplace');
            // Smooth scroll to top or tabs
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    if (!user) return null;
    const lastScan = scans[0];

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 overflow-y-auto pb-32 relative selection:bg-emerald-100 selection:text-emerald-900 italic-headings">

            {/* 1. Fresh Atmospheric Background Layer */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-slate-50">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-emerald-50 opacity-80" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-[0.02]" />

                {/* Soft Organic Orbs */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-300/20 blur-[120px] rounded-full mix-blend-multiply"
                />
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-300/20 blur-[120px] rounded-full mix-blend-multiply"
                />

                {/* Light Grid Lines Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-size-[60px_60px]" />
            </div>

            {/* 2. Top Navigation / Header */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-emerald-100 py-5 px-6 md:px-12 flex justify-between items-center max-w-[1440px] mx-auto w-full shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-linear-to-br from-emerald-500 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20 text-white">
                        <Leaf className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] leading-none mb-1">Agrow Lens</p>
                        <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">Farm Executive</h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden md:block text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
                        <p className="text-sm font-black text-slate-700">{user.name}</p>
                    </div>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowIdentityCard(true)}
                        className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-md cursor-pointer flex items-center justify-center text-emerald-600 hover:ring-2 hover:ring-emerald-500/20 transition-all"
                    >
                        {user.profileImage ? <img src={user.profileImage} className="w-full h-full object-cover rounded-xl" /> : <UserIcon className="w-6 h-6" />}
                    </motion.div>
                </div>
            </nav>

            <main className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-12 py-10 space-y-12">

                {/* 3. Primary KPIs / Vitality Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: 'Farm Vitality', value: '98%', unit: 'Index', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', iconBg: 'bg-emerald-100' },
                        { label: 'Field Status', value: 'Optimal', unit: 'Stable', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100', iconBg: 'bg-blue-100' },
                        { label: 'Microclimate', value: 'Zone-A', unit: 'Thermal', icon: MapPin, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100', iconBg: 'bg-amber-100' }
                    ].map((kpi, i) => (
                        <div key={i} className={`rounded-4xl p-8 border ${kpi.bg} flex flex-col justify-between h-48 transition-all hover:scale-[1.02] hover:shadow-xl shadow-sm bg-white/50 backdrop-blur-sm`}>
                            <div className="flex justify-between items-start">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{kpi.label}</p>
                                <div className={`p-2 rounded-xl ${kpi.iconBg} ${kpi.color}`}>
                                    <kpi.icon className="w-5 h-5" />
                                </div>
                            </div>
                            <div>
                                <h3 className={`text-5xl font-black ${kpi.color} tracking-tighter leading-none mb-1`}>{kpi.value}</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{kpi.unit}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* 4. The Neural Lab (Integrated Primary Action) */}
                <section className="relative">
                    <LeafScanner onScanComplete={handleScanComplete} />
                </section>

                {/* 5. Commerce & Interaction Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-20">

                    {/* Marketplace Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-12 text-slate-800 relative overflow-hidden group border border-slate-100 shadow-xl hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full -mr-20 -mt-20 blur-[80px] group-hover:bg-blue-500/10 transition-all duration-700" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 mb-8 shadow-sm">
                                <ShoppingBag className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-4xl font-black mb-4 tracking-tight leading-none text-slate-900">Global <br /> Marketplace</h3>
                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Secure procurement of botanical nutrients and minerals with verified neural batch traces.</p>
                        </div>

                        {/* Quick View of Products */}
                        <div className="relative z-10 grid grid-cols-2 gap-3 my-10">
                            {products.slice(0, 2).map((prod, i) => (
                                <div key={i} className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center gap-4 hover:border-blue-200 hover:shadow-md transition-all">
                                    <img src={prod.image} className="w-10 h-10 rounded-lg object-cover" />
                                    <div className='min-w-0'>
                                        <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest truncate">{prod.category}</p>
                                        <p className="text-xs font-black truncate text-slate-800">{prod.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setActiveTab('marketplace')}
                            className="relative z-10 flex items-center justify-center gap-3 bg-slate-900 text-white w-full py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95 shadow-slate-200"
                        >
                            SECURE PROCUREMENT <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Fulfillment & Logs Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 md:p-12 border border-slate-100 shadow-xl flex flex-col justify-between min-h-[480px] hover:shadow-2xl transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full -mr-20 -mt-20 blur-[80px]" />
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100 mb-8 shadow-sm">
                                <Box className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-4xl font-black mb-4 tracking-tight leading-none text-slate-900">Activity <br /> Monitor</h3>
                            <p className="text-slate-500 text-sm max-w-xs leading-relaxed">Real-time telemetry of fulfillment cycles and historical diagnostic data points.</p>
                        </div>

                        {/* Delivery/Log Items */}
                        <div className="space-y-4 my-10 relative z-10">
                            {purchases.slice(0, 3).map((pur, i) => (
                                <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl group hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-emerald-500 transition-colors">
                                            <Activity className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800">{pur.productName}</p>
                                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{pur.trackingId}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500" />
                                </div>
                            ))}
                            {purchases.length === 0 && <p className="text-center py-10 text-slate-400 text-xs italic font-medium">Clear fulfillment queue</p>}
                        </div>

                        <button
                            onClick={() => setActiveTab('logistics')}
                            className="relative z-10 bg-slate-100 text-slate-500 w-full py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition-all active:scale-95"
                        >
                            CHECK ACTIVITY
                        </button>
                    </div>

                </section>
            </main>

            {/* 6. Bottom Navigation (Optimized for Mobile Context) */}
            <div className="fixed bottom-0 left-0 right-0 z-60 px-6 pb-8 pointer-events-none md:hidden">
                <div className="max-w-md mx-auto bg-white/90 backdrop-blur-xl rounded-[2.5rem] border border-emerald-100 p-2 shadow-2xl pointer-events-auto flex items-center justify-between ring-1 ring-emerald-50/50">
                    {[
                        { id: 'home', icon: Leaf, label: 'Home' },
                        { id: 'lab', icon: Microscope, label: 'Lab' },
                        { id: 'marketplace', icon: Store, label: 'Shop' },
                        { id: 'logistics', icon: Box, label: 'Logs' }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => {
                                if (btn.id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
                                setActiveTab(btn.id === 'home' ? 'lab' : btn.id as any);
                            }}
                            className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-4xl transition-all ${(btn.id === 'home' && activeTab === 'lab' && window.scrollY < 100) || (btn.id !== 'home' && activeTab === btn.id)
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            <btn.icon className="w-5 h-5" />
                            <span className="text-[8px] font-black uppercase tracking-widest">{btn.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 7. MODALS & SUB-VIEWS (Rendered via AnimatePresence) */}
            <AnimatePresence>
                {/* Product Detail / Purchase Modal */}
                {selectedPurchase && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-[3.5rem] p-10 shadow-2xl border border-slate-100 overflow-hidden relative">
                            <button onClick={() => setSelectedPurchase(null)} className="absolute top-8 right-8 p-3 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all"><LogOut className="w-5 h-5 rotate-180 text-slate-400" /></button>
                            <div className="mb-10">
                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 border-b border-emerald-100 inline-block pb-1">Fulfillment Status</p>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Delivery Insight</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                                    <h4 className="text-xl font-black text-slate-900 mb-1">{selectedPurchase.productName}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{selectedPurchase.trackingId}</p>
                                    <div className="mt-6 text-sm font-bold text-emerald-600 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        In-Transit: Stratosphere
                                    </div>
                                </div>

                                <div className="space-y-6 relative pl-6 border-l-2 border-slate-200 ml-4">
                                    {(selectedPurchase.logs || []).map((l, i) => (
                                        <div key={i} className="relative">
                                            <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${l.status === 'completed' ? 'bg-emerald-500' : l.status === 'current' ? 'bg-emerald-500 scale-125 ring-8 ring-emerald-100' : 'bg-slate-200'}`} />
                                            <p className={`text-sm font-black ${l.status === 'upcoming' ? 'text-slate-400' : 'text-slate-800'}`}>{l.event}</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{l.location} • {l.timestamp}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button onClick={() => setSelectedPurchase(null)} className="w-full mt-10 py-6 bg-slate-900 text-white rounded-4xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg active:scale-95">Accept & Sync</button>
                        </motion.div>
                    </motion.div>
                )}

                {showIdentityCard && user && (
                    <FarmerCard
                        name={user.name}
                        phone={user.phone || "Social Identity"}
                        location={user.farmDetails?.location || "Field Network"}
                        crop={user.farmDetails?.crop || "Multi-crop"}
                        profileImage={user.profileImage}
                        onClose={() => setShowIdentityCard(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sub-view Overlays (Tabbed content rendered as overlays or full-page overrides as needed) */}
            {activeTab !== 'lab' && (
                <div className="fixed inset-0 z-40 bg-slate-50/95 backdrop-blur-3xl overflow-y-auto px-6 py-12 md:p-24">
                    <div className="max-w-7xl mx-auto pb-24">
                        <div className="flex justify-between items-center mb-12">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter capitalize">{activeTab} View</h2>
                            <button onClick={() => setActiveTab('lab')} className="p-4 bg-white rounded-3xl hover:bg-slate-100 transition-all shadow-sm border border-slate-100"><LogOut className="w-6 h-6 rotate-180 text-slate-400" /></button>
                        </div>

                        {activeTab === 'marketplace' && (
                            <ModernMarketplace 
                                detectedDisease={detectedDisease} 
                                matchReliability={matchReliability}
                                onPurchaseSuccess={handlePurchaseSuccess}
                            />
                        )}

                        {activeTab === 'logistics' && (
                            <div className="space-y-6">
                                {purchases.map((purchase) => (
                                    <div key={purchase.id} onClick={() => setSelectedPurchase(purchase)} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center justify-between shadow-sm cursor-pointer hover:border-emerald-200 transition-all group hover:bg-slate-50">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors border border-slate-100">
                                                <Box className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{purchase.trackingId}</p>
                                                <h4 className="text-2xl font-black text-slate-800">{purchase.productName}</h4>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 text-right">
                                            <div className="hidden md:block">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Status</p>
                                                <p className="text-sm font-black text-emerald-600">{purchase.status}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-emerald-600" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}


