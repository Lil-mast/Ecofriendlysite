import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react'
import { footerConfig } from '../../config/landing'

export default function LandingFooter() {
  return (
    <footer className="relative w-full bg-kaleo-charcoal text-kaleo-cream overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-kaleo-charcoal/95 via-kaleo-charcoal to-kaleo-charcoal" />

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 pt-20 md:pt-28 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-5">
              <h2 className="font-display text-headline text-kaleo-cream">
                {footerConfig.heading}
              </h2>
              <p className="font-body text-sm text-kaleo-cream/60 mt-6 max-w-md leading-relaxed">
                {footerConfig.description}
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-8 px-8 py-4 border border-kaleo-cream/30 rounded-full font-body text-sm uppercase tracking-wider text-kaleo-cream hover:border-kaleo-terracotta hover:bg-kaleo-terracotta/20 transition-all"
              >
                {footerConfig.ctaText}
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-body text-xs uppercase tracking-[0.15em] text-kaleo-terracotta mb-4">
                    Contact
                  </h4>
                  <ul className="space-y-3">
                    {footerConfig.contact.map((item, i) => (
                      <li key={i}>
                        <a
                          href={item.href}
                          className="font-body text-sm text-kaleo-cream/70 hover:text-kaleo-cream transition-colors flex items-center gap-2"
                        >
                          {item.type === 'email' ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-body text-xs uppercase tracking-[0.15em] text-kaleo-terracotta mb-4">
                    {footerConfig.locationLabel}
                  </h4>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-kaleo-cream/70 mt-0.5 flex-shrink-0" />
                    <p className="font-body text-sm text-kaleo-cream/70 leading-relaxed">
                      {footerConfig.address.map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < footerConfig.address.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {footerConfig.logoText && (
          <div className="border-t border-kaleo-cream/10 py-10 md:py-12">
            <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
              <p className="font-display text-4xl md:text-5xl text-center text-kaleo-cream/20 tracking-widest">
                {footerConfig.logoText}
              </p>
            </div>
          </div>
        )}

        <div className="border-t border-kaleo-cream/10 py-6">
          <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-kaleo-cream/40">
              {footerConfig.copyright}
            </p>
            <div className="flex gap-6">
              {footerConfig.links.map((link, i) => (
                <Link
                  key={i}
                  to={link.href}
                  className="font-body text-xs text-kaleo-cream/40 hover:text-kaleo-cream transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
