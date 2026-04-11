import React from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { TrustedBy } from './TrustedBy';
import { Features } from './Features';
import { HowItWorks } from './HowItWorks';
import { PreviewSection } from './PreviewSection';
import { Pricing } from './Pricing';
import { Testimonials } from './Testimonials';
import { Footer } from './Footer';

import { motion } from 'framer-motion';

interface Props {
  onLoginClick: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLoginClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="font-sans antialiased text-slate-900 bg-[#FAFAFA] min-h-screen selection:bg-indigo-100 selection:text-indigo-900"
    >
      <Navbar onLoginClick={onLoginClick} />
      
      <main>
        <Hero onLoginClick={onLoginClick} />
        <TrustedBy />
        <Features />
        <HowItWorks />
        <PreviewSection />
        {/* Templates section can be added here later if needed, but PreviewSection acts as the main WOW component. */}
        <Pricing />
        <Testimonials />
      </main>

      <Footer onLoginClick={onLoginClick} />
    </motion.div>
  );
};
