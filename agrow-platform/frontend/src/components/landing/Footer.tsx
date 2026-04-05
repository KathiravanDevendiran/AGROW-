"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-white pt-32 pb-16 border-t border-slate-100 relative z-10 overflow-hidden">
      {/* Decorative Gradient Flare */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-48 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-24"
        >
          <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-10 border border-emerald-100 italic">
            Deployment Protocol
          </span>
          <h2 className="text-5xl md:text-8xl font-black text-slate-900 mb-12 tracking-tighter leading-[0.9]">Ready to <br /><span className="premium-gradient-text italic">Initialize Yield?</span></h2>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                className="bg-slate-900 text-white px-12 py-5 rounded-4xl text-lg font-black shadow-2xl shadow-slate-900/20 transition-all border border-slate-800 uppercase tracking-widest text-[12px]"
              >
                Join Global Mesh
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 rounded-4xl text-lg font-black text-slate-400 uppercase tracking-widest text-[12px] hover:text-emerald-600 transition-colors"
            >
              Contact Support
            </motion.button>
          </div>
        </motion.div>

        <div className="border-t border-slate-100 pt-12 flex flex-col md:flex-row justify-between items-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
          <p className="italic">&copy; 2026 AGROW LENS CORE INFRASTRUCTURE.</p>
          <div className="flex gap-10 mt-8 md:mt-0 italic">
            <Link href="#" className="hover:text-emerald-600 transition-colors">Security Node</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Privacy protocol</Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">Legal Kernel</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
