import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from 'next-themes'
import { Sun, Moon, Leaf, ShoppingCart, Calculator, User, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { path: '/', label: 'Home', icon: Leaf },
    { path: '/dashboard', label: 'Dashboard', icon: Leaf },
    { path: '/marketplace', label: 'Marketplace', icon: ShoppingCart },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/profile', label: 'Profile', icon: User },
  ]


  const isLanding = location.pathname === '/'

  return (
    <nav className={`sticky top-0 z-50 border-b transition-colors ${
      isLanding ? 'bg-kaleo-charcoal/90 backdrop-blur-md border-kaleo-cream/10' : 'bg-kaleo-cream/95 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className={`h-8 w-8 ${isLanding ? 'text-kaleo-terracotta' : 'text-kaleo-earth dark:text-kaleo-cream'}`} />
            <span className={`text-xl font-display font-semibold ${isLanding ? 'text-kaleo-cream' : 'text-kaleo-earth dark:text-kaleo-cream'}`}>
              EcoNexus
            </span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-4">
            {navItems.map(({ path, label, icon: Icon }) => {
              const active = location.pathname === path
              const landingStyle = isLanding
                ? active ? 'bg-kaleo-terracotta/20 text-kaleo-cream' : 'text-kaleo-cream/80 hover:text-kaleo-cream'
                : active ? 'bg-kaleo-terracotta/15 text-kaleo-earth dark:text-kaleo-cream' : 'text-kaleo-earth/80 hover:text-kaleo-earth dark:text-kaleo-cream/80 dark:hover:text-kaleo-cream'
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${landingStyle}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              )
            })}
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${isLanding ? 'text-kaleo-cream/80 hover:text-kaleo-cream' : 'text-kaleo-earth dark:text-kaleo-cream/80 hover:text-kaleo-terracotta'}`}
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg text-sm font-medium py-2 px-4 bg-kaleo-terracotta text-kaleo-cream hover:bg-kaleo-earth transition-colors"
                >
                  Register
                </Link>
              </>
            ) : (
              <button type="button" onClick={handleSignOut} className="flex items-center gap-1 text-sm font-medium text-kaleo-earth/80 dark:text-kaleo-cream/80 hover:text-red-600 dark:hover:text-red-400" aria-label="Sign out">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            )}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`p-2 rounded-lg transition-colors ${isLanding ? 'text-kaleo-cream/80 hover:text-kaleo-cream' : 'text-kaleo-earth dark:text-kaleo-cream/80 hover:text-kaleo-terracotta'}`}
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