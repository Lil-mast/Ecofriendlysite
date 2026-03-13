import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { breathSectionConfig } from '../../config/landing'

export default function BreathSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={ref} className="relative w-full py-16 md:py-24 bg-kaleo-sand">
      <div className="px-4 md:px-8">
        <div
          className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-3xl transition-all duration-1000 ease-out"
          style={{
            transform: visible ? 'scale(1)' : 'scale(0.96)',
            borderRadius: visible ? '1.5rem' : '2.5rem',
          }}
        >
          <div className="relative aspect-[16/9] md:aspect-[21/9]">
            <img
              src={breathSectionConfig.backgroundImage}
              alt={breathSectionConfig.backgroundAlt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-kaleo-charcoal/50" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2
                className="font-display text-display text-kaleo-cream tracking-tight text-center transition-all duration-700"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'scale(1)' : 'scale(1.05)',
                  textShadow: '0 4px 30px rgba(0,0,0,0.3)',
                }}
              >
                {breathSectionConfig.title}
              </h2>
              <p
                className="font-body text-kaleo-cream/90 text-sm md:text-base uppercase tracking-[0.3em] mt-6 transition-all duration-700 delay-200"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {breathSectionConfig.subtitle}
              </p>
              <Link
                to="/calculator"
                className="mt-8 px-8 py-3 rounded-full bg-kaleo-terracotta text-kaleo-cream font-body text-sm uppercase tracking-wider hover:bg-kaleo-earth transition-colors"
              >
                Try the Calculator
              </Link>
            </div>
          </div>
        </div>
      </div>

      {breathSectionConfig.description && (
        <div className="max-w-4xl mx-auto px-6 md:px-8 mt-12 md:mt-16 text-center">
          <p className="font-body text-sm text-kaleo-earth/60 max-w-lg mx-auto leading-relaxed">
            {breathSectionConfig.description}
          </p>
        </div>
      )}
    </section>
  )
}
