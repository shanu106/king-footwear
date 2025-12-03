import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import axios from 'axios'

// Configure axios to send cookies automatically
axios.defaults.withCredentials = true

const Cart = () => {
  const navigate = useNavigate()
  const { isAuth, cartItems, removeFromCart, updateCartItemQuantity, getCartTotal, clearCart } = useAuth()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [userAddresses, setUserAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [formMode, setFormMode] = useState('new') // 'new', 'edit', or 'select'
  const [editingAddressId, setEditingAddressId] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [notification, setNotification] = useState(null) // {type: 'error'|'success', message: string}
  const [invalidPincode, setInvalidPincode] = useState(false) // Track invalid pincode
  const url = import.meta.env.VITE_BACKEND_URL
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    isDefault: false
  })

  // Auto-hide notification after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
    return () => {
      document.body.removeChild(script)
    }
  }, [])

  // Load user addresses from backend
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${url}/get-address`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })
        console.log('Addresses fetched:', response)
        if (response.data.addresses && response.data.addresses.length > 0) {
          setUserAddresses(response.data.addresses)
          // Set first address as default selected
          setSelectedAddressId(response.data.addresses[0]._id)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      }
    }
    
    if (isAuth) {
      fetchAddresses()
    }
  }, [isAuth, url])

  // Load saved address from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedAddress')
    if (saved) {
      try {
        setSavedAddress(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading saved address:', error)
      }
    }
  }, [])

  const handleCheckout = () => {
    if (userAddresses.length > 0) {
      setFormMode('select')
      setShowCheckoutModal(true)
    } else {
      setFormMode('new')
      setShowAddressForm(true)
      setShowCheckoutModal(true)
    }
  }

  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressForm({
      ...addressForm,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Clear invalid pincode flag when user edits the pincode field
    if (name === 'zipCode' && invalidPincode) {
      setInvalidPincode(false)
    }
  }

  const handleSaveAddress = async() => {
    if (!addressForm.fullName || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipCode) {
      setNotification({ type: 'error', message: '⚠️ Please fill all fields' })
      return
    }
    
    try {
      setIsProcessing(true)
      
      // Check if pincode is serviceable
      console.log('Checking pincode:', addressForm.zipCode)
      const isServiceable = await checkPincode(addressForm.zipCode)
      
      if (!isServiceable) {
        setInvalidPincode(true)
        setNotification({ type: 'error', message: `❌ Pincode ${addressForm.zipCode} is not serviceable. Please enter a valid pincode.` })
        setIsProcessing(false)
        return
      }
      
      if (formMode === 'edit') {
        // Update existing address
        console.log('Updating address:', editingAddressId)
        const response = await axios.post(`${url}/edit-address/${editingAddressId}`, addressForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })
        console.log('Address updated:', response.data)
        
        // Update local state
        setUserAddresses(userAddresses.map(addr => 
          addr._id === editingAddressId ? response.data.address : addr
        ))
        setNotification({ type: 'success', message: '✅ Address updated successfully!' })
      } else {
        // Create new address
        console.log('Creating new address')
        const response = await axios.post(`${url}/add-address`, addressForm, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        })
        console.log('Address created:', response.data)
        
        // Add new address to list
        setUserAddresses([...userAddresses, response.data.address])
        setSelectedAddressId(response.data.address._id)
        setNotification({ type: 'success', message: '✅ Address added successfully!' })
      }
      
      setShowAddressForm(false)
      setEditingAddressId(null)
      setAddressForm({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        isDefault: false
      })
      
      // Initiate payment after address is saved
      initiatePayment()
    } catch (error) {
      console.error('Error saving address:', error)
      setNotification({ type: 'error', message: 'Error saving address: ' + (error.response?.data?.message || error.message) })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleUseExistingAddress = () => {
    // Initiate payment with selected address
    console.log('Using address:', selectedAddressId)
    initiatePayment()
  }
  // check pincode is servicable or not 
  const checkPincode = async(pincode) => {
    try {
      console.log('Checking pincode:', pincode)
      
      // Call your backend API instead of Delhivery directly
      const response = await axios.post(`${url}/delivery/check-pincode`, 
        { pincode },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          withCredentials: true
        }
      )
      
      console.log("Pincode check response:", response.data)
      const isServiceable = response.data.isServiceable || false
      return isServiceable
    } catch (error) {
      console.error("Error checking pincode:", error.response?.status, error.response?.data || error.message)
      setNotification({ type: 'error', message: 'Error checking pincode. Please try again.' })
      return false
    }
  }


  const handleEditAddress = (address) => {
    setAddressForm({
      fullName: address.fullName,
      phone: address.phone,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      isDefault: address.isDefault
    })
    setEditingAddressId(address._id)
    setFormMode('edit')
    setShowAddressForm(true)
  }

  const handleUseNewAddress = async() => {
    setAddressForm({
      fullName: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India',
      isDefault: false
    })
   
    setFormMode('new')
    setShowAddressForm(true)
  }

  const handleDeleteAddress = async(addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      await axios.post(`${url}/delete-address/${addressId}`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        withCredentials: true
      })
      
      // Remove from local state
      setUserAddresses(userAddresses.filter(addr => addr._id !== addressId))
      
      // Clear selection if deleted address was selected
      if (selectedAddressId === addressId) {
        setSelectedAddressId(null)
      }
      
      alert('Address deleted successfully!')
    } catch (error) {
      console.error('Error deleting address:', error)
      alert('Error deleting address: ' + (error.response?.data?.message || error.message))
    }
  }

  // Create payment order
  const createPaymentOrder = async (amount, addressId) => {
    try {
      console.log('Creating order for amount:', amount)
      const selectedAddress = userAddresses.find(addr => addr._id === addressId)
      const response = await fetch(`${url}/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: Math.round(amount), // Convert to paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            cartItems: cartItems.length,
            addressId: addressId,
            address: JSON.stringify(selectedAddress)
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const order = await response.json()
      console.log('Order created:', order)
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      alert('Failed to create payment order. Please try again.')
      return null
    }
  }

  // Verify payment
  const verifyPayment = async (paymentData) => {
    try {
      console.log('Verifying payment:', paymentData)
      const response = await fetch(`${url}/payment/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(paymentData)
      })

      const result = await response.json()
      console.log('Verification result:', result)
      return result
    } catch (error) {
      console.error('Error verifying payment:', error)
      return { status: 'error' }
    }
  }

  // Open Razorpay checkout
  const initiatePayment = async () => {
    setIsProcessing(true)

    try {
      const selectedAddress = userAddresses.find(addr => addr._id === selectedAddressId)
      if (!selectedAddress) {
        // alert('Please select a delivery address')
        setIsProcessing(false)
        return
      }

      const totalAmount = parseFloat(getCartTotal())  // Including tax
      
      // Step 1: Create order
      const order = await createPaymentOrder(totalAmount, selectedAddressId)
      if (!order) {
        setIsProcessing(false)
        return
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: 'rzp_test_Rm4VMEYCeVcqYF', // Replace with your actual Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'King Footwear',
        description: `Order - ${cartItems.length} items`,
        order_id: order.id,
        prefill: {
          name: selectedAddress?.fullName || '',
          email: localStorage.getItem('userEmail') || '',
          contact: selectedAddress?.phone || ''
        },
        theme: {
          color: '#f97316'
        },
        handler: async (response) => {
          // Step 3: Verify payment on backend
          const verificationData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            address: selectedAddress,
            cartItems: cartItems,
            amount: totalAmount
          }

          const verifyResult = await verifyPayment(verificationData)

          if (verifyResult.status === 'ok' || verifyResult.verified) {
            // Payment successful
            console.log('Payment successful!')
            // api call to create order
            try {
              // Prepare items with individual size-quantity pairs
              // Group items by product and send each size-quantity combination separately
              const orderItems = cartItems.map(item => ({
                productId: item.id,
                size: item.size, // Individual size for this cart entry
                quantity: item.quantity // Quantity for this specific size
              }))
              console.log('Order items to be sent:', orderItems)
              
              const orderPayload = {
                address: selectedAddress,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: orderItems, // Each item entry is a separate size-quantity pair
                totalAmount,
                paymentStatus: 'completed'
              }
              
              console.log('Creating order with items:', orderItems)
              
              const order = await axios.post(`${url}/create-order`, orderPayload, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                withCredentials: true,
              })
              
              console.log('Order created successfully:', order.data)
              clearCart()
              setShowCheckoutModal(false)
              navigate(`/orders`)
            } catch (error) {
              console.error('Error creating order record:', error)
             
            }
          } else {
            alert('Payment verification failed. Please contact support.')
          }
          setIsProcessing(false)
        },
        modal: {
          ondismiss: () => {
            console.log('Payment modal dismissed')
            setIsProcessing(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', (response) => {
        console.error('Payment failed:', response)
        alert(`Payment failed: ${response.error.description}`)
        setIsProcessing(false)
      })

      rzp.open()
    } catch (error) {
      console.error('Error initiating payment:', error)
      alert('Error initiating payment. Please try again.')
      setIsProcessing(false)
    }
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
                <h1 className="text-3xl font-bold mb-4">Shopping Cart</h1>
                <p className="text-gray-600 mb-8">Please log in to view your cart</p>
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
      {/* Notification */}
      {notification && (
        <div className={`fixed top-0 left-0 right-0 z-[999] px-6 py-4 text-white font-semibold transition-all duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-500 shadow-lg' 
            : 'bg-green-500 shadow-lg'
        }`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)}
              className="text-xl font-bold hover:scale-110 transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 px-7 pb-7">
        <main className="max-w-7xl mx-auto">
          <div className="mt-8">
            <h1 className="text-4xl font-bold mb-8 text-gray-900">Shopping Cart</h1>

            {cartItems.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="bg-white rounded-2xl shadow-md p-6 border border-rose-100 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No image</div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{item.name || 'Product'}</h3>
                          <p className="text-gray-500 text-sm mt-1">{item.description || 'Quality footwear'}</p>
                          {item.size && (
                            <p className="text-sm font-semibold text-rose-600 mt-2">
                              📏 Size: {item.size}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-rose-600 mt-2">₹{(item.price || 0).toFixed(2)}</p>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                          >
                            ✕ Remove
                          </button>
                          
                          <div className="flex items-center gap-2 bg-rose-50 rounded-lg px-3 py-2">
                            <button
                              onClick={() => updateCartItemQuantity(item.id, (item.quantity || 1) - 1, item.size)}
                              className="text-gray-600 hover:text-gray-900 font-bold"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-semibold text-gray-900">
                              {item.quantity || 1}
                            </span>
                            <button
                              onClick={() => updateCartItemQuantity(item.id, (item.quantity || 1) + 1, item.size)}
                              className="text-gray-600 hover:text-gray-900 font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-gradient-to-br from-rose-50 to-amber-50 rounded-2xl shadow-lg p-6 border border-rose-100 sticky top-20">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span className="font-semibold">₹{getCartTotal()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span className="font-semibold text-green-600">Free</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span className="font-semibold">₹{(getCartTotal() * 0.08).toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-rose-200 pt-4 mb-6">
                      <div className="flex justify-between">
                        <span className="text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-rose-600">₹{(parseFloat(getCartTotal()) * 1.08).toFixed(2)}</span>
                      </div>
                    </div>

                    <button 
                      onClick={handleCheckout}
                      className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 mb-3">
                      Proceed to Checkout
                    </button>

                    <button
                      onClick={() => navigate('/')}
                      className="w-full px-6 py-3 text-base font-semibold text-gray-900 bg-white rounded-lg border border-rose-200 hover:bg-rose-50 transition-all"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-rose-100 shadow-md">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Add some beautiful sandals to get started!</p>
                <button
                  onClick={() => navigate('/')}
                  className="px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto p-8 border border-white/20">
            {formMode === 'select' && !showAddressForm && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Delivery Address</h3>
                
                {/* Saved Addresses List */}
                <div className="space-y-4 mb-6">
                  {userAddresses.length > 0 ? (
                    userAddresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`bg-gradient-to-br rounded-xl p-5 border-2 cursor-pointer transition ${
                          selectedAddressId === address._id
                            ? 'from-rose-100 to-amber-100 border-rose-400 shadow-md'
                            : 'from-gray-50 to-gray-100 border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <input
                            type="radio"
                            checked={selectedAddressId === address._id}
                            onChange={() => setSelectedAddressId(address._id)}
                            className="w-5 h-5 mt-1 cursor-pointer"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg font-bold text-gray-900">
                                {address.fullName}
                              </h4>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 text-sm mb-1">
                              {address.street}, {address.city}
                            </p>
                            <p className="text-gray-700 text-sm mb-1">
                              {address.state} - {address.zipCode}
                            </p>
                            <p className="text-gray-700 text-sm">
                              📞 {address.phone}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditAddress(address)
                              }}
                              disabled={isProcessing}
                              className="px-3 py-2 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteAddress(address._id)
                              }}
                              disabled={isProcessing}
                              className="px-3 py-2 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No addresses saved yet</p>
                  )}
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="text-gray-500 text-sm font-semibold">OR</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleUseExistingAddress}
                    disabled={!selectedAddressId || isProcessing}
                    className="w-full px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Continue with Selected Address'}
                  </button>
                  
                  <button
                    onClick={handleUseNewAddress}
                    className="w-full px-6 py-3 text-base font-semibold text-rose-600 bg-white border-2 border-rose-300 rounded-lg hover:bg-rose-50 transition"
                  >
                    + Add New Address
                  </button>

                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="w-full px-6 py-3 text-base font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showAddressForm && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {formMode === 'edit' ? 'Edit Address' : 'Add New Address'}
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={addressForm.phone}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={addressForm.street}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={addressForm.state}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Zip Code"
                        value={addressForm.zipCode}
                        onChange={handleAddressChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition ${
                          invalidPincode
                            ? 'border-red-500 bg-red-50 text-red-600 focus:border-red-600'
                            : 'border-gray-200 focus:border-rose-400'
                        }`}
                      />
                      {invalidPincode && (
                        <p className="text-red-600 text-xs mt-1 font-semibold">Invalid pincode</p>
                      )}
                    </div>
                    <select
                      name="country"
                      value={addressForm.country}
                      onChange={handleAddressChange}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-400"
                    >
                      <option>India</option>
                      <option>USA</option>
                      <option>UK</option>
                      <option>Canada</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressChange}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">Set as default address</span>
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveAddress}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-400 rounded-lg shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing Payment...' : (formMode === 'edit' ? 'Update & Place Order' : 'Save & Place Order')}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddressForm(false)
                      if (formMode === 'new') {
                        setShowCheckoutModal(false)
                      }
                    }}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 text-base font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default Cart

