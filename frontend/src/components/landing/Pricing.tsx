import React from 'react';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Monthly",
    price: "₹249",
    period: "/month",
    description: "Full access to all AI features with a flexible monthly cycle.",
    features: ["Unlimited AI Generation", "All Premium Templates", "Instant ATS Score Checking", "Cover Letter AI Builder", "Basic Support"],
    highlighted: false,
    cta: "Subscribe Monthly"
  },
  {
    name: "Yearly",
    price: "₹1,499",
    period: "/year",
    description: "The most popular choice for long-term career growth.",
    features: ["Everything in Monthly", "14-Day Free Trial", "50% Savings vs Monthly", "Early Access to New Features", "AI Resume Translation", "Expert Review Credit"],
    highlighted: true,
    cta: "Start 14-Day Free Trial"
  },
  {
    name: "Lifetime",
    price: "₹2,499",
    period: " once",
    description: "One-time investment. Own your career tools forever.",
    features: ["Everything in Pro", "Forever Access", "1-on-1 Career Review", "Exclusive Custom Designs", "Private Discord Access", "Beta Tester Badge"],
    highlighted: false,
    cta: "Get Lifetime Access"
  }
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="py-32 bg-slate-50 border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-4">Invest in Your Career</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Simple pricing, huge ROI</h3>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">A great resume increases your salary potential by thousands. Choose the plan that accelerates your hiring process today.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center max-w-[1100px] mx-auto">
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 50 }}
              className={`relative rounded-3xl p-8 transition-transform duration-300 ${plan.highlighted ? 'bg-slate-900 text-white shadow-[0_20px_50px_-12px_rgba(15,23,42,0.3)] scale-[1.05] md:scale-[1.1] border border-slate-800 z-10 hover:scale-[1.12]' : 'bg-white text-slate-900 border border-slate-200 shadow-sm hover:scale-[1.02]'}`}
            >
              
              {plan.highlighted && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 1 }}
                   className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                 >
                   <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg ring-4 ring-slate-50">Recommended</div>
                 </motion.div>
              )}

              <h4 className={`text-2xl font-black mb-3 ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h4>
              <p className={`text-sm mb-8 leading-relaxed ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className={`text-5xl font-black tracking-tight ${plan.highlighted ? 'text-white' : 'text-slate-900'}`}>{plan.price}</span>
                {plan.period && <span className={`text-sm font-semibold ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>}
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.highlighted ? 'text-indigo-400' : 'text-indigo-600'}`} />
                    <span className={`text-sm font-medium ${plan.highlighted ? 'text-slate-300' : 'text-slate-700'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlighted ? 'premium-button shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-sm'}`}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
