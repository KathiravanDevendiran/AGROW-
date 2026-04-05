"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Microscope, Store, Box, QrCode, Camera, Activity, ShoppingBag } from 'lucide-react';

interface AuraOSPreviewProps {
  fadeInUp: Variants;
  dashboardVariant: Variants;
}

export default function AuraOSPreview({ fadeInUp, dashboardVariant }: AuraOSPreviewProps) {
  const osModules = [
    { icon: Microscope, label: 'Neural Lab', status: 'Live' },
    { icon: Store, label: 'Marketplace', status: 'Secure' },
    { icon: Box, label: 'Logistics', status: 'Active' },
    { icon: QrCode, label: 'Aura ID', status: 'Verified' }
  ];

  return (
    <section id="demo" className="py-32 bg-slate-900 text-white overflow-hidden relative z-10 scroll-mt-24 shadow-2xl">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-white/5 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center">

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <span className="bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-10 border border-emerald-500/20 backdrop-blur-md">
              The Agricultural OS
            </span>
            <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[0.9] italic">
              Aura OS <br />
              <span className="text-emerald-400 not-italic">Infrastructure.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 leading-relaxed font-bold max-w-xl">
              A unified diagnostic and logistics kernel designed for smallholder resilience. Real-time telemetry meets autonomous fulfillment.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-16">
              {osModules.map((item, i) => (
                <div key={i} className="flex items-center gap-5 p-5 bg-white/5 rounded-4xl border border-white/10 backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20 group">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-black tracking-widest uppercase text-slate-300">{item.label}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>

            <button className="bg-white text-slate-900 font-black py-5 px-12 rounded-4xl text-[10px] uppercase tracking-[0.3em] transition-all hover:bg-emerald-400 hover:text-white shadow-2xl active:scale-95">
              Initialize Command Center
            </button>
          </motion.div>

          {/* Mock Dashboard Window - Premium Presentation */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ rotateY: 3, rotateX: -1, scale: 1.02 }}
            variants={dashboardVariant}
            className="relative lg:ml-auto max-w-2xl transition-all duration-700 cursor-pointer group perspective-2000"
          >
            {/* Window Controls Decor */}
            <div className="absolute top-6 left-10 flex gap-1.5 z-30">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>

            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white/10 p-2 bg-white/5 backdrop-blur-3xl">
              <div className="relative rounded-[2.5rem] overflow-hidden aspect-4/3 flex flex-col">
                <Image
                  src="/images/dashboard.png"
                  alt="Agrow Dashboard"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover object-top filter group-hover:brightness-125 transition-all duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent opacity-60" />
                
                {/* Floating HUD Interaction Elements */}
                <div className="absolute bottom-10 right-10 flex flex-col gap-4">
                  <div className="h-14 w-14 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 flex items-center justify-center shadow-2xl hover:bg-white/20 transition-colors">
                    <Microscope className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="h-16 w-16 bg-emerald-500 rounded-3xl shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center animate-float ring-4 ring-emerald-500/20">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Parallax Holographic Card */}
            <motion.div
              whileHover={{ x: 30, y: -30 }}
              className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 hidden md:flex flex-col items-center justify-center shadow-2xl"
            >
              <Activity className="w-12 h-12 text-emerald-400 mb-2 opacity-60" />
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Node Sync</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
