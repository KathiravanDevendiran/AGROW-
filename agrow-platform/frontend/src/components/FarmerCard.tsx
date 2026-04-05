"use client";

import { motion } from 'framer-motion';
import { Leaf, Phone, User, QrCode, Download, ShieldCheck, MapPin, X } from 'lucide-react';

interface FarmerCardProps {
    name: string;
    phone: string;
    location: string;
    crop: string;
    profileImage?: string | null;
    onClose: () => void;
}

const FarmerCard = ({ name, phone, location, crop, profileImage, onClose }: FarmerCardProps) => {
    // Generating the verification URL for the demo
    // In a real app, this would be a secure, shorter link.
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://agrow.land';
    const verifyUrl = `${baseUrl}/verify?phone=${encodeURIComponent(phone)}&name=${encodeURIComponent(name)}&loc=${encodeURIComponent(location)}&crop=${encodeURIComponent(crop)}`;
    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=${encodeURIComponent(verifyUrl)}&choe=UTF-8`;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative w-full max-w-sm bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Card Header Background */}
                <div className="absolute top-0 inset-x-0 h-28 bg-linear-to-br from-emerald-500 to-teal-600 rounded-b-[3rem] shadow-lg shadow-emerald-500/20" />

                <div className="relative p-6 pt-6">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-2 text-white/90 bg-black/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
                            <Leaf className="w-3 h-3 text-emerald-100" />
                            <span className="font-bold tracking-widest text-[10px]">AGROW IDENTITY</span>
                        </div>
                        <button onClick={onClose} className="bg-black/10 p-2 rounded-full text-white/70 hover:bg-black/20 hover:text-white transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Profile Section */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                            <div className="w-24 h-24 bg-slate-100 rounded-4xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden ring-1 ring-slate-100">
                                {profileImage ? (
                                    <img src={profileImage} alt={name} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-10 h-10 text-slate-400" />
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 p-1.5 rounded-xl border-4 border-white shadow-lg text-white">
                                <ShieldCheck className="w-3 h-3" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-1">{name}</h3>
                        <div className="flex items-center gap-3 text-slate-500 font-bold text-[10px] uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                            <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {phone}</span>
                            <span className="w-px h-3 bg-slate-200" />
                            <span className="flex items-center gap-1 text-emerald-600"><Leaf className="w-3 h-3" /> {crop}</span>
                        </div>
                    </div>

                    {/* QR Code Section - Condensed */}
                    <div className="bg-slate-50 rounded-4xl p-5 shadow-inner border border-slate-100 mb-6 flex flex-col items-center relative group overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        <div className="bg-white p-2 rounded-xl mb-3 group-hover:scale-105 transition-transform duration-300 shadow-md border border-slate-100">
                            <img
                                src={qrUrl}
                                alt="QR Code"
                                className="w-24 h-24 opacity-90"
                            />
                        </div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] text-center relative z-10">
                            Scan to verify demo
                        </p>
                    </div>

                    {/* Footer Info - Compact */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">Location</p>
                            <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1 truncate">
                                <MapPin className="w-3 h-3 text-emerald-500" />
                                {location}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                            <p className="text-[8px] text-slate-400 font-bold uppercase mb-1">Trust Level</p>
                            <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                Verified
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            className="flex-1 bg-slate-900 text-white text-xs font-black uppercase tracking-wider py-4 rounded-2xl shadow-lg transition-all hover:bg-emerald-500 hover:scale-[1.02] flex items-center justify-center gap-2 active:scale-95"
                            onClick={() => window.print()}
                        >
                            <Download className="w-4 h-4" />
                            Save Card
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FarmerCard;
