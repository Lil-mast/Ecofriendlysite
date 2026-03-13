import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { cardStackConfig } from '../../config/landing'

export default function CardStack() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const cards = cardStackConfig.cards

  return (
    <section ref={ref} className="relative w-full py-24 md:py-32 bg-kaleo-sand">
      <div className="text-center mb-12 md:mb-16">
        <h2
          className="font-display text-headline text-kaleo-earth transition-all duration-500"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {cardStackConfig.sectionTitle}
        </h2>
        <p
          className="font-body text-sm text-kaleo-terracotta uppercase tracking-[0.2em] mt-4 transition-all duration-500 delay-100"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {cardStackConfig.sectionSubtitle}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className="transition-all duration-700 ease-out"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible
                  ? `translateY(0) rotate(${card.rotation}deg)`
                  : `translateY(40px) rotate(${card.rotation}deg)`,
                transitionDelay: `${index * 120}ms`,
              }}
            >
              <Link
                to={index === 0 ? '/calculator' : index === 1 ? '/marketplace' : '/dashboard'}
                className="block group"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-lg bg-kaleo-cream h-full min-h-[320px]">
                  <div className="absolute inset-0">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kaleo-charcoal/70 via-transparent to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3 className="font-display text-2xl md:text-3xl text-kaleo-cream mb-2">
                      {card.title}
                    </h3>
                    <p className="font-body text-sm text-kaleo-cream/80">
                      {card.description}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-kaleo-cream/20 backdrop-blur-sm flex items-center justify-center">
                    <span className="font-body text-xs text-kaleo-cream">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
