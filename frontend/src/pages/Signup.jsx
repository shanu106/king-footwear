import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Signup = () => {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const url = window.RUNTIME_CONFIG.VITE_BACKEND_URL;
  // const url = import.meta.env.VITE_BACKEND_URL

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (mobile.length !== 10) {
      setError('Mobile number must be 10 digits')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${url}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname,
          email,
          mobile: `+91${mobile}`,
          password,
        }),
        credentials: 'include',
      })
      
      const data = await response.json()
      // console.log(data)
      // console.log('Signup Response:', data)
      // console.log('Full Response Object:', JSON.stringify(data, null, 2))
      
      if (response.ok) {
        // Set token in localStorage
        localStorage.setItem('token', data.token)
        
        // Set isAdmin flag
        localStorage.setItem('isAdmin', 'false')
        
        // Extract user data from response
        const userData = {
          id: data.user?._id || data._id,
          email: data.user?.email || data.email,
          name: data.user?.fullname || data.fullname || fullname,
          fullname: data.user?.fullname || data.fullname || fullname,
          mobile: data.user?.mobile || data.mobile,
          orders: data.user?.orders || data.orders || [],
          isAdmin: false,
        }
        
        console.log('Extracted User Data:', userData)
        
        // Use context to login
        login(userData)
        navigate('/')
      } else {
        setError(data.message || 'Signup failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 p-7">
      <Navbar />
      <main className="max-w-md mx-auto mt-8">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join us and discover beautiful sandals</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-semibold">+91</span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="9876543210"
                  maxLength="10"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-6 text-white font-semibold bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-rose-500 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Signup

