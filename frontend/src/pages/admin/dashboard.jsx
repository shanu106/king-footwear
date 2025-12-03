import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'
import Navbar from './Navbar'
import Footer from '../../components/Footer'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)
  const url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${url}/admin/all-users`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }),
          axios.get(`${url}/admin/all-products`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }),
          axios.get(`${url}/admin/all-orders`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            withCredentials: true,
          }),
        ])

        const users = usersRes.data
        const products = productsRes.data
        const orders = ordersRes.data

        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

        setStats({
          totalUsers: users.length || 0,
          totalProducts: products.length || 0,
          totalOrders: orders.length || 0,
          totalRevenue,
        })
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ title, value, icon }) => (
    <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{loading ? '...' : value}</p>
        </div>
        <div className="text-4xl text-rose-400">{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'Admin'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Users" value={stats.totalUsers} icon="👥" />
          <StatCard title="Total Products" value={stats.totalProducts} icon="📦" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon="🛒" />
          <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon="💰" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg">
                <span className="text-gray-700">Avg Order Value</span>
                <span className="font-bold text-rose-500">
                  ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg">
                <span className="text-gray-700">Products in Stock</span>
                <span className="font-bold text-rose-500">{stats.totalProducts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-50 to-amber-50 rounded-lg">
                <span className="text-gray-700">Registered Users</span>
                <span className="font-bold text-rose-500">{stats.totalUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-md border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Navigation</h2>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="/admin/users"
                className="p-4 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg text-center hover:shadow-md transition border border-blue-200"
              >
                <p className="text-2xl">👥</p>
                <p className="text-sm font-semibold text-blue-900 mt-2">Manage Users</p>
              </a>
              <a
                href="/admin/products"
                className="p-4 bg-gradient-to-br from-green-100 to-green-50 rounded-lg text-center hover:shadow-md transition border border-green-200"
              >
                <p className="text-2xl">📦</p>
                <p className="text-sm font-semibold text-green-900 mt-2">Manage Products</p>
              </a>
              <a
                href="/admin/orders"
                className="p-4 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg text-center hover:shadow-md transition border border-purple-200"
              >
                <p className="text-2xl">🛒</p>
                <p className="text-sm font-semibold text-purple-900 mt-2">View Orders</p>
              </a>
              <a
                href="/"
                className="p-4 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg text-center hover:shadow-md transition border border-rose-200"
              >
                <p className="text-2xl">🏪</p>
                <p className="text-sm font-semibold text-rose-900 mt-2">Store</p>
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Dashboard
