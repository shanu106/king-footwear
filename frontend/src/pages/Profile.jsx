import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Profile = () => {
  const navigate = useNavigate()
  const { user, isAuth, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = () => {
   
    logout()
   
    navigate('/')
  }

  const confirmLogout = () => {
    setShowLogoutDialog(false)
    handleLogout()
  }

  if (!isAuth || !user) {
    return (
      <>
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
          <main className="max-w-7xl mx-auto">
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                <p className="text-gray-600 mb-8">Please log in to view your profile</p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => navigate('/login')}
                    className="px-6 py-3 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg shadow hover:shadow-md transition"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
        <main className="max-w-7xl mx-auto">
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">My Profile</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* User Details Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-rose-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-50 rounded-full grid place-items-center text-rose-700 font-bold text-xl shadow-md">
                    {user?.email?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
                    <p className="text-sm text-gray-500">Manage your profile information</p>
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="pb-4 border-b border-rose-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Full Name</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.fullname || user?.name || 'User'}</p>
                  </div>

                  <div className="pb-4 border-b border-rose-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.email}</p>
                  </div>

                  <div className="pb-4 border-b border-rose-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile Number</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.mobile || 'Not added'}</p>
                  </div>
                  
                  <div className="pb-4 border-b border-rose-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Account Status</p>
                    <p className="text-lg font-semibold text-green-600 mt-1">✓ Active</p>
                  </div>
                  
                  <div className="pb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {user?.timestamp ? new Date(user.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="pb-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</p>
                    <p className="text-xs font-mono text-gray-600 mt-1 break-all">{user?.id || 'N/A'}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Orders</p>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{user?.orders?.length || 0}</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Logout
                </button>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl shadow-lg p-8 border border-rose-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 bg-white rounded-lg hover:bg-rose-50 hover:shadow-md transition-all border border-rose-100 flex items-center justify-between group"
                  >
                    <span>View Orders</span>
                    <svg className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 bg-white rounded-lg hover:bg-rose-50 hover:shadow-md transition-all border border-rose-100 flex items-center justify-between group"
                  >
                    <span>View Cart</span>
                    <svg className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <button
                    onClick={() => navigate('/')}
                    className="w-full px-6 py-4 text-left font-semibold text-gray-900 bg-white rounded-lg hover:bg-rose-50 hover:shadow-md transition-all border border-rose-100 flex items-center justify-between group"
                  >
                    <span>Continue Shopping</span>
                    <svg className="w-5 h-5 text-rose-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in fade-in zoom-in">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-3">
              Are you sure?
            </h3>
            
            <p className="text-center text-gray-600 mb-8">
              You will be logged out from your account. You'll need to log in again to access your profile.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => setShowLogoutDialog(false)}
                className="flex-1 px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-200"
              >
                Cancel
              </button>
              
              <button
                onClick={confirmLogout}
                className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg hover:shadow-lg transition-all duration-200"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </>
  )
}

export default Profile
