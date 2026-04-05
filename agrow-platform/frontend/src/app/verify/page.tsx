"use client";

import { useSearchParams } from 'next/navigation';
import { ShieldCheck, User, Leaf, MapPin, CheckCircle2, Globe, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

function VerifyContent() {
    const searchParams = useSearchParams();
    const phone = searchParams.get('phone') || "Unknown";
    const name = searchParams.get('name') || "Farmer ID";
    const location = searchParams.get('loc') || "Verified Region";
    const crop = searchParams.get('crop') || "Organic Produce";

    return (
        <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 text-stone-900 font-sans">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-stone-200 border border-stone-100 overflow-hidden"
            >
                {/* Status Banner */}
                <div className="bg-green-600 py-6 px-4 text-center">
                    <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 border border-white/30">
                        <ShieldCheck className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-white font-black text-2xl tracking-tight">Identity Verified</h1>
                    <p className="text-green-100 text-sm font-bold uppercase tracking-widest mt-1">AGROW Social Trust Network</p>
                </div>

                <div className="p-10 space-y-8">
                    {/* Farmer Identity */}
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 bg-stone-50 rounded-3xl flex items-center justify-center border-2 border-stone-100 shadow-inner">
                            <User className="w-10 h-10 text-stone-300" />
                        </div>
                        <div>
                            <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mb-1">AGROW Member</p>
                            <h2 className="text-2xl font-black text-stone-900 leading-tight">{name}</h2>
                            <p className="text-sm font-bold text-stone-500 mt-0.5">{phone}</p>
                        </div>
                    </div>

                    {/* Verification Details */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100">
                            <p className="text-[10px] text-stone-400 font-black mb-2">Primary Crop</p>
                            <div className="flex items-center gap-2 text-green-700 font-bold">
                                <Leaf className="w-4 h-4" />
                                <span>{crop}</span>
                            </div>
                        </div>
                        <div className="bg-stone-50 p-4 rounded-3xl border border-stone-100">
                            <p className="text-[10px] text-stone-400 font-black mb-2">Location</p>
                            <div className="flex items-center gap-2 text-stone-700 font-bold">
                                <MapPin className="w-4 h-4 text-red-500" />
                                <span>{location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Pillar */}
                    <div className="bg-green-50/50 p-6 rounded-4xl border-2 border-green-100/50 relative overflow-hidden">
                        <CheckCircle2 className="absolute -right-4 -bottom-4 w-24 h-24 text-green-100 opacity-50" />
                        <div className="relative z-10 text-center">
                            <p className="text-sm font-bold text-green-800 leading-relaxed mb-4">
                                "This profile is verified by the AGROW Social Team via on-ground field outreach. All data is anchored on the AGROW Blockchain for immutable digital trust."
                            </p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                <Globe className="w-3 h-3" />
                                Globally Validated
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-stone-50 px-10 py-6 border-t border-stone-100 flex justify-center">
                    <Link href="/" className="text-xs font-bold text-stone-400 hover:text-green-600 transition-colors flex items-center gap-2">
                        <ArrowLeft className="w-3 h-3" /> Return to AGROW Ecosystem
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-stone-50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}
