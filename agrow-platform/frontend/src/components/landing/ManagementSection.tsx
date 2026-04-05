"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

interface ManagementSectionProps {
  fadeInUp: Variants;
}

export default function ManagementSection({ fadeInUp }: ManagementSectionProps) {
  const management = [
    {
      name: "Dr. C. Jegadheesan",
      role: "Principal",
      desc: "B.E, M.S., Ph.D.",
      color: "blue",
      initials: "CJ",
      image: "https://drive.google.com/thumbnail?id=12dEgkdWTUR0Z2sFhMKa74kYlx-nXjZms&sz=w1000",
      link: "https://www.linkedin.com/in/jegadheesan-chennakrishnan-086721102/",
      supportText: "The initiative and our supporter to build this platform."
    },
    {
      name: "Dr. B. Rajesh Kumar",
      role: "Head of Department",
      desc: "B.E, M.E, M.I.S.T.E, M.I.A.N.G, Ph.D",
      color: "emerald",
      initials: "BR",
      image: "/images/team/hod.jpg",
      supportText: "The initiative and our supporter to build this platform."
    }
  ];

  return (
    <section id="management" className="py-32 bg-white relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="bg-slate-50 text-slate-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-8 border border-slate-200 italic transition-all hover:bg-slate-100">
            Institutional Leadership
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter italic">
            Strategic <span className="text-blue-900 not-italic">Initiatives.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-bold leading-relaxed italic">
            Executive oversight and institutional support driving the AGROW mission.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 lg:gap-16 pb-16">
          {management.map((member, i) => {
            const handleManagementClick = () => {
              if (typeof window !== 'undefined' && member.link) {
                window.open(member.link, '_blank');
              }
            };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative group flex flex-col justify-center ${member.link ? 'cursor-pointer' : ''}`}
                onClick={handleManagementClick}
              >
                <div className="relative w-full max-w-[360px] bg-white border border-slate-100 rounded-[3rem] hover:shadow-[0_50px_100px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col items-center overflow-hidden aspect-4/5 shadow-sm mx-auto group/card">

                  {/* Institutional Header Bar */}
                  <div className="w-full bg-linear-to-r from-slate-900 via-slate-950 to-slate-900 p-5 flex items-center gap-4 border-b border-white/5">
                    <div className="relative w-12 h-12 bg-white rounded-xl p-1.5 shrink-0 shadow-2xl">
                      <Image
                        src="https://drive.google.com/thumbnail?id=1Sk8dWuX9WDapw222OT8gM4icoktFyDt4&sz=w1000"
                        alt="College Logo"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10px] font-black text-white uppercase tracking-tighter leading-tight">Dhanalakshmi Srinivasan</h4>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest italic shrink-0">Engineering College</p>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col items-center text-center flex-1 justify-center relative w-full">
                    <div className="relative z-10 w-full">
                      {/* Profile Indicator */}
                      <div className={`w-32 h-32 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-8 mx-auto group-hover/card:scale-105 transition-transform duration-700 shadow-inner overflow-hidden relative ring-1 ring-slate-100`}>
                        {member.image ? (
                          <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover object-top filter grayscale-[0.3] group-hover/card:grayscale-0 transition-all duration-700"
                            unoptimized={member.image.startsWith('http')}
                          />
                        ) : (
                          <span className={`text-3xl font-black text-slate-200 italic`}>{member.initials}</span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 tracking-tighter group-hover/card:text-blue-900 transition-colors uppercase italic">
                        {member.name}
                      </h3>
                      <p className={`text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4`}>
                        {member.role}
                      </p>
                      <div className="h-px w-10 bg-slate-100 mx-auto mb-6" />
                      <p className="text-[11px] font-bold text-slate-400 max-w-[220px] leading-relaxed mx-auto italic">
                        {member.desc}
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-50/50 py-4 px-8 flex items-center justify-between border-t border-slate-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-blue-500 shadow-sm animate-pulse`} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Official Protocol</span>
                    </div>
                    <span className="text-[7px] font-black text-slate-300 uppercase tracking-[0.3em]">INIT-2026</span>
                  </div>
                </div>
                {/* Support Text Description */}
                {member.supportText && (
                  <div className="mt-4 w-full text-center px-4">
                    <p className="text-[10px] font-medium text-stone-500 italic leading-tight">
                      &quot;{member.supportText}&quot;
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
