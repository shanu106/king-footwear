# Context API Setup - AuthContext Usage Guide

## Overview
A complete Context API implementation for managing authentication and cart data globally across your React application with localStorage persistence.

## Files Created/Modified

### New File: `src/context/AuthContext.jsx`
The central context provider that manages:
- User authentication state
- User information (email, name, id, timestamp)
- Shopping cart items
- All cart operations

## How It Works

### 1. AuthProvider Setup (in App.jsx)
```jsx
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* All your routes */}
      </Routes>
    </AuthProvider>
  )
}
```

### 2. Using the Context in Components

#### Import the hook
```jsx
import { useAuth } from '../context/AuthContext'
```

#### Use in your component
```jsx
const MyComponent = () => {
  const { 
    user,           // Current logged-in user object
    isAuth,         // Boolean: is user authenticated
    cartItems,      // Array of cart items
    loading,        // Boolean: initial loading state
    login,          // Function to login user
    logout,         // Function to logout user
    addToCart,      // Function to add product to cart
    removeFromCart, // Function to remove product from cart
    updateCartItemQuantity, // Function to update quantity
    clearCart,      // Function to clear entire cart
    getCartTotal,   // Function to get total price
    getCartCount    // Function to get total items count
  } = useAuth()

  return (
    // Use the values in your component
  )
}
```

## Available Methods

### Authentication Methods

**login(userData)**
- Accepts: `{ email, name, id }`
- Stores user in state and localStorage
- Sets `isAuth` to true
```jsx
login({ email: 'user@example.com', name: 'John' })
```

**logout()**
- Clears user and cart data
- Sets `isAuth` to false
- Clears localStorage
```jsx
logout()
```

### Cart Methods

**addToCart(product)**
- Accepts: `{ id, name, price, image, quantity }`
- Adds or increases quantity of existing item
```jsx
addToCart({ 
  id: 1, 
  name: 'Sandal', 
  price: 999, 
  quantity: 1 
})
```

**removeFromCart(productId)**
- Removes specific product from cart
```jsx
removeFromCart(productId)
```

**updateCartItemQuantity(productId, quantity)**
- Updates quantity of a cart item
- Removes item if quantity ≤ 0
```jsx
updateCartItemQuantity(productId, 5)
```

**clearCart()**
- Removes all items from cart
```jsx
clearCart()
```

**getCartTotal()**
- Returns total price (formatted to 2 decimal places)
```jsx
const total = getCartTotal() // Returns "1500.00"
```

**getCartCount()**
- Returns total number of items
```jsx
const count = getCartCount() // Returns 5
```

## Data Structure

### User Object
```jsx
{
  email: "user@example.com",
  name: "John",
  id: null,
  timestamp: "2024-12-01T10:30:00.000Z"
}
```

### Cart Item Object
```jsx
{
  id: 1,
  name: "Comfy Sandal",
  price: 999,
  image: "url or base64",
  description: "Description",
  quantity: 2
}
```

## LocalStorage Data
The app automatically persists to localStorage:
- `user` - JSON stringified user object
- `cartItems` - JSON stringified cart array
- `token` - Authentication token

## Auto-Sync Features
- Cart syncs to localStorage whenever it changes
- User data syncs to localStorage on login
- Everything loads from localStorage on app start
- No page refresh needed for state updates

## Navbar Features
- Cart count badge shows number of items
- Auth buttons show/hide based on login status
- Profile and cart icons only visible when logged in

## Updated Components
1. ✅ App.jsx - Wrapped with AuthProvider
2. ✅ Navbar.jsx - Uses context for auth state and cart count
3. ✅ Profile.jsx - Uses context for user info and logout
4. ✅ Cart.jsx - Uses context for cart management
5. ✅ Login.jsx - Uses context to login user
6. ✅ Signup.jsx - Uses context to register user

## Example Usage in Product Page

```jsx
import { useAuth } from '../context/AuthContext'

const ProductPage = () => {
  const { isAuth, addToCart } = useAuth()

  const handleAddToCart = (product) => {
    if (!isAuth) {
      navigate('/login')
      return
    }
    addToCart(product)
    // Show success toast
  }

  return (
    <button onClick={() => handleAddToCart(product)}>
      Add to Cart
    </button>
  )
}
```

## Key Benefits
✅ Global state management without Redux
✅ Automatic localStorage persistence
✅ Clean component code
✅ No prop drilling
✅ Real-time cart updates
✅ Easy to add more features (orders, wishlist, etc.)
