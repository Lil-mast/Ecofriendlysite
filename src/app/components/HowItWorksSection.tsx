import { motion } from 'motion/react';
import { Link, Activity, Target, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const steps = [
  {
    icon: Link,
    number: '01',
    title: 'Connect your lifestyle data',
    description: 'Securely link your daily activities, transportation, energy usage, and consumption patterns to our platform.'
  },
  {
    icon: Activity,
    number: '02',
    title: 'Track emissions automatically',
    description: 'Our AI analyzes your data in real-time to calculate your carbon footprint with scientific precision.'
  },
  {
    icon: Target,
    number: '03',
    title: 'Get personalized eco actions',
    description: 'Receive tailored recommendations based on behavioral science to reduce your environmental impact.'
  },
  {
    icon: TrendingUp,
    number: '04',
    title: 'Monitor real-world impact',
    description: 'Watch your positive changes translate into measurable environmental benefits and track your progress.'
  }
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-200/20 rounded-full blur-3xl" />
      
      {/* Technology visual */}
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1687389806477-22be64a5480f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwdGVjaG5vbG9neSUyMGludGVyZmFjZSUyMGhvbG9ncmFtfGVufDF8fHx8MTc3MDkxOTY1MHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Futuristic technology"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 text-sm uppercase tracking-wider">How It Works</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 text-slate-900">
              From data to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                planetary action
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Four simple steps to start making a measurable environmental impact today.
            </p>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                <div className="flex gap-6">
                  {/* Number indicator */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="text-emerald-600/40 text-5xl mb-2">
                      {step.number}
                    </div>
                    <h3 className="text-2xl mb-3 text-slate-900">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connecting line (except last item) */}
                {index < steps.length - 1 && index % 2 === 0 && (
                  <div className="hidden lg:block absolute top-20 -right-8 w-16 h-px bg-gradient-to-r from-emerald-300 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 text-lg">
            Get Started Free
          </button>
        </motion.div>
      </div>
    </section>
  );
}