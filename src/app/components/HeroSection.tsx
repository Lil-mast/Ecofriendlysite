import { motion } from 'motion/react';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Subtle organic shapes in background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-20 right-10 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 2, delay: 0.3 }}
          className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-green-300 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 mb-8 text-sm"
              >
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Science-driven sustainability platform
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-6xl lg:text-7xl mb-6 text-slate-900 tracking-tight"
              >
                Track Your Impact.
                <br />
                <span className="bg-gradient-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
                  Transform the Planet.
                </span>
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed"
              >
                Measure your carbon footprint, adopt sustainable habits, and build a cleaner future through data-driven eco action.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12"
              >
                <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 text-lg">
                  Start Tracking
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-slate-700 rounded-full border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all duration-300 flex items-center gap-2 text-lg">
                  <PlayCircle className="w-5 h-5" />
                  Learn More
                </button>
              </motion.div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-slate-500"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>ISO 14001 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Data Privacy</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>50K+ Users</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Dashboard Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative hidden lg:block"
            >
              {/* Floating glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-green-500/30 rounded-3xl blur-3xl" />
              
              {/* Dashboard mockup container */}
              <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-200/50 overflow-hidden p-8">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBhbmFseXRpY3MlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzcwOTE5NjUxfDA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Sustainability Dashboard"
                  className="w-full h-auto rounded-2xl shadow-lg"
                />
                
                {/* Floating data cards */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-white rounded-2xl shadow-xl p-4 border border-emerald-100"
                >
                  <div className="text-sm text-slate-500 mb-1">CO₂ Saved</div>
                  <div className="text-2xl text-emerald-600">-240kg</div>
                  <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                    <span>+15% this week</span>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute bottom-4 left-4 bg-gradient-to-br from-emerald-600 to-green-600 rounded-2xl shadow-xl p-4 text-white"
                >
                  <div className="text-sm text-emerald-100 mb-1">Eco Score</div>
                  <div className="text-3xl">92/100</div>
                  <div className="text-xs text-emerald-100 mt-1">Excellent</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-2 bg-emerald-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}