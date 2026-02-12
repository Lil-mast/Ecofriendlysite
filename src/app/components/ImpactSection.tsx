import { motion } from 'motion/react';
import { Cloud, TreePine, Recycle, Users } from 'lucide-react';

const metrics = [
  {
    icon: Cloud,
    value: '2.4M',
    unit: 'tons',
    label: 'CO₂ Saved',
    description: 'Equivalent to planting 110M trees',
    color: 'from-emerald-500 to-green-500'
  },
  {
    icon: TreePine,
    value: '850K',
    unit: '',
    label: 'Trees Planted',
    description: 'Through verified reforestation partners',
    color: 'from-green-500 to-lime-500'
  },
  {
    icon: Recycle,
    value: '1.8M',
    unit: 'kg',
    label: 'Plastic Reduced',
    description: 'Prevented from entering oceans',
    color: 'from-lime-500 to-emerald-500'
  },
  {
    icon: Users,
    value: '420',
    unit: '',
    label: 'Communities Impacted',
    description: 'Across 52 countries worldwide',
    color: 'from-emerald-600 to-teal-500'
  }
];

export function ImpactSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-900 via-green-900 to-emerald-800 text-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-emerald-300 text-sm uppercase tracking-wider">Real-World Impact</span>
            <h2 className="text-5xl md:text-6xl mt-4 mb-6">
              Measurable change.
              <br />
              <span className="bg-gradient-to-r from-emerald-300 to-green-200 bg-clip-text text-transparent">
                Undeniable results.
              </span>
            </h2>
            <p className="text-xl text-emerald-100">
              Our community's collective actions are creating tangible environmental benefits across the globe.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="text-center p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                  <metric.icon className="w-8 h-8 text-white" />
                </div>

                {/* Number */}
                <div className="mb-2">
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                    className="text-5xl md:text-6xl bg-gradient-to-r from-emerald-200 to-green-100 bg-clip-text text-transparent"
                  >
                    {metric.value}
                  </motion.div>
                  {metric.unit && (
                    <div className="text-emerald-300 text-lg mt-1">
                      {metric.unit}
                    </div>
                  )}
                </div>

                {/* Label */}
                <h3 className="text-xl mb-3 text-white">
                  {metric.label}
                </h3>

                {/* Description */}
                <p className="text-emerald-200 text-sm leading-relaxed">
                  {metric.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="text-emerald-200 text-lg mb-6">
            Updated in real-time • Last updated: February 2026
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm text-emerald-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>Verified by Climate Action Network</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>Audited by PwC</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full" />
              <span>UN SDG Aligned</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
