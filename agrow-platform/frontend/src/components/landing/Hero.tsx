"use client";

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Leaf, Smartphone, CheckCircle, ArrowRight, Activity } from 'lucide-react';

interface HeroProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export default function Hero({ fadeInUp, staggerContainer }: HeroProps) {
  return (
    <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden z-10">
      <div className="absolute inset-0 bg-linear-to-b from-green-50/80 via-white/50 to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">

          {/* Text Content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="mb-16 lg:mb-0"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-8 border border-green-200"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-600"></span>
              </span>
              Now Live for Farmers
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl lg:text-8xl font-black tracking-tight text-slate-900 mb-8 leading-[0.95]"
            >
              Heal Your Crops <br />
              <span className="premium-gradient-text italic">AI Vision</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-slate-600 mb-12 leading-relaxed max-w-lg font-medium"
            >
              Professional crop diagnostics in your pocket. Instantly identify diseases, get specialized treatment protocols, and maximize your harvest yield with the power of Aura OS.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-5"
            >
              <Link href="/login" className="w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full justify-center flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-4xl text-lg font-black shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all border border-emerald-500/50"
                >
                  Start Engine <ArrowRight className="w-5 h-5" />
                </motion.button>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto justify-center flex items-center gap-3 bg-white/40 backdrop-blur-md text-slate-700 border border-white/60 px-10 py-5 rounded-4xl text-lg font-black hover:bg-white/60 hover:text-emerald-700 transition-all shadow-xl"
              >
                <Activity className="w-5 h-5 text-emerald-500" /> Live Demo
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 flex items-center gap-5 text-xs font-bold text-slate-400 uppercase tracking-widest"
            >
              <div className="flex -space-x-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-10 h-10 rounded-2xl border-4 border-slate-50 bg-emerald-${100 + (i * 100)} shadow-lg shadow-emerald-500/10`} />
                ))}
              </div>
              <p>Trusted by <span className="text-slate-900">2,500+ Verified</span> Growers</p>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <div className="relative perspective-2000">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, delay: 0.2, type: "spring" }}
              className="relative z-10"
            >
              {/* Floating Card Content */}
              <div className="glass-card rounded-[3rem] aspect-4/3 flex items-center justify-center p-12 group overflow-hidden border-white/40 shadow-emerald-500/5">
                <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-transparent opacity-50" />

                {/* Animated Elements inside Card */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="text-center relative z-10"
                >
                  <div className="w-28 h-28 bg-white/80 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-emerald-500/10 ring-1 ring-emerald-500/20">
                    <Smartphone className="w-12 h-12 text-emerald-600" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Smart Scanning</h3>
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Aura Core V2.5 Active</p>
                </motion.div>

                {/* Floating Labels */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-10 left-10 bg-white/80 backdrop-blur-2xl px-6 py-4 rounded-3xl shadow-2xl border border-white/60 flex items-center gap-4 group-hover:scale-110 transition-transform"
                >
                  <div className="bg-emerald-100 p-2 rounded-xl">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">Telemetry</p>
                    <p className="text-sm font-black text-emerald-700">Healthy Culture</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Back Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-400/20 blur-[100px] rounded-full -z-10" />
          </div>

        </div>
      </div>
    </section>
  );
}
