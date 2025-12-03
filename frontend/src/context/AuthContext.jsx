import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuth, setIsAuth] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Initialize from localStorage on mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Load user data from localStorage
        const savedUser = localStorage.getItem('user')
        const isAdminFlag = localStorage.getItem('isAdmin')
        
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser)
            // Ensure isAdmin is set correctly based on localStorage flag
            parsedUser.isAdmin = isAdminFlag === 'true' ? true : false
            setUser(parsedUser)
            setIsAuth(true)
          } catch (parseError) {
            console.error('Error parsing user from localStorage:', parseError)
            localStorage.removeItem('user')
            localStorage.removeItem('isAdmin')
          }
        }

        // Load cart items from localStorage
        const savedCart = localStorage.getItem('cartItems')
        if (savedCart) {
          try {
            setCartItems(JSON.parse(savedCart))
          } catch (parseError) {
            console.error('Error parsing cart from localStorage:', parseError)
            localStorage.removeItem('cartItems')
          }
        }
      } catch (error) {
        console.error('Error loading data from localStorage:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }
  }, [cartItems, loading])

  const login = (userData) => {
    const userInfo = {
      id: userData.id || null,
      email: userData.email || userData,
      name: userData.name || userData.fullname || userData.email?.split('@')[0],
      fullname: userData.fullname || userData.name,
      mobile: userData.mobile || null,
      orders: userData.orders || [],
      isAdmin: userData.isAdmin || false,
      timestamp: new Date().toISOString(),
    }
    setUser(userInfo)
    setIsAuth(true)
    localStorage.setItem('user', JSON.stringify(userInfo))
  }

  const logout = () => {
    setUser(null)
    setIsAuth(false)
    setCartItems([])
    localStorage.removeItem('user')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('token')
    localStorage.removeItem('isAdmin')
  }

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      // Check if item with same ID and SIZE already exists
      const existingItem = prevItems.find((item) => item.id === product.id && item.size === product.size)
      if (existingItem) {
        // If same product + size exists, increase quantity
        return prevItems.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, quantity: (item.quantity || 1) + (product.quantity || 1) }
            : item
        )
      }
      // If different size of same product, add as separate item
      return [...prevItems, { ...product, quantity: product.quantity || 1 }]
    })
  }

  const removeFromCart = (productId, size) => {
    setCartItems((prevItems) => prevItems.filter((item) => !(item.id === productId && item.size === size)))
  }

  const updateCartItemQuantity = (productId, quantity, size) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
    } else {
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === productId && item.size === size ? { ...item, quantity } : item
        )
      )
    }
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0)
      .toFixed(2)
  }

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0)
  }

  const value = {
    user,
    isAuth,
    cartItems,
    loading,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
