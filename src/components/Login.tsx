import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogIn, Mail, Lock, Leaf } from 'lucide-react'
import { auth } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await auth.login(email, password)
      login(data.token, { id: data.user.id, email: data.user.email })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col md:flex-row">
      {/* Left: branding */}
      <div className="hidden md:flex md:w-2/5 bg-kaleo-charcoal relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?w=800&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-kaleo-terracotta/10 to-transparent" />
        <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <Leaf className="h-10 w-10 text-kaleo-terracotta" />
            <span className="font-display text-2xl text-kaleo-cream">EcoNexus</span>
          </Link>
          <p className="font-display text-3xl lg:text-4xl text-kaleo-cream leading-tight max-w-sm">
            Track your footprint. Offset with impact.
          </p>
          <p className="font-body text-kaleo-cream/60 mt-4 text-sm">
            Sign in to access your dashboard, carbon calculator, and the marketplace.
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-kaleo-sand/50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8 justify-center">
            <Leaf className="h-9 w-9 text-kaleo-terracotta" />
            <span className="font-display text-xl text-kaleo-earth">EcoNexus</span>
          </Link>

          <div className="bg-kaleo-cream rounded-3xl shadow-xl border border-kaleo-terracotta/10 p-8 md:p-10">
            <h1 className="font-display text-headline text-kaleo-earth mb-2">
              Welcome back
            </h1>
            <p className="font-body text-sm text-kaleo-earth/60 mb-8">
              Sign in to your account to continue.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-sm border border-red-200 dark:border-red-800"
                  role="alert"
                >
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="login-email" className="block font-body text-sm font-medium text-kaleo-earth mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kaleo-earth/40" />
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-kaleo-terracotta/20 bg-white dark:bg-gray-800 text-kaleo-earth dark:text-kaleo-cream placeholder:text-kaleo-earth/40 focus:outline-none focus:ring-2 focus:ring-kaleo-terracotta/50 focus:border-kaleo-terracotta transition-all"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block font-body text-sm font-medium text-kaleo-earth mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-kaleo-earth/40" />
                  <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-kaleo-terracotta/20 bg-white dark:bg-gray-800 text-kaleo-earth dark:text-kaleo-cream placeholder:text-kaleo-earth/40 focus:outline-none focus:ring-2 focus:ring-kaleo-terracotta/50 focus:border-kaleo-terracotta transition-all"
                    required
                    autoComplete="current-password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-kaleo-terracotta hover:bg-kaleo-earth text-kaleo-cream font-body text-sm font-medium uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-kaleo-cream border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </>
                )}
              </button>
            </form>

            <p className="mt-6 text-center font-body text-sm text-kaleo-earth/60">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-kaleo-terracotta font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center font-body text-xs text-kaleo-earth/50">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
