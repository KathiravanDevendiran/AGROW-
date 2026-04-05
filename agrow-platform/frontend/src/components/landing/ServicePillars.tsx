"use client";

import Link from 'next/link';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Microscope, Store, Box, ShoppingBag, ArrowRight } from 'lucide-react';

interface ServicePillarsProps {
  fadeInUp: Variants;
  staggerContainer: Variants;
}

export default function ServicePillars({ fadeInUp, staggerContainer }: ServicePillarsProps) {
  const pillars = [
    {
      icon: Microscope,
      color: 'green',
      title: 'Neural Lab',
      subtitle: 'Aura Pathology V2',
      desc: 'Real-time AI plant pathology using neural computer vision. Point, scan, and receive instant diagnostic integrity with 98% accuracy.'
    },
    {
      icon: Store,
      color: 'blue',
      title: 'Bento Marketplace',
      subtitle: 'Fair-Trade Procurement',
      desc: 'A decentralized marketplace for organic medicines and nutrients. Direct-from-source pricing with Neural Approved quality assurance.'
    },
    {
      icon: Box,
      color: 'indigo',
      title: 'Neural Logistics',
      subtitle: 'Autonomous Fulfillment',
      desc: 'Drone-enabled express delivery network. Real-time fleet tracking and intelligent flight path optimization for remote acreage.'
    },
  ];

  return (
    <section id="plan" className="py-24 bg-white relative z-10 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase inline-block mb-8 border border-emerald-100 shadow-sm transition-all hover:bg-emerald-100">
            Ecosystem Modules
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            The <span className="premium-gradient-text italic">AGROW Pillars</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-bold leading-relaxed">
            A high-velocity operating system for yield optimization, integrating deep diagnostics with autonomous fulfillment.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8 lg:gap-10"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bento-card flex flex-col h-full group"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-10 group-hover:rotate-6 transition-all duration-500 shadow-inner ring-1 ring-slate-100">
                <pillar.icon className={`w-8 h-8 text-emerald-600`} />
              </div>

              <div className="flex-1">
                <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 text-emerald-600/60 transition-colors group-hover:text-emerald-600`}>{pillar.subtitle}</p>
                <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-emerald-700 transition-colors uppercase italic">{pillar.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-bold opacity-80 group-hover:opacity-100 transition-opacity mb-10">
                  {pillar.desc}
                </p>

                {/* Module Preview Pop-up */}
                <div className="relative h-28 mt-auto overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 group-hover:bg-white transition-all duration-500 mb-10 shadow-inner group-hover:shadow-2xl group-hover:shadow-emerald-500/5">
                  <AnimatePresence>
                    {pillar.title === 'Neural Lab' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-5"
                      >
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                            <Microscope className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                            <motion.div
                              animate={{ x: [-128, 128] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="h-full w-1/2 bg-emerald-500"
                            />
                          </div>
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mb-1">Scanning: Tomato Late Blight</p>
                        <p className="text-[10px] font-bold text-slate-400 italic">Structural pathology match: 98.4%</p>
                      </motion.div>
                    )}
                    {pillar.title === 'Bento Marketplace' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-5 flex gap-4"
                      >
                        <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                          <ShoppingBag className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-[10px] font-black text-slate-900 leading-none">Formula-92</p>
                            <p className="text-[10px] font-black text-blue-600 italic">₹450</p>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full mb-2 shadow-inner" />
                          <div className="h-2 w-2/3 bg-slate-100 rounded-full shadow-inner" />
                        </div>
                      </motion.div>
                    )}
                    {pillar.title === 'Neural Logistics' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        className="p-5"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-sm" />
                            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Aura-Fleet Transit</p>
                          </div>
                          <p className="text-[9px] font-black uppercase text-blue-600 tracking-widest italic">Drone-09</p>
                        </div>
                        <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                          <motion.div
                            animate={{ width: ["0%", "85%"] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="h-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                          />
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-2 italic">ETA: 42 mins • Optimized Neural Path</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                <Link href="/login" className="flex items-center gap-3 transition-all duration-300 group/link cursor-pointer">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 group-hover/link:text-emerald-600">Module Access</span>
                  <ArrowRight className="w-5 h-5 text-emerald-600 group-hover/link:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
