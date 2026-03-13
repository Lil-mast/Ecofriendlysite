import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { heroConfig } from '../../config/landing'

export default function Hero() {
  const imageRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden">
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-full transition-transform duration-[2s] ease-out"
        style={{ transform: loaded ? 'scale(1)' : 'scale(1.15)' }}
      >
        <img
          src={heroConfig.backgroundImage}
          alt={heroConfig.backgroundAlt}
          className="w-full h-full object-cover ken-burns"
        />
      </div>
      <div className="absolute inset-0 bg-kaleo-charcoal/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-kaleo-sand/30" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <h1
          ref={titleRef}
          className="font-display text-kaleo-cream text-display tracking-tight text-center transition-all duration-1000 ease-out"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'scale(1)' : 'scale(1.05)',
            textShadow: '0 4px 30px rgba(0,0,0,0.4)',
          }}
        >
          {heroConfig.title}
        </h1>
        <p
          ref={subtitleRef}
          className="font-body text-kaleo-cream/90 text-sm md:text-base uppercase tracking-[0.3em] mt-6 transition-all duration-700 delay-300"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(20px)' }}
        >
          {heroConfig.subtitle}
        </p>
        <div className="mt-10 flex gap-4" style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s 0.5s' }}>
          <Link
            to="/calculator"
            className="px-8 py-3 rounded-full bg-kaleo-terracotta text-kaleo-cream font-body text-sm uppercase tracking-wider hover:bg-kaleo-earth transition-colors"
          >
            Calculate Footprint
          </Link>
          <Link
            to="/marketplace"
            className="px-8 py-3 rounded-full border border-kaleo-cream/40 text-kaleo-cream font-body text-sm uppercase tracking-wider hover:bg-kaleo-cream/10 transition-colors"
          >
            Explore Marketplace
          </Link>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-kaleo-sand to-transparent pointer-events-none" />
    </section>
  )
}
