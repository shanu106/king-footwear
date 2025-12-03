import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Product from './pages/Product'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import Dashboard from './pages/admin/dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/orders' element={<Orders/>}/>
        <Route path='/product/:id' element={<Product/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/admin/dashboard' element={<ProtectedAdminRoute><Dashboard/></ProtectedAdminRoute>}/>
        <Route path='/admin/products' element={<ProtectedAdminRoute><AdminProducts/></ProtectedAdminRoute>}/>
        <Route path='/admin/orders' element={<ProtectedAdminRoute><AdminOrders/></ProtectedAdminRoute>}/>
        <Route path='/admin/users' element={<ProtectedAdminRoute><AdminUsers/></ProtectedAdminRoute>}/>
      </Routes>
    </AuthProvider>
  )
}

export default App
