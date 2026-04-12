import React from 'react';
import { ArrowRight, PlayCircle, Star, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

interface Props {
  onLoginClick: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
};

export const Hero: React.FC<Props> = ({ onLoginClick }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  return (
    <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
      {/* Background System: Noise Texture + Mesh Gradients */}
      <div className="absolute inset-0 bg-noise z-0"></div>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] opacity-40 pointer-events-none z-0">
        <motion.div 
          style={{ y: y1 }}
          className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-300 via-purple-300 to-transparent blur-[120px] rounded-full mix-blend-multiply opacity-70"
        />
        <motion.div 
          style={{ y: y2 }}
          className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-bl from-blue-200 via-cyan-200 to-transparent blur-[100px] rounded-full mix-blend-multiply opacity-60"
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Content */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-2xl relative z-20"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/80 text-slate-800 text-sm font-semibold mb-6 shadow-sm ring-1 ring-slate-900/5">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
              Trusted by 10,000+ job seekers
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6">
              Create a job-winning resume in minutes with <span className="text-gradient">AI</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg lg:text-xl text-slate-600 mb-8 leading-relaxed font-medium">
              Join thousands of professionals landing their dream jobs. Our AI instantly formats, writes, and optimizes your resume to beat Applicant Tracking Systems (ATS).
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-4">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={onLoginClick} 
                className="premium-button px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 group"
              >
                Start Building Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.9)" }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/50 backdrop-blur-md text-slate-800 border border-slate-200/50 px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(0,0,0,0.05)] relative overflow-hidden group hover:border-slate-300 transition-all"
              >
                <PlayCircle className="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" /> See Demo
              </motion.button>
            </motion.div>
            <motion.p variants={itemVariants} className="text-sm font-semibold text-slate-400 mb-10 pl-2">
              No credit card required
            </motion.p>
            
            {/* Above the fold trust badges */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 pt-6 border-t border-slate-200/50">
              <div className="flex -space-x-2">
                <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://i.pravatar.cc/100?img=1" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://i.pravatar.cc/100?img=2" alt="User" />
                <img className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://i.pravatar.cc/100?img=3" alt="User" />
                <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-xs text-slate-800 font-bold shadow-sm">+10k</div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <div className="flex text-amber-400 drop-shadow-sm"><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/><Star className="w-4 h-4 fill-current"/></div>
                  <span className="ml-1 text-slate-800 font-bold">5.0</span>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average User Rating</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Multi-layer UI Mockup (Kept from Phase 3, it's perfect) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, type: 'spring' }}
            className="relative mx-auto w-full max-w-lg lg:max-w-none h-[500px] perspective-1000 z-10"
          >
            {/* Base Layer: Sidebar/App Frame */}
            <motion.div 
              animate={{ y: [-5, 5, -5], rotateY: [-2, 2, -2] }}
              transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
              className="absolute left-0 bottom-0 w-[85%] h-[85%] glass-card rounded-3xl p-4 flex gap-4"
            >
               {/* Mock Sidebar */}
               <div className="w-16 h-full bg-slate-900/5 rounded-2xl p-3 flex flex-col gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center"><FileText className="w-5 h-5 text-indigo-500" /></div>
                 <div className="w-10 h-10 rounded-xl bg-slate-900/5"></div>
                 <div className="w-10 h-10 rounded-xl bg-slate-900/5"></div>
                 <div className="absolute bottom-4 w-10 h-10 rounded-full bg-slate-200"></div>
               </div>
               {/* Main UI Area */}
               <div className="flex-1 bg-white/50 rounded-2xl border border-white/60 p-6 shadow-inner">
                 <div className="w-1/3 h-4 bg-slate-200 rounded-md mb-8"></div>
                 <div className="space-y-4">
                    <div className="w-full h-8 bg-white rounded-lg shadow-sm"></div>
                    <div className="w-5/6 h-8 bg-white rounded-lg shadow-sm"></div>
                    <div className="w-full h-8 bg-white rounded-lg shadow-sm"></div>
                 </div>
               </div>
            </motion.div>

            {/* Mid Layer: The Floating Resume Document */}
            <motion.div 
              animate={{ y: [-15, -5, -15], x: [10, 15, 10] }}
              transition={{ duration: 7, ease: "easeInOut", repeat: Infinity, delay: 0.5 }}
              className="absolute right-0 top-0 w-[70%] h-[90%] bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] ring-1 ring-slate-900/5 p-8 flex flex-col z-20"
            >
               <div className="border-b border-slate-200 pb-3 mb-4">
                 <div className="w-1/2 h-5 bg-slate-800 rounded-md mb-2"></div>
                 <div className="w-1/3 h-3 bg-slate-400 rounded-md"></div>
               </div>
               <div className="space-y-4 mb-6">
                 <div>
                   <div className="w-1/4 h-3 bg-indigo-100 rounded mb-2"></div>
                   <div className="w-full h-2 bg-slate-100 rounded mb-1"></div>
                   <div className="w-5/6 h-2 bg-slate-100 rounded mb-1"></div>
                   <div className="w-full h-2 bg-slate-100 rounded"></div>
                 </div>
                 <div>
                   <div className="w-1/4 h-3 bg-indigo-100 rounded mb-2"></div>
                   <div className="w-full h-2 bg-slate-100 rounded mb-1"></div>
                   <div className="w-4/5 h-2 bg-slate-100 rounded"></div>
                 </div>
               </div>
            </motion.div>

            {/* Top Layer: Floating ATS Badge & AI Tooltip */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [-5, 5, -5] }}
              transition={{ 
                scale: { type: 'spring' as const, delay: 1.2 }, 
                y: { duration: 5, ease: "easeInOut", repeat: Infinity, delay: 1 } 
              }}
              className="absolute -right-4 top-12 glass-card rounded-2xl p-4 flex items-center gap-4 z-30 transform hover:scale-105 transition-transform cursor-default"
            >
              <div className="relative">
                <svg className="w-12 h-12 transform -rotate-90">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100" />
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="125.6" strokeDashoffset="10" className="text-emerald-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-black text-slate-800">96</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ATS Match</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-500"/> Excellent</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, y: [5, -5, 5] }}
              transition={{ 
                scale: { type: 'spring' as const, delay: 1.5 }, 
                y: { duration: 6, ease: "easeInOut", repeat: Infinity, delay: 2 } 
              }}
              className="absolute right-10 bottom-20 bg-white/90 backdrop-blur-md rounded-xl p-3 shadow-[0_20px_40px_-10px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/20 flex gap-3 z-30"
            >
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-inner">
                 <CheckCircle2 className="w-4 h-4 text-white" />
               </div>
               <div>
                  <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">AI Edit</p>
                  <p className="text-xs font-bold text-slate-800">Action verb optimized</p>
               </div>
            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
};
