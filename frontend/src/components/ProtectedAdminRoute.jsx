import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import NotFound from '../pages/notfound'

const ProtectedAdminRoute = ({ children }) => {
  const { isAuth, loading: authLoading, user } = useAuth()
  
  // Wait for auth to load
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // User is not authenticated at all
  if (!isAuth) {
    return <NotFound />
  }

  // User is authenticated but not an admin
  if (user && user.isAdmin !== true) {
    return <NotFound />
  }

  return children
}

export default ProtectedAdminRoute
