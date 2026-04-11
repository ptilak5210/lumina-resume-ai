import React from 'react';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Product Manager at TechCorp",
    image: "https://i.pravatar.cc/150?img=5",
    text: "Lumina AI completely transformed my resume. The ATS score checker helped me identify missing keywords, and I landed interviews at three FAANG companies within a month!"
  },
  {
    name: "David Chen",
    role: "Software Engineer",
    image: "https://i.pravatar.cc/150?img=11",
    text: "The AI bullet generator is literal magic. It took my boring day-to-day tasks and turned them into powerful, impact-driven achievements. Cannot recommend this enough."
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    image: "https://i.pravatar.cc/150?img=9",
    text: "I hadn't updated my resume in 6 years. Lumina made the process so incredibly easy and the final design looks like I paid a professional agency thousands of dollars."
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-indigo-600 font-bold tracking-wide uppercase text-sm mb-3">Wall of Love</h2>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Don't just take our word for it</h3>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-slate-50 border border-slate-100 p-8 rounded-[2rem] relative hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-shadow duration-300"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-indigo-100" />
              <div className="flex items-center gap-4 mb-6">
                <img src={t.image} alt={t.name} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" />
                <div>
                  <h4 className="font-bold text-slate-900">{t.name}</h4>
                  <p className="text-xs font-semibold text-slate-500">{t.role}</p>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed font-medium">"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
