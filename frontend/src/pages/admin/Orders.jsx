import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from '../../components/Footer'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [updateModal, setUpdateModal] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const url = window.RUNTIME_CONFIG.VITE_BACKEND_URL;
  // const url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/admin/all-orders`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })
      setOrders(response.data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'created':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      case 'in transit':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300'
      case 'delivered':
        return 'bg-emerald-100 text-emerald-700 border-emerald-300'
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const statusOptions = ['created', 'shipped', 'in transit', 'delivered', 'cancelled']

  const getStatusButtonColor = (status) => {
    switch (status) {
      case 'created':
        return 'hover:bg-blue-200'
      case 'shipped':
        return 'hover:bg-purple-200'
      case 'in transit':
        return 'hover:bg-indigo-200'
      case 'delivered':
        return 'hover:bg-emerald-200'
      case 'cancelled':
        return 'hover:bg-red-200'
      default:
        return 'hover:bg-gray-200'
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedStatus || !updateModal) return
    
    setUpdating(true)
    try {
      await axios.post(`${url}/admin/update-order/`, 
        {orderId:updateModal._id, status: selectedStatus },
        {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        }
      )
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === updateModal._id 
          ? { ...order, paymentStatus: selectedStatus }
          : order
      ))
      
      setUpdateModal(null)
      setSelectedStatus('')
    } catch (err) {
      console.error('Error updating order:', err)
      alert('Failed to update order')
    } finally {
      setUpdating(false)
    }
  }

  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.orderStatus === filterStatus
  )

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manage Orders</h1>
        <p className="text-gray-600 mb-6">Total Orders: {orders.length} | Revenue: ₹{totalRevenue.toLocaleString()}</p>

        <div className="mb-6 flex flex-wrap gap-3">
          {['all', 'created', 'shipped', 'in transit', 'delivered', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filterStatus === status
                  ? 'bg-gradient-to-r from-rose-400 to-rose-300 text-white'
                  : 'bg-white/80 text-gray-700 border border-gray-200 hover:shadow-md'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <div key={order._id} className="bg-white/80 backdrop-blur rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Order ID</p>
                      <p className="text-sm font-bold text-gray-900 mt-1 truncate">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Customer</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">{order.customerId?.fullname}</p>
                      <p className="text-xs text-gray-600">{order.customerId?.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Amount</p>
                      <p className="text-lg font-bold text-rose-500 mt-1">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusColor(order.paymentStatus)}`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Date</p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-bold text-gray-900 mb-3">Items ({order.items?.length || 0})</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{item.productId?.name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex flex-col gap-1">
                              <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                              {item.size && (
                                <p className="text-xs font-semibold text-rose-600">Size: {item.size}</p>
                              )}
                            </div>
                            <p className="text-sm font-bold text-rose-500">₹{item.productId?.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="border-t border-gray-200 pt-4 mb-4">
                    <p className="text-sm font-bold text-gray-900 mb-2">Delivery Address</p>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                      {order.address ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{order.address.fullName}</p>
                              <p className="text-xs text-gray-600 mt-1">📞 {order.address.phone}</p>
                            </div>
                            {order.address.isDefault && (
                              <span className="px-2 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">Default</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-800 mt-3 space-y-1">
                            <p>{order.address.street}</p>
                            <p>{order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                            <p className="text-xs text-gray-600">{order.address.country}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 italic">No address provided</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex gap-2">
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition text-sm">
                      View Details
                    </button>
                    <button
                      onClick={() => {
                        setUpdateModal(order)
                        setSelectedStatus(order.orderStatus)
                      }}
                      className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition text-sm"
                    >
                      Update Status
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No orders found</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />

      {/* Status Update Modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Order Status</h2>
            <p className="text-sm text-gray-600 mb-6">Order ID: {updateModal._id?.slice(-8)}</p>

            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Select New Status</p>
              <div className="grid grid-cols-1 gap-2">
                {statusOptions.map(status => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-3 rounded-lg font-semibold transition text-sm border-2 ${
                      selectedStatus === status
                        ? `${getStatusColor(status)} border-current font-bold scale-105`
                        : `${getStatusColor(status)} border-transparent opacity-70 hover:opacity-100 ${getStatusButtonColor(status)}`
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-600 mb-6 p-3 bg-amber-50 rounded-lg border border-amber-200">
              Current Status: <span className="font-semibold capitalize">{updateModal.paymentStatus}</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setUpdateModal(null)
                  setSelectedStatus('')
                }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                disabled={updating}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!selectedStatus || updating || selectedStatus === updateModal.paymentStatus}
                className={`flex-1 px-4 py-3 rounded-lg font-semibold transition text-white disabled:opacity-50 disabled:cursor-not-allowed ${
                  updating
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rose-400 to-rose-500 hover:shadow-lg hover:scale-105'
                }`}
              >
                {updating ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders
