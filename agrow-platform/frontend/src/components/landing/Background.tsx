"use client";

import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface FloatingLeafProps {
  delay?: number;
  x?: number;
}

const FloatingLeaf = ({ delay = 0, x = 0 }: FloatingLeafProps) => {
  const [randomStyles, setRandomStyles] = useState<{ left: string; size: number } | null>(null);

  useEffect(() => {
    setRandomStyles({
      left: `${Math.random() * 100}%`,
      size: Math.random() * 20 + 20
    });
  }, []);

  if (!randomStyles) return null;

  return (
    <motion.div
      initial={{ y: "110vh", opacity: 0, rotate: 0 }}
      animate={{
        y: "-10vh",
        opacity: [0, 0.4, 0],
        rotate: [0, 360],
        x: [x, x + 20, x - 20, x]
      }}
      transition={{
        duration: 15,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
      className="absolute text-green-200/30"
      style={{ left: randomStyles.left }}
    >
      <Leaf size={randomStyles.size} />
    </motion.div>
  );
};

export default function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">
      {/* Aurora Effect Blobs */}
      <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-200/20 blur-[120px] rounded-full animate-aurora-1" />
      <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-teal-200/20 blur-[100px] rounded-full animate-aurora-1" style={{ animationDelay: '-5s' }} />
      <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-sky-200/20 blur-[110px] rounded-full animate-aurora-1" style={{ animationDelay: '-10s' }} />
      
      {/* Floating Leaves */}
      <div className="absolute inset-0">
        {[0.1, 0.4, 0.7, 0.2, 0.9, 0.3, 0.6, 0.8].map((offset, i) => (
          <FloatingLeaf key={i} delay={i * 2} x={offset * 50} />
        ))}
      </div>
    </div>
  );
}
