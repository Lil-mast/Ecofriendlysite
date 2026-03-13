import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Marketplace from './components/Marketplace'
import CarbonCalculator from './components/CarbonCalculator'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={!isLanding ? 'bg-kaleo-sand/30 dark:bg-gray-900 min-h-[calc(100vh-4rem)]' : ''}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/calculator" element={<CarbonCalculator />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isLanding && !isAuthPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App