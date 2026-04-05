"use client";

import { motion, Variants } from 'framer-motion';
import { Globe, BrainCircuit, Activity } from 'lucide-react';

interface AboutSectionProps {
  fadeInUp: Variants;
}

export default function AboutSection({ fadeInUp }: AboutSectionProps) {
  return (
    <section id="about" className="py-32 bg-white relative z-10 overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-linear-to-b from-stone-50/50 to-white pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-24">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase inline-block mb-8 border border-emerald-100 shadow-sm shadow-emerald-500/5 transition-all hover:bg-emerald-100 hover:border-emerald-200"
          >
            The Mission Intelligence
          </motion.span>
          <h2 className="text-6xl md:text-9xl font-black mb-10 tracking-tighter leading-[0.85] select-none">
            <span className="text-slate-900 block mb-4">Engineering</span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="premium-gradient-text italic"
            >
              Rural Future.
            </motion.span>
          </h2>
        </div>

        {/* Three Narrative Layers */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">

          {/* Layer 1: The Mission */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bento-card"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
            <div className="w-16 h-16 bg-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-600/20 mb-10 group-hover:rotate-6 transition-transform">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-6">The Mission</h3>
            <p className="text-slate-500 font-bold leading-relaxed mb-10">
              Agriculture beyond boundaries. We are architecting a world where every smallholder farmer has the diagnostic power of a laboratory in their pocket.
            </p>
            <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
              <div className="px-5 py-2 bg-slate-50 rounded-2xl border border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400 italic">V2 Expansion Active</div>
            </div>
          </motion.div>

          {/* Layer 2: The Technology */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bento-card bg-slate-900! text-white! border-slate-800! shadow-2xl shadow-slate-900/40"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="w-16 h-16 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/20 relative z-10 mb-10 group-hover:-rotate-6 transition-transform">
              <BrainCircuit className="w-8 h-8 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black tracking-tight mb-6">The Tech Stack</h3>
              <p className="text-slate-300 font-bold leading-relaxed mb-8">
                Powered by <span className="text-emerald-400">Agentic AI</span> and the <span className="text-emerald-400">Aura OS</span> kernel. We build autonomous diagnostic agents for the field.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Neural Vision', 'Edge Logic', 'Drone Mesh'].map((tech, i) => (
                  <span key={i} className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 italic text-emerald-400">{tech}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Layer 3: The Impact */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bento-card bg-linear-to-br! from-emerald-600 to-teal-800 text-white! border-emerald-500/50 shadow-2xl shadow-emerald-600/30"
          >
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20 mb-10 group-hover:scale-110 transition-transform">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-6">The Impact</h3>
              <p className="text-white/90 font-bold leading-relaxed mb-10">
                Real-world yield improvement for over 2,500+ verified growers. Removing friction from the rural supply chain.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white/10 rounded-4xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-black mb-1">98%</p>
                  <p className="text-[9px] font-bold uppercase opacity-60 tracking-widest leading-none">Diagnostic Accuracy</p>
                </div>
                <div className="p-5 bg-white/10 rounded-4xl border border-white/10 backdrop-blur-sm">
                  <p className="text-3xl font-black mb-1">3x</p>
                  <p className="text-[9px] font-bold uppercase opacity-60 tracking-widest leading-none">Response Velocity</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
