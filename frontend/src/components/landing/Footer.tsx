import React from 'react';
import { Sparkles, Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onLoginClick: () => void;
}

export const Footer: React.FC<Props> = ({ onLoginClick }) => {
  return (
    <footer className="bg-white border-t border-slate-200">
      
      {/* Final CTA Strip */}
      <div className="border-b border-slate-200 py-24 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 relative overflow-hidden">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, slate 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-6 text-center relative z-10"
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Stop struggling with resumes.<br/>Start getting interviews.</h2>
          <p className="text-xl text-slate-500 mb-2">Join 10,000+ users who landed their dream jobs this year.</p>
          <p className="text-sm font-semibold text-indigo-500 mb-10">Limited time: Free ATS Analysis available for new users.</p>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLoginClick} 
            className="group premium-button px-12 py-6 rounded-2xl font-bold flex items-center justify-center gap-2 mx-auto text-lg"
          >
            Create My Resume Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16"
        >
          
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6 cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <Sparkles className="text-white w-4 h-4" />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">Lumina AI</span>
            </div>
            <p className="text-sm font-medium text-slate-500 max-w-xs leading-relaxed mb-6">
              The AI-powered resume builder engineered to bypass applicant tracking systems and help you land your dream job faster.
            </p>
            <div className="flex items-center gap-4 text-slate-400">
              <motion.a whileHover={{ y: -3, color: '#4F46E5' }} href="#" className="transition-colors"><Twitter className="w-5 h-5"/></motion.a>
              <motion.a whileHover={{ y: -3, color: '#4F46E5' }} href="#" className="transition-colors"><Github className="w-5 h-5"/></motion.a>
              <motion.a whileHover={{ y: -3, color: '#4F46E5' }} href="#" className="transition-colors"><Linkedin className="w-5 h-5"/></motion.a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              {['Templates', 'Pricing', 'ATS Checker', 'Cover Letters'].map(item => (
                <li key={item}><a href="#" className="hover:text-indigo-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              {['About Us', 'Careers', 'Blog', 'Contact'].map(item => (
                <li key={item}><a href="#" className="hover:text-indigo-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                <li key={item}><a href="#" className="hover:text-indigo-600 transition-colors relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full rounded-full"></span>
                </a></li>
              ))}
            </ul>
          </div>

        </motion.div>

        <div className="pt-8 border-t border-slate-200 text-center text-sm font-medium text-slate-400">
          &copy; {new Date().getFullYear()} Lumina AI by HireRight. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
