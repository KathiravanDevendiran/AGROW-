"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Lock, Camera, ShoppingCart } from 'lucide-react';

interface FutureFrontiersProps {
  fadeInUp: Variants;
  floatAnimation: Variants;
}

export default function FutureFrontiers({ fadeInUp, floatAnimation }: FutureFrontiersProps) {
  const apps = [
    { title: "Farmer Login", icon: Lock, color: "green", delay: 0, img: "/images/login.png" },
    { title: "AI Diagnosis", icon: Camera, color: "emerald", delay: 2, img: "/images/lens.png" },
    { title: "Marketplace", icon: ShoppingCart, color: "orange", delay: 1, img: "/images/marketplace.png" }
  ];

  return (
    <section id="frontiers" className="py-32 bg-white overflow-hidden scroll-mt-24 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="bg-slate-50 text-slate-500 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-8 border border-slate-100 italic">
            Mobile Infrastructure
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
            Next-Gen <span className="premium-gradient-text italic">Mobility.</span>
          </h2>
          <p className="text-slate-400 text-lg font-bold leading-relaxed max-w-2xl mx-auto italic">
            Sneak peek at the Aura OS mobile ecosystem. Autonomous diagnostic intelligence at the edge.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 lg:gap-20 items-center justify-center">
          {apps.map((app, i) => (
            <motion.div
              key={i}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              transition={{ delay: app.delay, duration: 5 + i }}
              className="relative mx-auto group"
            >
              {/* Phone Frame - Premium Styling */}
              <div className="relative w-[280px] h-[580px] bg-slate-900 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.2)] border-12 border-slate-900 overflow-hidden ring-1 ring-white/10">
                {/* Speaker/Dynamic Island Mockup */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-b-2xl z-20" />
                
                {/* Screen Content */}
                <div className="relative w-full h-full bg-slate-950 overflow-hidden">
                  <Image
                    src={app.img}
                    alt={app.title}
                    fill
                    className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent" />
                </div>
              </div>

              {/* Float Label */}
              <div className="mt-8 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-1">{app.title}</p>
                <p className="text-xs font-bold text-slate-400 italic">Pre-alpha Node</p>
              </div>

              {/* Shadow with Parallax Effect */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 5 + i, repeat: Infinity }}
                className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 h-6 bg-slate-900/10 blur-2xl rounded-[100%]" 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
