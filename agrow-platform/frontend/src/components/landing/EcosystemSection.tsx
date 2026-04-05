"use client";

import { motion, Variants } from 'framer-motion';
import EcosystemGraph from '@/components/EcosystemGraph';

interface EcosystemSectionProps {
  fadeInUp: Variants;
}

export default function EcosystemSection({ fadeInUp }: EcosystemSectionProps) {
  return (
    <section id="ecosystem" className="py-32 bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-8 border border-emerald-100 italic transition-all hover:bg-emerald-100">
            Intelligent Mesh
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter italic">
            Agentic <span className="premium-gradient-text not-italic">Ecosystem.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-bold leading-relaxed italic">
            AGROW is a self-coordinating rural infrastructure. Where social trust, neural diagnostics, and autonomous logistics converge.
          </p>
        </motion.div>

        <div className="relative rounded-[4rem] border border-slate-100 bg-slate-50/50 p-1 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent_70%)] shadow-inner">
          <EcosystemGraph />
        </div>

      </div>
    </section>
  );
}
