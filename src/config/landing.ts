// Landing page content – EcoNexus sustainability theme

export const heroConfig = {
  backgroundImage: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=1920&q=80',
  backgroundAlt: 'Sustainable landscape with green energy',
  title: 'Sustainability Rooted in Action',
  subtitle: 'TRACK · REDUCE · TRANSFORM',
}

export const narrativeTextConfig = {
  line1: 'Empowering individuals and organizations to monitor, understand, and reduce their environmental impact through innovative technology.',
  line2: 'From carbon footprint to carbon credits—one platform.',
  line3: 'Join thousands of eco-conscious users making a measurable difference in the fight against climate change.',
}

export interface ZigZagGridItem {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  imageAlt: string
  reverse: boolean
}

export const zigZagGridConfig = {
  sectionLabel: 'Our Solutions',
  sectionTitle: 'Technology for a Greener Tomorrow',
  items: [
    {
      id: 'geospatial',
      title: 'Geospatial Intelligence',
      subtitle: 'Data-Driven Insights',
      description: 'Identify emission hotspots and analyze regional environmental impact. Our analytics provide carbon intensity monitoring and route-level emissions.',
      image: 'https://images.unsplash.com/photo-1569163138754-2b2076b8a9c0?w=800&q=80',
      imageAlt: 'Geospatial and carbon data visualization',
      reverse: false,
    },
    {
      id: 'marketplace',
      title: 'Carbon Credit Marketplace',
      subtitle: 'Trade with Confidence',
      description: 'Buy and sell verified carbon credits through our secure Stripe-powered platform. Support environmental projects while offsetting your emissions.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      imageAlt: 'Sustainability and finance',
      reverse: true,
    },
    {
      id: 'calculator',
      title: 'Carbon Footprint Calculator',
      subtitle: 'Know Your Impact',
      description: 'Estimate emissions from transportation, energy, and daily consumption. Track progress with personalized dashboards and tailored recommendations.',
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
      imageAlt: 'Tracking and analytics',
      reverse: false,
    },
  ] as ZigZagGridItem[],
}

export const breathSectionConfig = {
  backgroundImage: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=1920&q=80',
  backgroundAlt: 'Sustainable landscape',
  title: 'Making Every Action Count',
  subtitle: 'MEASURE YOUR IMPACT',
  description: 'Our Carbon Footprint Calculator helps you estimate emissions from transportation, energy usage, and daily consumption. Track your progress and receive tailored recommendations.',
}

export interface CardStackItem {
  id: number
  image: string
  title: string
  description: string
  rotation: number
}

export const cardStackConfig = {
  sectionTitle: 'Features That Drive Change',
  sectionSubtitle: 'EXPLORE OUR PLATFORM',
  cards: [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      title: 'Carbon Calculator',
      description: 'Estimate your carbon emissions from daily activities. Visualize your impact and set achievable reduction goals.',
      rotation: -2,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80',
      title: 'Global Marketplace',
      description: 'Trade verified carbon credits. Support environmental projects while offsetting your footprint through secure transactions.',
      rotation: 1,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1529156069898-49953e7b2a24?w=800&q=80',
      title: 'Community Impact',
      description: 'Join a growing movement of changemakers. Connect with sustainability advocates and amplify your impact together.',
      rotation: -1,
    },
  ] as CardStackItem[],
}

export const footerConfig = {
  heading: 'Start Your Sustainability Journey',
  description: 'Join EcoNexus today. Track your carbon footprint, trade carbon credits, and connect with a community dedicated to preserving our planet.',
  ctaText: 'Get Started Today',
  contact: [
    { type: 'email' as const, label: 'contact@econexus.com', href: 'mailto:contact@econexus.com' },
    { type: 'phone' as const, label: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  ],
  locationLabel: 'Location',
  address: ['Nairobi', 'Kenya'],
  logoText: 'EcoNexus',
  copyright: '© 2026 EcoNexus. All rights reserved. Building a sustainable future.',
  links: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Carbon Credits', href: '/marketplace' },
  ],
}
