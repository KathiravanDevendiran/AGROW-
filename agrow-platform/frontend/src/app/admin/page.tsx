"use client";

import { useState, useEffect } from 'react';
import { Users, Activity, Leaf, ShieldAlert, Loader2, Search, Database, Fingerprint, Calendar, Wifi, Terminal, Download, FileText, FileSpreadsheet, MapPin } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { unparse } from 'papaparse';
import { saveAs } from 'file-saver';
import dynamic from 'next/dynamic';

const AdminMap = dynamic(() => import('../../components/AdminMap'), { 
    ssr: false, 
    loading: () => <div className="w-full h-full bg-[#0A0F14] animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5 flex items-center justify-center"><p className="text-xs font-mono font-black text-slate-600 uppercase tracking-widest">Warming Up Geo-Satellite Links...</p></div> 
});

interface SystemUser {
    id: string;
    name: string;
    phone: string;
    role: string;
    farmLocation: string;
    farmCrop: string;
    createdAt: string;
    scanCount: number;
    lastScanDate: string | null;
}

interface RecentScan {
    id: string;
    crop: string;
    predictedDisease: string | null;
    confidence: number;
    isLocalScan: number;
    createdAt: string;
    userName: string;
    userPhone: string;
}

export default function AdminDashboard() {
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [scans, setScans] = useState<RecentScan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CORE_BACKEND_URL || 'http://localhost:3001'}/api/admin/system-data`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch system data from database');
                }

                const data = await response.json();
                setUsers(data.users || []);
                setScans(data.recentScans || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdminData();
        
        // Polling to simulate real-time feeds
        const interval = setInterval(fetchAdminData, 15000); // 15s refresh
        return () => clearInterval(interval);
    }, []);

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.phone.includes(searchTerm)
    );

    const handleExportCSV = () => {
        // Export Users
        const usersCsvData = users.map(u => ({
            'Farmer ID': u.id,
            'Name': u.name,
            'Phone': u.phone,
            'Location': u.farmLocation,
            'Crop': u.farmCrop,
            'Total Scans': u.scanCount,
            'Joined Date': new Date(u.createdAt).toLocaleDateString()
        }));

        const usersCsv = unparse(usersCsvData);
        saveAs(new Blob([usersCsv], { type: 'text/csv;charset=utf-8;' }), 'agrow_lens_users.csv');

        // Export Scans
        const scansCsvData = scans.map(s => ({
            'Scan ID': s.id,
            'Farmer Name': s.userName,
            'Farmer Phone': s.userPhone,
            'Crop': s.crop,
            'Predicted Disease': s.predictedDisease || 'Healthy',
            'Confidence %': s.confidence.toFixed(2),
            'Date': new Date(s.createdAt).toLocaleString()
        }));

        const scansCsv = unparse(scansCsvData);
        saveAs(new Blob([scansCsv], { type: 'text/csv;charset=utf-8;' }), 'agrow_lens_scans.csv');
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        
        doc.setFontSize(22);
        doc.text('AGROW LENS - System Report', 14, 20);
        
        doc.setFontSize(11);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
        doc.text(`Total Registered Farmers: ${users.length}`, 14, 38);
        doc.text(`Total System Scans: ${scans.length}`, 14, 46);
        const pathogens = scans.filter(s => s.predictedDisease && s.predictedDisease !== 'Healthy').length;
        doc.text(`Detected Anomalies / Pathogens: ${pathogens}`, 14, 54);

        // Users Table
        autoTable(doc, {
            startY: 65,
            head: [['Name', 'Phone', 'Location', 'Crop', 'Total Scans']],
            body: users.map(u => [u.name, u.phone, u.farmLocation, u.farmCrop, u.scanCount]),
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129] } // emerald-500
        });

        // Scans Table
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 15,
            head: [['Date', 'Farmer', 'Crop', 'Condition', 'Confidence']],
            body: scans.slice(0, 50).map(s => [ // Limit to 50 for pdf to save space
                new Date(s.createdAt).toLocaleDateString(),
                s.userName,
                s.crop,
                s.predictedDisease || 'Healthy',
                `${s.confidence.toFixed(1)}%`
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] } // blue-500
        });

        doc.save('agrow_lens_report.pdf');
    };

    // Animation Variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    // --- Loading UI ---
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center font-mono text-emerald-400">
                <div className="flex flex-col items-center gap-6">
                    <Loader2 className="w-16 h-16 animate-spin drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                    <div className="text-center">
                        <p className="text-sm font-black uppercase tracking-[0.3em] mb-2">Establishing Secure Link</p>
                        <p className="text-xs text-emerald-600 animate-pulse">Querying Central Neural Database...</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- Error UI ---
    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0F14] flex items-center justify-center p-8 font-mono">
                <div className="max-w-2xl w-full bg-red-950/30 text-rose-400 p-8 rounded-4xl border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.05)] backdrop-blur-xl flex flex-col items-center text-center gap-4">
                    <ShieldAlert className="w-16 h-16 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)]" />
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-widest mb-2 text-white">Neural Disconnect Active</h2>
                        <p className="text-sm border border-rose-500/30 bg-rose-950/50 p-4 rounded-xl">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    // --- Main Dashboard UI ---
    return (
        <div className="min-h-screen bg-[#070B0E] text-slate-300 font-sans selection:bg-emerald-500/30">
            {/* Background Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

            {/* Header */}
            <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0F14]/70 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-linear-to-br from-emerald-500/20 to-emerald-900/20 rounded-2xl flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)] relative">
                            <div className="absolute inset-0 border border-emerald-400/50 rounded-2xl animate-ping opacity-20" />
                            <Terminal className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white tracking-tight uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">Sys<span className="text-emerald-400 font-light">Admin</span> Terminal</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="flex items-center justify-center w-2 h-2 rounded-full bg-emerald-500 drop-shadow-[0_0_5px_rgba(16,185,129,1)]">
                                    <span className="absolute w-4 h-4 rounded-full bg-emerald-500/40 animate-ping" />
                                </span>
                                <p className="text-[10px] font-mono font-bold text-emerald-500 uppercase tracking-[0.2em] shadow-emerald-500/50">Core Engine Online</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative max-w-md w-full md:w-64 group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
                            </div>
                            <input 
                                type="text" 
                                placeholder="TRACE NODE //"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 focus:bg-[#0A0F14] outline-none transition-all placeholder:text-slate-600 text-white"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <button 
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/10 hover:border-emerald-500/50 px-4 py-3 rounded-2xl text-xs font-mono font-bold transition-all"
                                title="Export SQL Data to CSV"
                            >
                                <FileSpreadsheet className="w-4 h-4" /> CSV
                            </button>
                            <button 
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/50 px-4 py-3 rounded-2xl text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                                title="Generate PDF System Report"
                            >
                                <FileText className="w-4 h-4" /> PDF
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-10"
                >
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Users Metric */}
                        <motion.div variants={itemVariants} className="group relative bg-[#0A0F14]/80 backdrop-blur-xl rounded-4xl p-8 border border-white/5 hover:border-blue-500/30 transition-all overflow-hidden flex items-end justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-blue-500/10" />
                            <div className="relative z-10 w-full">
                                <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                    <Users className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Registered Nodes</p>
                                <h3 className="text-5xl font-black text-white">{users.length}</h3>
                            </div>
                        </motion.div>
                        
                        {/* Total Scans Metric */}
                        <motion.div variants={itemVariants} className="group relative bg-[#0A0F14]/80 backdrop-blur-xl rounded-4xl p-8 border border-white/5 hover:border-emerald-500/30 transition-all overflow-hidden flex items-end justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/10" />
                            <div className="relative z-10 w-full flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-linear-to-br from-emerald-500/20 to-emerald-900/20 text-emerald-400 rounded-4xl flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:rotate-12 transition-transform shadow-[0_0_30px_rgba(16,185,129,0.15)] relative">
                                    <Activity className="w-7 h-7" />
                                    <span className="absolute top-[-4px] right-[-4px] flex h-3 w-3">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <p className="text-[10px] font-mono font-black text-emerald-500/70 uppercase tracking-[0.3em] mb-2">System Telemetry</p>
                                <h3 className="text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-emerald-200 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                    {scans.length}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono mt-3 uppercase tracking-wider bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                                    Total SQL Ingests
                                </p>
                            </div>
                        </motion.div>
                        
                        {/* Issues Metric */}
                        <motion.div variants={itemVariants} className="group relative bg-[#0A0F14]/80 backdrop-blur-xl rounded-4xl p-8 border border-white/5 hover:border-amber-500/30 transition-all overflow-hidden flex items-end justify-between">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-amber-500/10" />
                            <div className="relative z-10 w-full text-right">
                                <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mb-6 border border-amber-500/20 group-hover:scale-110 transition-transform ml-auto shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                                <p className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Anomalies Detected</p>
                                <h3 className="text-5xl font-black text-white">
                                    {scans.filter(s => s.predictedDisease && s.predictedDisease !== 'Healthy').length}
                                </h3>
                            </div>
                        </motion.div>
                    </div>

                    {/* Geographic Map Section */}
                    <motion.div variants={itemVariants} className="bg-[#0A0F14]/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-[500px] overflow-hidden relative">
                        {/* Decorative Top Accent */}
                        <div className="h-1 w-full bg-linear-to-r from-transparent via-amber-500/50 to-transparent opacity-50 absolute top-0 z-20" />
                        
                        <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between z-10">
                            <h2 className="text-lg font-black text-white flex items-center gap-3 tracking-wide">
                                <MapPin className="w-5 h-5 text-amber-400" /> 
                                SENSOR DEPLOYMENT HEATMAP
                            </h2>
                            <span className="text-[10px] font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full tracking-[0.2em]">
                                {filteredUsers.length} ACTIVE NODES
                            </span>
                        </div>
                        
                        <div className="flex-1 w-full relative z-0 border-t border-white/5">
                            <AdminMap users={filteredUsers} scans={scans} />
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Users Table */}
                        <motion.div variants={itemVariants} className="bg-[#0A0F14]/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-[700px] overflow-hidden relative">
                            {/* Decorative Top Accent */}
                            <div className="h-1 w-full bg-linear-to-r from-transparent via-blue-500/50 to-transparent opacity-50 absolute top-0" />
                            
                            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between z-10">
                                <h2 className="text-lg font-black text-white flex items-center gap-3 tracking-wide">
                                    <Database className="w-5 h-5 text-blue-400" /> 
                                    NODE DIRECTORY
                                </h2>
                                <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full tracking-[0.2em]">
                                    {filteredUsers.length} RECORDS
                                </span>
                            </div>
                            
                            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-[10px] font-mono font-black uppercase tracking-[0.2em] text-slate-500 border-b border-white/5 sticky top-0 bg-[#0A0F14]/90 backdrop-blur-md z-10">
                                            <th className="px-6 py-4">Node Profile</th>
                                            <th className="px-6 py-4">Biometrics</th>
                                            <th className="px-6 py-4 text-right">Data Traffic</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        <AnimatePresence>
                                            {filteredUsers.map((user, index) => (
                                                <motion.tr 
                                                    key={user.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="hover:bg-white/5 transition-colors group cursor-default"
                                                >
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-black font-mono group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:border-blue-500/30 transition-all shadow-inner">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{user.name}</p>
                                                                <p className="text-[10px] text-slate-500 font-mono tracking-wider">{user.phone}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Leaf className="w-3 h-3 text-emerald-500" />
                                                            <p className="font-bold text-slate-300 text-sm">{user.farmCrop}</p>
                                                        </div>
                                                        <p className="text-[10px] text-slate-500 font-mono tracking-wider">{user.farmLocation}</p>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <div className="inline-flex items-center justify-center min-w-10 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 font-mono font-bold group-hover:bg-white/10 transition-colors">
                                                            {user.scanCount}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-20 text-center">
                                                    <div className="inline-flex flex-col items-center opacity-50">
                                                        <Search className="w-10 h-10 mb-4 text-slate-600" />
                                                        <p className="font-mono text-sm tracking-widest uppercase">No Matches Found in DB</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>

                        {/* Live Feed */}
                        <motion.div variants={itemVariants} className="bg-[#0A0F14]/90 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl flex flex-col h-[700px] overflow-hidden relative">
                            {/* Decorative Top Accent */}
                            <div className="h-1 w-full bg-linear-to-r from-transparent via-emerald-500/50 to-transparent opacity-50 absolute top-0" />

                            <div className="px-8 py-6 border-b border-white/5 bg-white/5 flex items-center justify-between z-10">
                                <h2 className="text-lg font-black text-white flex items-center gap-3 tracking-wide">
                                    <Wifi className="w-5 h-5 text-emerald-400" /> 
                                    LIVE NETWORK FEED
                                </h2>
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                    <span className="text-[10px] font-mono font-black text-emerald-500 tracking-[0.2em]">SYNCING</span>
                                </span>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <div className="space-y-3">
                                    <AnimatePresence>
                                        {scans.length > 0 ? scans.map((scan, index) => {
                                            const isAnomaly = scan.predictedDisease && scan.predictedDisease !== 'Healthy';
                                            return (
                                                <motion.div 
                                                    key={scan.id}
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                    className="p-5 rounded-3xl border border-white/5 bg-white/2 hover:bg-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border relative ${
                                                            isAnomaly 
                                                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 group-hover:border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]' 
                                                                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                                                        } transition-colors`}>
                                                            {isAnomaly ? <ShieldAlert className="w-6 h-6" /> : <Leaf className="w-6 h-6" />}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-3">
                                                                <h4 className="font-bold text-white text-lg">{scan.crop}</h4>
                                                                <span className={`text-[9px] font-mono font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-md border ${
                                                                    isAnomaly 
                                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                                                                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                                }`}>
                                                                    {scan.predictedDisease || 'Optimal Health'}
                                                                </span>
                                                            </div>
                                                            <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-4 font-mono tracking-wider">
                                                                <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3 opacity-60" /> {scan.userName} [{scan.userPhone.slice(-4)}]</span>
                                                                <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3 opacity-60" /> {new Date(scan.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="text-right border-l border-white/5 pl-4 sm:pl-6">
                                                        <div className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Telemetry</div>
                                                        <div className="text-2xl font-black text-slate-200 tracking-tighter">
                                                            {(scan.confidence || 0).toFixed(1)}<span className="text-slate-600 font-light text-lg">%</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            );
                                        }) : (
                                            <div className="py-20 flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
                                                <Activity className="w-16 h-16 mb-4 stroke-1" />
                                                <p className="font-mono text-sm tracking-widest uppercase text-center max-w-[250px]">
                                                    Awaiting Incoming Node Ingests
                                                </p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </main>

            {/* Global Custom Scrollbar Styling */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.02);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255,255,255,0.2);
                }
            `}</style>
        </div>
    );
}
