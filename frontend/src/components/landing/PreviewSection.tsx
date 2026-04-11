import React from 'react';
import { Target, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const PreviewSection: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 relative overflow-hidden preserve-3d">
      {/* Background radial gradient mesh */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-[800px] bg-gradient-to-l from-indigo-100/50 via-purple-100/30 to-transparent blur-[120px] -z-10 rounded-full"></div>
      <div className="absolute inset-0 bg-noise z-0 mix-blend-overlay opacity-[0.02]"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, type: "spring", bounce: 0.3 }}
            className="order-2 lg:order-1 relative perspective-1000"
          >
            {/* The 3D Glass Mockup Setup */}
            <motion.div 
              whileHover={{ rotateY: 8, rotateX: 5, scale: 1.02, z: 50 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="relative w-full aspect-[8.5/11] cursor-pointer preserve-3d"
            >
              {/* Back Glass Shadow Plate */}
              <div className="absolute -inset-4 bg-slate-200/50 rounded-3xl blur-2xl transform translate-z-[-50px]"></div>
              
              {/* Background Glass Plate */}
              <div className="absolute inset-0 glass-card rounded-3xl z-10 transform translate-z-[-20px] transition-transform"></div>

              {/* Foreground Resume Document */}
              <div className="absolute inset-4 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 overflow-hidden z-20 border border-slate-100/50 transform translate-z-[10px]">
                 <div className="border-b border-slate-200 pb-4 mb-5">
                   <h2 className="text-3xl font-black text-slate-800 tracking-tight">Alex Sterling</h2>
                   <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mt-1">Growth Marketing Lead</p>
                 </div>
                 
                 <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-[11px] text-slate-400 mb-2 uppercase tracking-[0.15em]">Experience</h3>
                      <div className="mb-4">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-bold text-slate-900">TechFlow Inc.</span>
                          <span className="text-slate-400 text-xs font-semibold">2020 - Present</span>
                        </div>
                        <ul className="space-y-2 text-xs text-slate-600 list-disc pl-4 leading-relaxed">
                          <li>Spearheaded go-to-market strategy for enterprise tier, increasing MRR by 45%.</li>
                          <li className="relative group p-1 -ml-1 rounded transition-colors">
                            <span className="relative z-10">Optimized conversion funnel resulting in a <span className="font-bold text-indigo-600 bg-indigo-50 px-1 rounded">22% lift in signups</span> over Q3.</span>
                            {/* Inner highlight hover effect */}
                            <div className="absolute inset-0 bg-indigo-50/0 group-hover:bg-indigo-50/80 rounded transition-colors -z-0"></div>
                            {/* Floating tooltip simulating AI rewrite */}
                            <div className="absolute right-0 top-0 translate-x-[110%] opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                               <span className="text-[10px] bg-slate-900 shadow-xl text-white px-2 py-1.5 rounded-lg flex items-center gap-1.5 whitespace-nowrap"><Target className="w-3 h-3 text-indigo-400"/> Re-written by Lumina</span>
                            </div>
                          </li>
                          <li>Managed a cross-functional team of 12 marketers and designers.</li>
                        </ul>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Layered Floating Highlight Panel */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-1/2 -translate-y-1/2 glass-card p-4 rounded-xl shadow-[0_15px_35px_rgba(15,23,42,0.1)] z-30 flex items-center gap-3 transform translate-z-[40px]"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-500 flex items-center justify-center shadow-inner">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Impact Detected</p>
                  <p className="text-sm font-bold text-slate-900">Metrics highlighted</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Side Text Block */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold mb-6">
              Pixel Perfect
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Your career history,<br/> <span className="text-slate-400">beautifully presented.</span>
            </h3>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed">
              Don't spend hours fighting with formatting. Our builder automatically ensures your content fits perfectly on the page, using typography and layouts optimized for maximum recruiter readability.
            </p>
            
            <div className="space-y-5">
              {[
                { title: 'Auto-formatting', desc: 'Guarantees perfect alignment and ATS unreadability prevention.' },
                { title: 'Dynamic Margin Intelligence', desc: 'Content squished? We gracefully adjust spacing instantly.' },
                { title: 'Premium Typography', desc: 'Fonts specifically chosen for professional scan-ability.' }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 + 0.3 }}
                  className="flex items-start gap-4"
                >
                  <div className="mt-1 w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-md">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-slate-900 font-bold block mb-1">{item.title}</span>
                    <span className="text-slate-500 text-sm leading-relaxed block">{item.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
