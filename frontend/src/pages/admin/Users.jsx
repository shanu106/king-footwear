import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from '../../components/Footer'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/all-users`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        })
        setUsers(response.data || [])
      } catch (err) {
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobile?.includes(searchTerm)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manage Users</h1>
        <p className="text-gray-600 mb-6">Total Users: {users.length}</p>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-rose-100 to-amber-100 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Mobile</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Orders</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-900">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, idx) => (
                      <tr key={user._id || idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{user.fullname}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{user.email}</td>
                        <td className="px-6 py-4 text-gray-700">{user.mobile || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold">
                            {user.orders?.length || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Users
