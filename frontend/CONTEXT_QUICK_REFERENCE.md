# Context API Quick Reference

## Setup Summary

### ✅ Context Created
- `src/context/AuthContext.jsx` - Global auth & cart management

### ✅ App Wrapped
- `src/App.jsx` - Wrapped with `<AuthProvider>`

### ✅ Components Updated to Use Context
1. `Navbar.jsx` - Shows auth state & cart count
2. `Profile.jsx` - Displays user info & logout
3. `Cart.jsx` - Manages cart items
4. `Login.jsx` - Sets user on login
5. `Signup.jsx` - Sets user on signup
6. `Home.jsx` - Add to cart functionality

---

## Quick Copy-Paste Integration

### In any new component:

```jsx
import { useAuth } from '../context/AuthContext'

export default YourComponent = () => {
  const { 
    user, 
    isAuth, 
    cartItems, 
    addToCart, 
    removeFromCart 
  } = useAuth()

  return (
    // Use the values
  )
}
```

---

## All Available Context Values

```jsx
const {
  // State
  user,                      // { email, name, id, timestamp }
  isAuth,                    // boolean
  cartItems,                 // array
  loading,                   // boolean
  
  // Auth Methods
  login,                     // (userData) => void
  logout,                    // () => void
  
  // Cart Methods
  addToCart,                 // (product) => void
  removeFromCart,            // (productId) => void
  updateCartItemQuantity,    // (productId, quantity) => void
  clearCart,                 // () => void
  getCartTotal,              // () => string (e.g., "1500.00")
  getCartCount,              // () => number
} = useAuth()
```

---

## LocalStorage Keys Saved

| Key | Value | Type |
|-----|-------|------|
| `user` | JSON user object | string |
| `cartItems` | JSON cart array | string |
| `token` | JWT token | string |

---

## Common Patterns

### Check if User is Logged In
```jsx
if (!isAuth) {
  navigate('/login')
  return
}
```

### Display Cart Count in Badge
```jsx
<span className="badge">{getCartCount()}</span>
```

### Add Product with Toast
```jsx
addToCart(product)
showToast('Added to cart!')
```

### Logout User
```jsx
logout()
navigate('/')
```

### Update Cart Quantity
```jsx
updateCartItemQuantity(productId, 5)
```

---

## Data Persistence

✅ Auto-saves to localStorage:
- User info on login/signup
- Cart items on add/update/remove
- Token from backend

✅ Auto-loads from localStorage:
- On app initialization
- On every page refresh
- Persists across browser sessions

---

## Browser DevTools Check

View in Browser Console:
```javascript
// Check stored data
localStorage.getItem('user')
localStorage.getItem('cartItems')
localStorage.getItem('token')
```

---

## No More Needed

❌ Cookie management (moved to localStorage)
❌ Page refreshes for state updates
❌ Prop drilling for auth state
❌ Manual localStorage sync

---

## Ready to Use Features

✅ User authentication
✅ Shopping cart
✅ Cart badge
✅ Profile page
✅ Logout
✅ Login/Signup
✅ Add to cart
✅ Cart quantity control
✅ Cart totals
✅ Data persistence

---

## Next Steps (Optional Enhancements)

Add to context when ready:
- Wishlist functionality
- Order history
- User preferences
- Search history
- Filters & sorting state
