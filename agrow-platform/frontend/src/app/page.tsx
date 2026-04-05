"use client";

import { Variants } from 'framer-motion';
import AIAssistant from '@/components/AIAssistant';
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import AboutSection from '@/components/landing/AboutSection';
import ServicePillars from '@/components/landing/ServicePillars';
import AuraOSPreview from '@/components/landing/AuraOSPreview';
import FutureFrontiers from '@/components/landing/FutureFrontiers';
import EcosystemSection from '@/components/landing/EcosystemSection';
import Footer from '@/components/landing/Footer';
import Background from '@/components/landing/Background';

export default function Home() {
  // Animation Variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const dashboardVariant: Variants = {
    hidden: { opacity: 0, x: 50, rotateY: -10 },
    visible: {
      opacity: 1,
      x: 0,
      rotateY: 0,
      transition: { duration: 1, ease: "easeOut" }
    }
  };

  const floatAnimation: Variants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        ease: "easeInOut",
        repeat: Infinity,
      }
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-gray-900 overflow-x-hidden relative">
      <Background />
      <Navbar />

      <main>
        <Hero fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <AboutSection fadeInUp={fadeInUp} />
        <ServicePillars fadeInUp={fadeInUp} staggerContainer={staggerContainer} />
        <AuraOSPreview fadeInUp={fadeInUp} dashboardVariant={dashboardVariant} />
        <FutureFrontiers fadeInUp={fadeInUp} floatAnimation={floatAnimation} />
        <EcosystemSection fadeInUp={fadeInUp} />
      </main>

      <Footer />
      <AIAssistant />
    </div>
  );
}
