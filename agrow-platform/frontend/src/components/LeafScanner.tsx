"use client";

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, Sparkles, AlertCircle, CheckCircle, Info, ArrowRight, Leaf, Shield as ShieldAlert, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LeafScanner Component
 * 
 * Features:
 * - Camera capture for mobile/field use
 * - File upload for pre-captured images
 * - Real-time AI processing visualization
 * - High-impact result cards for identity and diagnostics
 */

interface ScanResult {
    plantName: string | null;
    scientificName: string | null;
    diseaseName: string | null;
    confidence: number | null;
    remedy: string | null;
    yieldImpact?: string;
    treatmentForecast?: string;
    error?: string;
}

interface LeafScannerProps {
    onScanComplete?: (data: { disease: string | null; confidence: number; navigateToMarket?: boolean }) => void;
}

export default function LeafScanner({ onScanComplete }: LeafScannerProps) {
    const [image, setImage] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<ScanResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [selectedCrop, setSelectedCrop] = useState<string>('random');
    const [showNotification, setShowNotification] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const crops = [
        { id: 'random', name: 'Auto Detect', icon: Sparkles },
        { id: 'Tomato', name: 'Tomato', icon: Leaf },
        { id: 'Maize (Corn)', name: 'Maize (Corn)', icon: Leaf },
        { id: 'Potato', name: 'Potato', icon: Leaf },
        { id: 'Rice', name: 'Rice', icon: Leaf },
    ];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setImage(base64);
                handleScan(base64);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleScan = async (base64Image: string) => {
        setIsScanning(true);
        setResult(null);
        setError(null);

        try {
            const token = localStorage.getItem('token');

            // PRIORITY 1: Try the Local AI Research Server (Flask + TensorFlow Model on port 5000)
            try {
                console.log('--- ATTEMPTING LOCAL AI ENGINE (Port 5000) ---');

                const localRes = await fetch(process.env.NEXT_PUBLIC_AI_BACKEND_URL || 'http://127.0.0.1:5000/api/analyze-crop', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ image: base64Image }),
                    signal: AbortSignal.timeout(30000) // 30 second timeout for model inference
                });

                if (localRes.ok) {
                    const data = await localRes.json();
                    if (data.detections && data.detections.length > 0) {
                        const topMatch = data.detections[0];
                        const disease = (topMatch.disease || topMatch.name).toLowerCase().includes('healthy') ? null : (topMatch.disease || topMatch.name);

                        setResult({
                            plantName: topMatch.plant || topMatch.name,
                            scientificName: topMatch.scientific_name || `${topMatch.plant || topMatch.name} spp.`,
                            diseaseName: disease,
                            confidence: topMatch.confidence,
                            remedy: topMatch.solutions ? topMatch.solutions.join('\n') : topMatch.reason,
                        });

                        // Background sync to SQL database 
                        try {
                            if (token) {
                                fetch(`${process.env.NEXT_PUBLIC_CORE_BACKEND_URL || 'http://localhost:3001'}/api/scans/save-local`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${token}`
                                    },
                                    body: JSON.stringify({
                                        crop: topMatch.plant || topMatch.name,
                                        predictedDisease: disease,
                                        scientificName: topMatch.scientific_name,
                                        commonName: topMatch.plant || topMatch.name,
                                        confidence: topMatch.confidence,
                                        advice: topMatch.reason,
                                        symptoms: [],
                                        treatmentOrganic: topMatch.solutions ? topMatch.solutions.join('\n') : null,
                                        treatmentChemical: null
                                    })
                                }).catch(e => console.error("Background sync failed:", e));
                            }
                        } catch (syncErr) {
                            console.error("Sync error:", syncErr);
                        }

                        // Notify parent
                        if (onScanComplete) {
                            onScanComplete({
                                disease: disease || 'healthy',
                                confidence: topMatch.confidence
                            });
                        }

                        return; // Success - exit early
                    }
                }
            } catch (localErr: any) {
                // Local AI not running, fall through to Gemini backend
                console.log('Local AI Engine on port 5000 not available:', localErr.message);
            }

            // PRIORITY 2: Use the Gemini Universal AI Engine (Backend on port 3001)
            const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_BACKEND_URL || 'http://localhost:3001'}/api/scans`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    imageUrl: base64Image,
                    crop: selectedCrop !== 'random' ? selectedCrop : undefined
                }),
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error("Unauthorized: Please login again.");
                throw new Error("Neural Engine Connection Failed");
            }

            const data = await response.json();
            const disease = data.predictedDisease === 'Healthy' ? null : data.predictedDisease;

            setResult({
                plantName: data.crop,
                scientificName: data.scientificName,
                diseaseName: disease,
                confidence: data.confidence,
                remedy: data.advice || data.treatmentOrganic,
                yieldImpact: data.yieldImpact,
                treatmentForecast: data.treatmentForecast
            });

            // Trigger Mock Notification if diseased
            if (disease) {
                setShowNotification(true);
                // Auto-hide after 8 seconds
                setTimeout(() => setShowNotification(false), 8000);
            }

            // Notify parent
            if (onScanComplete) {
                onScanComplete({
                    disease: disease || 'healthy',
                    confidence: data.confidence
                });
            }

        } catch (err: any) {
            setError(err.message || "Strategic link to neural engine failed. Check terminal connection.");
        } finally {
            setIsScanning(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-10 relative">
            
            {/* Mock SMS / Push Notification */}
            <AnimatePresence>
                {showNotification && result?.diseaseName && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-slate-900 text-white p-4 rounded-3xl shadow-2xl border border-slate-700 z-50 flex gap-4 items-start"
                    >
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                            <Bell className="w-5 h-5 text-slate-900" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <p className="text-xs font-black text-emerald-400 uppercase tracking-wider">AGROW Alert</p>
                                <button onClick={() => setShowNotification(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-sm font-medium leading-snug">
                                Critical Update: {result.diseaseName} detected on {selectedCrop !== 'random' ? selectedCrop : 'your field'}. Check diagnostic pack immediately for treatment.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. Capture Zone */}
            <section className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-10 shadow-2xl border border-slate-100 overflow-hidden relative group hover:border-emerald-200 transition-all">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />

                <p className="text-slate-500 text-sm mb-6 text-center relative z-10">
                    Select your crop type for optimized neural processing and precise diagnostics.
                </p>

                {/* Crop Selection */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8 relative z-10">
                    {crops.map((crop) => (
                        <button
                            key={crop.id}
                            onClick={() => setSelectedCrop(crop.id)}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 ${selectedCrop === crop.id
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-500'
                                }`}
                        >
                            <crop.icon size={16} />
                            <span className="text-xs font-medium">{crop.name}</span>
                        </button>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 relative z-10">
                    <div className="flex-1 text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 px-4 py-1.5 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-6 border border-emerald-200 shadow-sm">
                            <Sparkles className="w-3 h-3" />
                            Neural Lens System
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4 drop-shadow-sm">Identify & Diagnose</h2>
                        <p className="text-slate-500 font-medium max-w-md">Upload or capture a leaf photo for instant botanical identification and pathogen analysis using AGROW Lens AI.</p>

                        {/* Hidden Input for camera/file access */}
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <div className="mt-10 flex flex-wrap gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-10 py-5 bg-slate-900 text-white rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-lg shadow-slate-200"
                            >
                                <Camera className="w-4 h-4" /> Start Scanning
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="px-10 py-5 bg-white text-slate-500 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-50 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition-all flex items-center gap-3 shadow-sm"
                            >
                                <Upload className="w-4 h-4" /> Upload File
                            </button>
                        </div>
                    </div>

                    {/* Image Preview / Scanner Effect */}
                    <div className="w-full md:w-80 aspect-square bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden relative group hover:border-emerald-300 transition-colors">
                        {image ? (
                            <img src={image} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" alt="Scanning Preview" />
                        ) : (
                            <div className="text-slate-400 text-center group-hover:text-slate-500 transition-colors">
                                <Leaf className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Optics</p>
                            </div>
                        )}

                        <AnimatePresence>
                            {isScanning && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center border border-emerald-500/20"
                                >
                                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-400" />
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] animate-pulse text-emerald-400">Analyzing Cell Structure...</p>
                                    <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 4, ease: "easeInOut" }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </section>

            {/* 2. Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center gap-4 text-rose-400"
                    >
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 3. Results Area */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Plant Identity Card */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-10 border border-slate-100 shadow-2xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 border border-slate-100 shadow-inner">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Botanical Identity</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{result.plantName || "Unknown Species"}</h3>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-4 border-b border-slate-100">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Scientific Name</p>
                                    <p className="text-sm font-black text-slate-700 italic">{result.scientificName || "N/A"}</p>
                                </div>
                                <div className="flex justify-between items-center py-4">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Match Reliability</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-emerald-600">{(result.confidence || 0).toFixed(1)}%</span>
                                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 shadow-[0_0_8px_#10b981]" style={{ width: `${(result.confidence || 0) * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pathogen / Health Card */}
                        <div className={`rounded-[2.5rem] p-10 border shadow-2xl backdrop-blur-xl ${result.diseaseName ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner ${result.diseaseName ? 'bg-amber-100 text-amber-600 border border-amber-200' : 'bg-emerald-100 text-emerald-600 border border-emerald-200'}`}>
                                    {result.diseaseName ? <ShieldAlert className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Diagnostic Report</p>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                                        {result.diseaseName || "Perfectly Healthy"}
                                    </h3>
                                </div>
                            </div>

                            {result.diseaseName ? (
                                <div className="space-y-6">
                                    {/* Yield Warning */}
                                    {result.yieldImpact && (
                                        <div className="bg-rose-500/10 p-5 rounded-3xl border border-rose-500/20">
                                            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" /> Yield Impact Forecast
                                            </p>
                                            <p className="text-sm font-bold text-rose-600 leading-relaxed">
                                                {result.yieldImpact}
                                            </p>
                                        </div>
                                    )}

                                    {/* Treatment Forecast */}
                                    {result.treatmentForecast && (
                                        <div className="bg-emerald-500/10 p-5 rounded-3xl border border-emerald-500/20">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                <CheckCircle className="w-3 h-3" /> Treatment Forecast
                                            </p>
                                            <p className="text-sm font-bold text-emerald-700 leading-relaxed">
                                                {result.treatmentForecast}
                                            </p>
                                        </div>
                                    )}

                                    {/* Detailed Remedy */}
                                    <div className="bg-white/60 p-6 rounded-3xl border border-amber-100">
                                        <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <Info className="w-3 h-3" /> Recommended Solution
                                        </p>
                                        <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-line">
                                            {result.remedy}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => onScanComplete && onScanComplete({ disease: result.diseaseName || 'healthy', confidence: result.confidence || 0, navigateToMarket: true })}
                                        className="w-full py-5 bg-slate-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
                                    >
                                        Order Remediation Batch <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                    No visual pathogens detected on the sample. The leaf tissue shows optimal chlorophyll levels and cell structure. Continue current maintenance cycle.
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
