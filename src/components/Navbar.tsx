import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, Leaf, ShoppingCart, Calculator, User, LogOut } from 'lucide-react'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    setIsAuth(!!localStorage.getItem('token'))
  }, [location.pathname])

  const handleSignOut = () => {
    localStorage.removeItem('token')
    setIsAuth(false)
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Leaf },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/profile', label: 'Profile', icon: User },
  ]


  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">EcoNexus</span>
          </Link>

          <div className="flex items-center space-x-6">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  location.pathname === path
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
            {!isAuth ? (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Sign in</Link>
                <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Register</Link>
              </>
            ) : (
              <button type="button" onClick={handleSignOut} className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-gray-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar