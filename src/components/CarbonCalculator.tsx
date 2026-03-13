import React, { useState } from 'react'
import { Calculator, Car, Home, Plane, Zap } from 'lucide-react'

const CarbonCalculator = () => {
  const [formData, setFormData] = useState({
    transportation: '',
    electricity: '',
    flights: '',
    diet: ''
  })

  const [result, setResult] = useState<number | null>(null)

  const calculateFootprint = () => {
    // Simple calculation logic (in tons of CO2 per year)
    const transport = parseFloat(formData.transportation) * 2.4 || 0
    const electricity = parseFloat(formData.electricity) * 0.5 || 0
    const flights = parseFloat(formData.flights) * 0.2 || 0
    const diet = formData.diet === 'meat' ? 2.5 : formData.diet === 'vegetarian' ? 1.5 : 1.0

    const total = transport + electricity + flights + diet
    setResult(total)
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

          {result !== null ? (
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-4">
                {result.toFixed(1)}
              </div>
              <div className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                tons of CO₂ per year
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                    You're doing great!
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your carbon footprint is below the global average of 4.8 tons per person.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Ways to reduce:</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Consider electric or hybrid vehicles</li>
                    <li>• Switch to renewable energy providers</li>
                    <li>• Reduce air travel or offset flights</li>
                    <li>• Try plant-based meals a few times a week</li>
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
    </div>
  )
}

export default CarbonCalculator