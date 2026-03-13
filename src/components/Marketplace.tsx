import React from 'react'
import { ShoppingCart, Star, MapPin, Leaf } from 'lucide-react'

const Marketplace = () => {
  const credits = [
    {
      id: 1,
      name: 'Amazon Rainforest Protection',
      location: 'Brazil',
      price: 25,
      rating: 4.8,
      impact: '500 tons CO2',
      image: '🌳'
    },
    {
      id: 2,
      name: 'Solar Farm Development',
      location: 'California, USA',
      price: 18,
      rating: 4.9,
      impact: '300 tons CO2',
      image: '☀️'
    },
    {
      id: 3,
      name: 'Wind Energy Project',
      location: 'Texas, USA',
      price: 22,
      rating: 4.7,
      impact: '400 tons CO2',
      image: '💨'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Carbon Credit Marketplace
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Purchase verified carbon credits and support environmental projects worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {credits.map((credit) => (
          <div key={credit.id} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="text-4xl mb-4">{credit.image}</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {credit.name}
            </h3>
            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{credit.location}</span>
            </div>
            <div className="flex items-center space-x-1 mb-3">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 dark:text-gray-400">{credit.rating}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-1">
                <Leaf className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">{credit.impact}</span>
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">${credit.price}</span>
            </div>
            <button className="btn-primary w-full flex items-center justify-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span>Purchase</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace