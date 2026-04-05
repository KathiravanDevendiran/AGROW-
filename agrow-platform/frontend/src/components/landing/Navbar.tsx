"use client";

import Link from 'next/link';
import { Leaf } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Our Plan', href: '#plan' },
    { name: 'Demo', href: '#demo' },
    { name: 'Frontiers', href: '#frontiers' },
    { name: 'Ecosystem', href: '#ecosystem' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/40 backdrop-blur-2xl border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.03)] py-3' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          <Link href="/" className="flex items-center gap-2 group relative z-50">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="bg-emerald-600 p-2.5 rounded-2xl shadow-xl shadow-emerald-600/20"
            >
              <Leaf className="h-5 w-5 text-white" />
            </motion.div>
            <span className={`text-xl font-black tracking-tight transition-colors ${isScrolled ? 'text-slate-900' : 'text-emerald-900'}`}>
              AGROW <span className="font-light italic">Lens</span>
            </span>
          </Link>

          <div className="hidden md:flex space-x-8 text-sm font-medium">
            {navItems.map((item, i) => (
              <a key={i} href={item.href} className="relative group p-1 cursor-pointer">
                <span className="relative z-10 text-gray-700 group-hover:text-green-700 transition-colors">
                  {item.name}
                </span>
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-green-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                />
              </a>
            ))}
          </div>

          <Link href="/login">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-green-700 shadow-lg shadow-green-600/30 transition-all relative overflow-hidden"
            >
              <span className="relative z-10">Login as Farmer</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
