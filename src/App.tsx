import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import Landing from './components/Landing'
import Dashboard from './components/Dashboard'
import Marketplace from './components/Marketplace'
import CarbonCalculator from './components/CarbonCalculator'
import Profile from './components/Profile'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className={!isLanding ? 'bg-kaleo-sand/30 dark:bg-gray-900 min-h-[calc(100vh-4rem)]' : ''}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/calculator" element={<CarbonCalculator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      {!isLanding && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App