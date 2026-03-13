import React from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, Leaf, DollarSign, Users, Activity, Target } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Carbon Footprint',
      value: '2.4 tons',
      change: '-12%',
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Credits Purchased',
      value: '156',
      change: '+23%',
      icon: DollarSign,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Projects Supported',
      value: '12',
      change: '+8%',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Community Impact',
      value: '89%',
      change: '+15%',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to EcoNexus
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Track your carbon footprint, purchase carbon credits, and make a real impact on our planet's future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Purchased 10 carbon credits</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Updated carbon footprint</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Joined community challenge</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">3 days ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/calculator" className="btn-primary flex items-center justify-center space-x-2 py-3">
              <Activity className="h-4 w-4" />
              <span>Calculate Footprint</span>
            </Link>
            <Link to="/marketplace" className="btn-secondary flex items-center justify-center space-x-2 py-3">
              <TrendingUp className="h-4 w-4" />
              <span>View Marketplace</span>
            </Link>
            <Link to="/profile" className="btn-secondary flex items-center justify-center space-x-2 py-3">
              <Target className="h-4 w-4" />
              <span>Set Goals</span>
            </Link>
            <Link to="/marketplace" className="btn-secondary flex items-center justify-center space-x-2 py-3">
              <Users className="h-4 w-4" />
              <span>Join Community</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard