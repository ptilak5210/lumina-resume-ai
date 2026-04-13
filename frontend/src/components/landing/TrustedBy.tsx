import React from 'react';
import { motion } from 'framer-motion';

export const TrustedBy: React.FC = () => {
  return (
    <div className="border-y border-slate-100 bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8"
        >
          Trusted by professionals at top companies
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, staggerChildren: 0.1 }}
          className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500"
        >
          <motion.img whileHover={{ scale: 1.1 }} src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 md:h-8" />
          <motion.img whileHover={{ scale: 1.1 }} src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" alt="Microsoft" className="h-6 md:h-8" />
          <motion.img whileHover={{ scale: 1.1 }} src="https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg" alt="LinkedIn" className="h-6 md:h-8" />
          <motion.img whileHover={{ scale: 1.1 }} src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" alt="Amazon" className="h-6 md:h-8 mt-1" />
          <motion.img whileHover={{ scale: 1.1 }} src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple" className="h-6 md:h-8" />
        </motion.div>
      </div>
    </div>
  );
};
