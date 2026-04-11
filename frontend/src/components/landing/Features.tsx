import React from 'react';
import { Bot, FileCheck, Lightbulb, Layout, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Bot className="w-6 h-6 text-indigo-500" />,
    title: "Generate Resumes Instantly",
    description: "Never start from a blank page again. Our AI automatically generates a robust, professional profile based on minimal input."
  },
  {
    icon: <FileCheck className="w-6 h-6 text-emerald-500" />,
    title: "Beat ATS Robots Automatically",
    description: "Scan your resume against any job description. We guarantee your keywords perfectly match the employer's Applicant Tracking System."
  },
  {
    icon: <Lightbulb className="w-6 h-6 text-amber-500" />,
    title: "Discover Hidden Skills",
    description: "Stop guessing what recruiters want to see. We intelligently suggest high-impact skills native to your specific industry."
  },
  {
    icon: <Layout className="w-6 h-6 text-blue-500" />,
    title: "Format Like an Expert",
    description: "Select from exclusive, recruiter-approved templates that guarantee a breathtaking first impression on any screen or paper."
  },
  {
    icon: <Target className="w-6 h-6 text-rose-500" />,
    title: "Land More Interviews",
    description: "Stop sending the same generic resume. Our system auto-adapts your profile to perfectly resonate with each specific job role."
  },
  {
    icon: <Zap className="w-6 h-6 text-purple-500" />,
    title: "Write Powerful Bullets",
    description: "Turn boring daily duties into powerful, quantified achievements with a single click. Sound like a true leader."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50 } }
};

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-32 bg-white relative">
      <div className="absolute inset-0 bg-noise z-0 mix-blend-overlay opacity-[0.03]"></div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-indigo-600 font-bold tracking-widest uppercase text-xs mb-4">Architecture of Success</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Everything you need to get hired.</h3>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">Stop guessing what recruiters want. Lumina AI provides the exact suite of tools to engineer a resume that virtually guarantees interviews.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
              <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-transparent group-hover:ring-slate-900/5 transition-all duration-500 z-0"></div>
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:bg-indigo-50/50 group-hover:shadow-inner border border-slate-100/50">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed max-w-[90%]">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
