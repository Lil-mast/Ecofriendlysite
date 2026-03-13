import React from 'react'
import { User, Mail, MapPin, Calendar, Award, TrendingDown } from 'lucide-react'

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Profile
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Track your sustainability journey and achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card text-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              John Doe
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Eco Warrior</p>

            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span>john.doe@email.com</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>San Francisco, CA</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>Member since 2023</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sustainability Goals
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reduce carbon footprint by 20%
                  </span>
                  <span className="text-sm text-green-600 font-medium">75% complete</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Purchase 200 carbon credits
                  </span>
                  <span className="text-sm text-blue-600 font-medium">156/200 credits</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Go car-free for 30 days
                  </span>
                  <span className="text-sm text-purple-600 font-medium">12/30 days</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">First Steps</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Completed calculator</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <TrendingDown className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Carbon Reducer</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Reduced by 15%</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Supporter</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">100+ credits bought</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-gray-900 dark:text-white">Community Leader</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Shared 50+ tips</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile