import React, { useState, useMemo } from 'react'
import { Calculator, Car, Home, Plane, Zap } from 'lucide-react'
import DistanceMap from './DistanceMap'

const GLOBAL_AVG_TONS = 4.8

type Breakdown = { transport: number; electricity: number; flights: number; diet: number }

function getResultComment(total: number): { heading: string; body: string; variant: 'success' | 'warning' | 'danger' } {
  if (total < 3.5) {
    return {
      heading: "You're doing great!",
      body: `Your carbon footprint (${total.toFixed(1)} t) is well below the global average of ${GLOBAL_AVG_TONS} tons per person.`,
      variant: 'success',
    }
  }
  if (total <= 5.5) {
    return {
      heading: "You're around average",
      body: `Your footprint (${total.toFixed(1)} t) is close to the global average of ${GLOBAL_AVG_TONS} tons. Small changes can bring it down.`,
      variant: 'warning',
    }
  }
  if (total <= 10) {
    return {
      heading: "Above average – room to improve",
      body: `Your footprint (${total.toFixed(1)} t) is above the global average. Focus on your biggest categories below.`,
      variant: 'warning',
    }
  }
  return {
    heading: "High footprint – consider reducing",
    body: `Your footprint (${total.toFixed(1)} t) is much higher than average. Prioritize transport, flights, and energy.`,
    variant: 'danger',
  }
}

function getWaysToReduce(breakdown: Breakdown): string[] {
  const entries: [keyof Breakdown, number, string[]][] = [
    ['transport', breakdown.transport, ['Consider electric or hybrid vehicles', 'Carpool or use public transit', 'Combine errands to drive less']],
    ['electricity', breakdown.electricity, ['Switch to a renewable energy provider', 'Use LED bulbs and turn off unused devices', 'Improve insulation and use a programmable thermostat']],
    ['flights', breakdown.flights, ['Reduce air travel or choose direct flights', 'Offset flights with verified carbon credits', 'Use video calls instead of short business trips']],
    ['diet', breakdown.diet, ['Try plant-based meals a few times a week', 'Reduce red meat and choose local produce', 'Cut food waste with meal planning']],
  ]
  entries.sort((a, b) => b[1] - a[1])
  const top = entries.filter(([, v]) => v > 0).slice(0, 2)
  const tips: string[] = []
  top.forEach(([, , t]) => tips.push(...t.slice(0, 2)))
  if (tips.length === 0) tips.push('Adjust the form and recalculate to get personalized tips.')
  return tips
}

const CarbonCalculator = () => {
  const [formData, setFormData] = useState({
    transportation: '',
    electricity: '',
    flights: '',
    diet: ''
  })

  const [result, setResult] = useState<number | null>(null)
  const [breakdown, setBreakdown] = useState<Breakdown | null>(null)

  const { comment, waysToReduce } = useMemo(() => {
    if (result === null || breakdown === null) return { comment: null, waysToReduce: [] }
    return {
      comment: getResultComment(result),
      waysToReduce: getWaysToReduce(breakdown),
    }
  }, [result, breakdown])

  const calculateFootprint = () => {
    const transport = parseFloat(formData.transportation) * 2.4 || 0
    const electricity = parseFloat(formData.electricity) * 0.5 || 0
    const flights = parseFloat(formData.flights) * 0.2 || 0
    const diet = formData.diet === 'meat' ? 2.5 : formData.diet === 'vegetarian' ? 1.5 : 1.0
    const total = transport + electricity + flights + diet
    setResult(total)
    setBreakdown({ transport, electricity, flights, diet })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Carbon Footprint Calculator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Calculate your annual carbon footprint and discover ways to reduce your environmental impact.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Calculate Your Footprint</span>
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Car className="h-4 w-4 inline mr-2" />
                Miles driven per year
              </label>
              <input
                type="number"
                value={formData.transportation}
                onChange={(e) => setFormData({...formData, transportation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="12000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Zap className="h-4 w-4 inline mr-2" />
                Monthly electricity usage (kWh)
              </label>
              <input
                type="number"
                value={formData.electricity}
                onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Plane className="h-4 w-4 inline mr-2" />
                Flights per year
              </label>
              <input
                type="number"
                value={formData.flights}
                onChange={(e) => setFormData({...formData, flights: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                placeholder="2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Home className="h-4 w-4 inline mr-2" />
                Diet type
              </label>
              <select
                value={formData.diet}
                onChange={(e) => setFormData({...formData, diet: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select diet type</option>
                <option value="meat">Meat-based</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>

            <button
              onClick={calculateFootprint}
              className="btn-primary w-full flex items-center justify-center space-x-2 py-3"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate Footprint</span>
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Your Results
          </h3>

          {result !== null && comment ? (
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 dark:text-green-400 mb-4">
                {result.toFixed(1)}
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                tons of CO₂ per year
              </div>

              <div className="space-y-4">
                <div
                  className={`p-4 rounded-lg ${
                    comment.variant === 'success'
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                      : comment.variant === 'warning'
                        ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                  }`}
                >
                  <h4 className="font-semibold mb-2">{comment.heading}</h4>
                  <p className="text-sm opacity-90">{comment.body}</p>
                </div>

                <div className="space-y-2 text-left">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ways to reduce:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {waysToReduce.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Calculator className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Fill out the form and click calculate to see your carbon footprint</p>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Track distance in real time
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Start tracking to see your path on the map and total distance traveled (e.g. for a trip or commute).
        </p>
        <DistanceMap />
      </div>
    </div>
  )
}

export default CarbonCalculator