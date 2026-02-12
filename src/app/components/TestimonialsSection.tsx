import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const testimonials = [
  {
    quote: "This platform transformed how our startup approaches sustainability. The data-driven insights helped us reduce our carbon footprint by 40% in just six months.",
    author: "Sarah Chen",
    role: "Founder, GreenTech Innovations",
    image: "https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcwODM2MzEwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  },
  {
    quote: "The community challenges keep me motivated. It's amazing to see how small daily changes add up to significant environmental impact. Highly recommend!",
    author: "Marcus Rodriguez",
    role: "Environmental Advocate",
    image: "https://images.unsplash.com/photo-1656660062659-1f5eb5c1d069?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbnZpcm9ubWVudGFsJTIwc2NpZW50aXN0JTIwbWFuJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcwOTE3MDg0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  },
  {
    quote: "As a professional trying to make better choices, this app makes sustainability accessible and measurable. The personalized recommendations are spot-on.",
    author: "Emma Thompson",
    role: "Product Manager, Tech Corp",
    image: "https://images.unsplash.com/photo-1585737655161-76ddbd569e5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRpdmVyc2UlMjBwcm9mZXNzaW9uYWwlMjBzbWlsaW5nfGVufDF8fHx8MTc3MDkxNzA4Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 5
  }
];

const partnerships = [
  { name: 'WWF', type: 'Conservation Partner' },
  { name: 'The Nature Conservancy', type: 'Reforestation' },
  { name: 'Ocean Cleanup', type: 'Marine Protection' },
  { name: 'Carbon Trust', type: 'Verification' }
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100/40 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 text-slate-900">
              Trusted by changemakers{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                worldwide
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Join thousands of individuals and organizations making a measurable impact.
            </p>
          </motion.div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-20">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <div className="h-full p-8 rounded-3xl bg-gradient-to-br from-emerald-50 to-green-50/50 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-emerald-400 mb-6" />

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-lg leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <ImageWithFallback
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-slate-900">
                      {testimonial.author}
                    </div>
                    <div className="text-slate-500 text-sm">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partnerships */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-t border-slate-200 pt-16"
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-center text-slate-600 mb-10 text-lg">
              Partnering with leading environmental organizations
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {partnerships.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-slate-50 hover:bg-emerald-50 transition-colors duration-300"
                >
                  <div className="text-slate-800 mb-2">
                    {partner.name}
                  </div>
                  <div className="text-sm text-slate-500">
                    {partner.type}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>B Corp Certified</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Carbon Neutral</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>GDPR Compliant</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
