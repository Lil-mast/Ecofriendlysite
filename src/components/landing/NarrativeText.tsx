import { useRef, useEffect, useState } from 'react'
import { narrativeTextConfig } from '../../config/landing'

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
    </svg>
  )
}

export default function NarrativeText() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 bg-kaleo-sand">
      <div className="max-w-4xl mx-auto px-6 md:px-8 text-center">
        <div className="flex justify-center mb-12 transition-all duration-700" style={{ opacity: visible ? 1 : 0, transform: visible ? 'scale(1)' : 'scale(0.5)' }}>
          <StarIcon className="w-8 h-8 text-kaleo-terracotta spin-slow" />
        </div>

        <div className="space-y-8">
          <p
            className="font-display text-headline text-kaleo-earth transition-all duration-700"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            {narrativeTextConfig.line1}
          </p>
          <p
            className="font-display text-subheadline text-kaleo-earth/80 italic max-w-2xl mx-auto transition-all duration-700 delay-100"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            {narrativeTextConfig.line2}
          </p>
          <p
            className="font-body text-sm md:text-base text-kaleo-earth/60 max-w-lg mx-auto leading-relaxed transition-all duration-700 delay-200"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)' }}
          >
            {narrativeTextConfig.line3}
          </p>
        </div>

        <div className="flex justify-center mt-12">
          <StarIcon className="w-5 h-5 text-kaleo-terracotta/50" />
        </div>
      </div>
    </section>
  )
}
