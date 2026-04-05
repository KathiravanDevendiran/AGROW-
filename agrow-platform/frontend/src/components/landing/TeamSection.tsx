"use client";

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';
import { Building } from 'lucide-react';

interface TeamSectionProps {
  fadeInUp: Variants;
}

export default function TeamSection({ fadeInUp }: TeamSectionProps) {
  const team = [
    {
      name: "Kathiravan D",
      role: "Team Leader & Developer",
      college: "DSCE, Coimbatore",
      initials: "KD",
      color: "blue",
      img: "https://drive.google.com/thumbnail?id=1zrOxyFhMuZieHdQLHCwEbBzAB5UPIXfh&sz=w1000",
      link: "https://www.linkedin.com/in/kathiravan-devendiran"
    },
    {
      name: "Gokulakrishnan.B",
      role: "Developer",
      college: "DSCE, Coimbatore",
      initials: "GB",
      color: "emerald",
      img: "/images/team/gokul_profile.jpg",
      link: "https://www.linkedin.com/in/gokulakrishnan-b/"
    },
    {
      name: "Krishnendu Raj",
      role: "Content Writer",
      college: "DSCE, Coimbatore",
      initials: "KR",
      color: "purple",
      img: "/images/team/krishnendu.jpeg",
      link: "https://www.linkedin.com/in/krishnendu-raj-a-m-053337362?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Adithya K C",
      role: "Data Analyst",
      college: "DSCE, Coimbatore",
      initials: "AK",
      color: "orange",
      img: "https://drive.google.com/thumbnail?id=1y6AT-PNeXadNt0SsuehxS2vQrzUDV90q&sz=w1000",
      link: null
    }
  ];

  return (
    <section id="team" className="py-32 bg-stone-50 relative overflow-hidden scroll-mt-24">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center mb-24"
        >
          <span className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-[10px] font-black tracking-[0.3em] uppercase inline-block mb-8 border border-blue-100 italic transition-all hover:bg-blue-100">
            The AGROW Mesh
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter italic">
            Engineering <span className="text-blue-600 not-italic">Infrastructure.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-bold leading-relaxed italic">
            The core protocol team behind the Aura OS kernel and rural field intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, i) => {
            const handleCardClick = () => {
              if (typeof window !== 'undefined' && member.link) {
                window.open(member.link, '_blank');
              }
            };

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group h-full"
                onClick={handleCardClick}
              >
                <div className="absolute inset-0 bg-blue-500/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative h-full bg-white border border-slate-100 p-8 rounded-4xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col items-center text-center overflow-hidden group/card backdrop-blur-sm">

                  {/* Profile Indicator */}
                  <div className="w-28 h-36 bg-slate-50 rounded-3xl mb-8 relative overflow-hidden shadow-inner ring-1 ring-slate-100 group-hover/card:scale-105 transition-transform duration-700">
                    {member.img ? (
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover grayscale-[0.2] group-hover/card:grayscale-0 transition-all duration-700"
                        unoptimized={member.img.startsWith('http')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 text-slate-300 font-black text-2xl italic">
                        {member.initials}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/10 to-transparent" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2 group-hover/card:text-blue-600 transition-colors uppercase tracking-tighter italic">{member.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">{member.role}</p>

                    <div className="flex items-center justify-center gap-2 text-slate-400 mb-8 bg-slate-50 py-2 px-4 rounded-xl border border-slate-100">
                      <Building className="w-3 h-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest leading-none">{member.college}</span>
                    </div>
                  </div>

                  <div className="w-full pt-6 border-t border-slate-50 flex items-center justify-center gap-3">
                    <span className="px-4 py-1.5 bg-blue-50 text-[8px] font-black text-blue-600 uppercase tracking-[0.3em] rounded-lg italic">V2 Engineering</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
