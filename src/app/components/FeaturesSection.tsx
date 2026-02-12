import { motion } from 'motion/react';
import { BarChart3, Lightbulb, Award, Users, LineChart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const features = [
  {
    icon: BarChart3,
    title: 'Carbon Footprint Tracking',
    description: 'Real-time monitoring of your emissions across transport, energy, food, and lifestyle choices with precision analytics.',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: Lightbulb,
    title: 'Eco Habit Recommendations',
    description: 'AI-powered personalized suggestions based on your lifestyle patterns to reduce your environmental impact effectively.',
    color: 'from-green-500 to-lime-500'
  },
  {
    icon: Award,
    title: 'Sustainability Scoring',
    description: 'Comprehensive scoring system that measures your environmental performance and tracks improvement over time.',
    color: 'from-lime-500 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Community Challenges',
    description: 'Join global sustainability challenges, compete with peers, and amplify your positive impact through collective action.',
    color: 'from-emerald-600 to-teal-500'
  },
  {
    icon: LineChart,
    title: 'Impact Analytics & Reports',
    description: 'Detailed insights and exportable reports showing your environmental contributions and progress milestones.',
    color: 'from-teal-500 to-green-600'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent pointer-events-none" />
      
      {/* Abstract visual background */}
      <div className="absolute top-20 right-0 w-1/3 h-96 opacity-5 pointer-events-none">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1762281602367-ec51ab482914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyZWVuJTIwZW5lcmd5JTIwZmxvd2luZ3xlbnwxfHx8fDE3NzA5MTk2NTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Abstract sustainability visual"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-600 text-sm uppercase tracking-wider">Core Features</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6 text-slate-900">
              Everything you need to make a{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                real difference
              </span>
            </h2>
            <p className="text-xl text-slate-600">
              Powerful tools designed to transform individual actions into collective planetary impact.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl mb-3 text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="mt-6 flex items-center text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm">Learn more</span>
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}