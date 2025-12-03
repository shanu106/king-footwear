import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const url = import.meta.env.VITE_BACKEND_URL

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // First, try admin login (silent fail if endpoint doesn't exist)
      let isAdmin = false
      try {
        const adminResponse = await fetch(`${url}/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
          credentials: 'include',
        })

        if (adminResponse.status === 200) {
          const adminData = await adminResponse.json()
          localStorage.setItem('token', adminData.token)
          localStorage.setItem('isAdmin', 'true')
          
          const adminUserData = {
            id: adminData.admin?._id || adminData._id,
            email: adminData.admin?.email || adminData.email,
            name: adminData.admin?.name || adminData.name || email.split('@')[0],
            isAdmin: true,
          }
          
          login(adminUserData)
          navigate('/admin/dashboard')
          return
        }
      } catch (adminErr) {
        // Silently ignore admin login errors and proceed to user login
      }

      // If admin login fails, try normal user login
      const userResponse = await fetch(`${url}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const userData = await userResponse.json()

      if (userResponse.ok) {
        // Set token in localStorage
        localStorage.setItem('token', userData.token)
        localStorage.setItem('isAdmin', 'false')
        
        // Extract user data from response
        const userLoginData = {
          id: userData.user?._id || userData._id,
          email: userData.user?.email || userData.email,
          name: userData.user?.fullname || userData.fullname || email.split('@')[0],
          fullname: userData.user?.fullname || userData.fullname,
          mobile: userData.user?.mobile || userData.mobile,
          orders: userData.user?.orders || userData.orders || [],
          isAdmin: false,
        }
        
        // Use context to login
        login(userLoginData)
        navigate('/')
      } else {
        setError(userData.message || 'Login failed')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 p-7">
      <Navbar />
      <main className="max-w-md mx-auto mt-12">
        <div className="bg-white/80 backdrop-blur rounded-2xl p-8 shadow-lg">
          <h1 className="text-3xl font-extrabold mb-2">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue shopping</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-200 transition bg-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-6 text-white font-semibold bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg shadow hover:shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-rose-500 font-semibold hover:underline"
            >
              Create one
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Login
