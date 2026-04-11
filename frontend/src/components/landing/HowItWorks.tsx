import React from 'react';
import { UserPlus, Sparkles, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks: React.FC = () => {
  return (
    <section className="py-32 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Workflow</h2>
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">How Lumina AI Works</h3>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">Skip the formatting nightmare. Three simple steps to a pristine, interview-winning resume.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative max-w-5xl mx-auto">
          {/* Connecting Line */}
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="hidden md:block absolute top-[45px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 origin-left"
          ></motion.div>

          {[
            { icon: <UserPlus className="w-8 h-8 text-indigo-500" />, color: 'indigo', title: 'Enter your details', desc: "Give us your basic background or upload an old PDF. Minimal effort required." },
            { icon: <Sparkles className="w-8 h-8 text-purple-500" />, color: 'purple', title: 'AI builds your resume', desc: "Our engine optimizes your phrasing, highlights skills, and perfectly formats the layout." },
            { icon: <Download className="w-8 h-8 text-emerald-500" />, color: 'emerald', title: 'Download & Apply', desc: "Export to an ATS-friendly PDF instantly and start landing your dream job interviews." }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.2, type: 'spring', stiffness: 50 }}
              className="relative text-center z-10"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(15,23,42,0.06)] border border-slate-100 mb-8 relative group cursor-pointer"
              >
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-${step.color}-600 text-white font-bold flex items-center justify-center border-4 border-slate-50 shadow-sm`}>{i + 1}</div>
                {step.icon}
              </motion.div>
              <h4 className="text-xl font-black text-slate-900 mb-3">{step.title}</h4>
              <p className="text-slate-500 text-sm leading-relaxed max-w-[85%] mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
