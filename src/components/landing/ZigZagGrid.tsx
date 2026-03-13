import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { zigZagGridConfig, type ZigZagGridItem } from '../../config/landing'

function GridItem({ item, index }: { item: ZigZagGridItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${index > 0 ? 'mt-20 md:mt-28' : ''}`}
    >
      <div className={`relative overflow-hidden rounded-3xl ${item.reverse ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl transition-transform duration-700" style={{ transform: visible ? 'translateY(0)' : 'translateY(20px)' }}>
          <img
            src={item.image}
            alt={item.imageAlt}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className={`${item.reverse ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'}`}>
        <span
          className="font-body text-xs uppercase tracking-[0.2em] text-kaleo-terracotta transition-all duration-500"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {item.subtitle}
        </span>
        <h3
          className="font-display text-headline text-kaleo-earth mt-3 transition-all duration-500 delay-75"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          {item.title}
        </h3>
        <p
          className="font-body text-sm md:text-base text-kaleo-earth/70 leading-relaxed mt-6 transition-all duration-500 delay-150"
          style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
        >
          {item.description}
        </p>
        <div className="w-16 h-px bg-kaleo-terracotta/30 mt-8" style={{ opacity: visible ? 1 : 0 }} />
      </div>
    </div>
  )
}

export default function ZigZagGrid() {
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

  return (
    <section ref={ref} className="relative w-full py-24 md:py-32 bg-kaleo-sand">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        <div className="text-center mb-16 md:mb-20">
          <span
            className="font-body text-xs uppercase tracking-[0.2em] text-kaleo-terracotta transition-all duration-500"
            style={{ opacity: visible ? 1 : 0 }}
          >
            {zigZagGridConfig.sectionLabel}
          </span>
          <h2
            className="font-display text-headline text-kaleo-earth mt-4 transition-all duration-500 delay-100"
            style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(16px)' }}
          >
            {zigZagGridConfig.sectionTitle}
          </h2>
        </div>

        {zigZagGridConfig.items.map((item, index) => (
          <GridItem key={item.id} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
