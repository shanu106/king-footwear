import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
  ]

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-7">
      {/* Logo */}
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
        onClick={() => navigate('/admin/dashboard')}
      >
        <div className="w-11 h-11 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg grid place-items-center text-rose-700 font-extrabold shadow-md">
          👑
        </div>
        <div>
          <div className="text-sm text-gray-700 font-semibold">sandalista</div>
          <div className="text-xs text-gray-500">Admin Panel</div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(link => (
          <button
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`px-3 py-2 rounded-lg font-semibold transition flex items-center gap-2 text-sm ${
              isActive(link.path)
                ? 'bg-white/80 text-rose-600 shadow-md border border-gray-100'
                : 'text-gray-700 hover:bg-white/50'
            }`}
          >
            <span>{link.icon}</span>
            <span className="hidden lg:inline">{link.label}</span>
          </button>
        ))}
      </div>

      {/* User Profile & Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 bg-white/50 px-3 py-2 rounded-lg border border-gray-100">
          <span className="text-gray-700 font-semibold text-sm">{user?.name || 'Admin'}</span>
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-rose-600 transition text-lg"
            title="Store"
          >
            🏪
          </button>
        </div>
        
        <button
          onClick={handleLogout}
          className="hidden md:flex px-4 py-2 bg-white rounded-lg border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition text-sm shadow"
        >
          Logout
        </button>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-1">
          <button
            onClick={() => navigate('/')}
            className="bg-white hover:scale-90 rounded-lg p-2 shadow flex items-center justify-center transition border border-gray-100"
            title="Store"
          >
            🏪
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-white rounded-lg p-2 shadow flex items-center justify-center transition border border-gray-100"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map(link => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path)
                  setIsMenuOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition flex items-center gap-3 ${
                  isActive(link.path)
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center gap-3 border border-gray-200"
            >
              <span>🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
