import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

const Orders = () => {
  const navigate = useNavigate()
  const { isAuth, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [error, setError] = useState(null)
  const url = import.meta.env.VITE_BACKEND_URL

  // Fetch orders from backend
  useEffect(() => {
    if (authLoading) return // Wait for auth to initialize
    
    if (!isAuth) {
      navigate('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true)
        const response = await axios.get(`${url}/get-orders`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })
        console.log('Orders fetched:', response.data)

        setOrders(response.data.orders || [])
   
        setError(null)
      } catch (err) {
        console.error('Error fetching orders:', err)
        setError('Failed to fetch orders. Please try again later.')
      } finally {
        setOrdersLoading(false)
      }
    }

    fetchOrders()
  }, [isAuth, url, navigate, authLoading])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImageFromBuffer = (imageData) => {
    if (!imageData) {
      console.warn('No image data provided')
      return null
    }
    
    try {

      
      // If it's already a URL string, return it
      if (typeof imageData === 'string') {
        // Check if it's a base64 string
        if (imageData.startsWith('data:')) {
          return imageData
        }
        // Check if it's a regular URL
        if (imageData.startsWith('http')) {
          return imageData
        }
        // Assume it's base64 without data URL prefix
        return `data:image/jpeg;base64,${imageData}`
      }
      
      // If it's a buffer object with data array
      if (imageData.data && Array.isArray(imageData.data)) {
        console.log('Converting buffer array to blob')
        const buffer = new Uint8Array(imageData.data)
        const blob = new Blob([buffer], { type: imageData.contentType || 'image/jpeg' })
        return URL.createObjectURL(blob)
      }
      
      // If it's already a Uint8Array or Buffer
      if (imageData instanceof Uint8Array || Buffer.isBuffer(imageData)) {
        // console.log('Converting Uint8Array/Buffer to blob')
        const blob = new Blob([imageData], { type: 'image/jpeg' })
        return URL.createObjectURL(blob)
      }
      
      // Check if it's an object that might be a buffer
      if (typeof imageData === 'object' && imageData !== null) {
        // console.log('Object keys:', Object.keys(imageData))
        // Try to convert any object with numeric keys (array-like)
        if (Object.keys(imageData).every(key => !isNaN(key))) {
          const arr = Object.values(imageData)
          const buffer = new Uint8Array(arr)
          const blob = new Blob([buffer], { type: 'image/jpeg' })
          return URL.createObjectURL(blob)
        }
      }
      
      console.warn('Unable to process image data:', imageData)
      return null
    } catch (error) {
      console.error('Error processing image:', error, 'ImageData:', imageData)
      return null
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-700'
      case 'processing':
        return 'bg-blue-100 text-blue-700'
      case 'shipped':
        return 'bg-purple-100 text-purple-700'
      case 'in transit':
        return 'bg-purple-100 text-purple-700'
      case 'cancelled':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (authLoading) {
    return (
      <>
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
          <main className="max-w-7xl mx-auto">
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
  }

  if (!isAuth) {
    return (
      <>
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
          <Navbar />
        </div>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
          <main className="max-w-7xl mx-auto">
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-4">My Orders</h1>
                <p className="text-gray-600 mb-8">Please log in to view your orders</p>
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  Go to Login
                </button>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </>
    )
  }
  const test = () => {
    orders.map((order) => {
      console.log('Order ID:', order._id)
    })
  }

  return (
    <>
      <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
        <main className="max-w-7xl mx-auto">
          <div className="mt-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">My Orders</h1>
              <button
                onClick={() =>{ 
                  // navigate('/')
                  test()
                }}
                className="px-4 py-2 text-sm font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition"
              >
                Continue Shopping
              </button>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-700 font-semibold mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
                >
                  Retry
                </button>
              </div>
            ) : orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-rose-100 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="bg-gradient-to-r from-rose-50 to-amber-50 px-6 py-4 border-b border-rose-100">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm font-semibold uppercase">Order ID</p>
                          <p className="text-gray-900 font-bold text-lg">{order._id?.slice(-8) || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm font-semibold uppercase">Date</p>
                          <p className="text-gray-900 font-semibold">{formatDate(order.createdAt)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm font-semibold uppercase">Status</p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus || 'Pending'}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm font-semibold uppercase">Total</p>
                          <p className="text-rose-600 font-bold text-lg">₹{(order.totalAmount || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="px-6 py-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">Items</h3>
                      <div className="space-y-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((item, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition"
                              onClick={() => navigate(`/product/${item.productId._id}`)}
                            >
                              {/* Product Image - Small on Left */}
                              {item.productId?.image ? (
                                <div className="w-20 h-20 bg-rose-100 rounded-lg overflow-hidden flex-shrink-0">
                                  <img 
                                    src={getImageFromBuffer(item.productId.image)} 
                                    alt={item.productId?.name || 'Product'} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect fill="%23f0f0f0" width="80" height="80"/%3E%3C/svg%3E'
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-20 h-20 bg-rose-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                  <span className="text-gray-400 text-xs">No Image</span>
                                </div>
                              )}
                              
                              {/* Product Details */}
                              <div className="flex-1 ">
                                <p className="text-gray-900 font-semibold">{item.productId?.name || 'Product'}</p>
                                <p className="text-gray-500 text-sm">Order ID: {order._id?.slice(-8) || 'N/A'}</p>
                                <p className="text-gray-500 text-sm">Size: {item.productId?.size || 'Standard'} | Qty: {item.quantity || 1}</p>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <p className="text-rose-600 font-bold">₹{(item.productId?.price || 0).toFixed(2)}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500">No items in this order</p>
                        )}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.address && (
                      <div className="px-6 py-4 border-t border-rose-100 bg-blue-50">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Delivery Address</h3>
                        <div className="bg-white rounded-lg p-4">
                          <p className="text-gray-900 font-semibold">{order.address.fullName}</p>
                          <p className="text-gray-700 text-sm mt-1">{order.address.street}</p>
                          <p className="text-gray-700 text-sm">{order.address.city}, {order.address.state} - {order.address.zipCode}</p>
                          <p className="text-gray-700 text-sm">📞 {order.address.phone}</p>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="px-6 py-4 border-t border-rose-100 bg-amber-50">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-gray-500 text-sm">Subtotal</p>
                          <p className="text-gray-900 font-semibold">₹{((order.totalAmount || 0) / 1.08).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm">Tax (8%)</p>
                          <p className="text-gray-900 font-semibold">₹{(((order.amount || 0) / 1.08) * 0.08).toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-500 text-sm">Total</p>
                          <p className="text-rose-600 font-bold text-lg">₹{(order.totalAmount || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    {order.paymentId && (
                      <div className="px-6 py-3 border-t border-rose-100 text-xs text-gray-500">
                        Payment ID: {order.paymentId}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-100 shadow-md">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
                <p className="text-gray-500 mb-6">Start shopping to place your first order!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}

export default Orders
