import { motion } from 'motion/react';
import { Leaf, Menu } from 'lucide-react';
import { useState } from 'react';

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position for navbar effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 50);
    });
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-emerald-500/5'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-slate-900">EcoTrack</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-slate-600 hover:text-emerald-600 transition-colors">
              How it Works
            </a>
            <a href="#impact" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Impact
            </a>
            <a href="#testimonials" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="text-slate-600 hover:text-emerald-600 transition-colors">
              Pricing
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-slate-600 hover:text-emerald-600 transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300">
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </motion.nav>
  );
}
