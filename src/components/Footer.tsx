import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-kaleo-charcoal text-kaleo-cream mt-16 border-t border-kaleo-cream/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="h-8 w-8 text-kaleo-terracotta" />
              <span className="text-2xl font-display font-semibold text-kaleo-cream">EcoNexus</span>
            </div>
            <p className="text-kaleo-cream/70 mb-4">
              Empowering sustainable living through carbon footprint tracking,
              carbon credit trading, and environmental impact analysis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-kaleo-cream">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-kaleo-cream/70 hover:text-kaleo-terracotta transition-colors">Dashboard</Link></li>
              <li><Link to="/calculator" className="text-kaleo-cream/70 hover:text-kaleo-terracotta transition-colors">Calculator</Link></li>
              <li><Link to="/marketplace" className="text-kaleo-cream/70 hover:text-kaleo-terracotta transition-colors">Carbon Credits</Link></li>
              <li><Link to="/profile" className="text-kaleo-cream/70 hover:text-kaleo-terracotta transition-colors">Profile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-kaleo-cream">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-kaleo-terracotta" />
                <span className="text-kaleo-cream/70">christiantazma77@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-kaleo-terracotta" />
                <span className="text-kaleo-cream/70">+254 781614100</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-kaleo-terracotta" />
                <span className="text-kaleo-cream/70">Nairobi, Kenya</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-kaleo-cream/50">
            © 2026 EcoNexus. All rights reserved. Building a sustainable future, one carbon credit at a time.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer