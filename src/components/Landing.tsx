import Hero from './landing/Hero'
import NarrativeText from './landing/NarrativeText'
import ZigZagGrid from './landing/ZigZagGrid'
import BreathSection from './landing/BreathSection'
import CardStack from './landing/CardStack'
import LandingFooter from './landing/LandingFooter'

export default function Landing() {
  return (
    <div className="bg-kaleo-sand">
      <Hero />
      <NarrativeText />
      <ZigZagGrid />
      <BreathSection />
      <CardStack />
      <LandingFooter />
    </div>
  )
}
