import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from './Navbar'
import Footer from '../../components/Footer'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [editModal, setEditModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [createModal, setCreateModal] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [creating, setCreating] = useState(false)
  const [createForm, setCreateForm] = useState({
    name: '',
    price: '',
    discount: '',
    available: true,
    sizes: [7, 8, 9, 10],
    quantities: [0, 0, 0, 0]
  })
  const url = import.meta.env.VITE_BACKEND_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/admin/all-products`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true,
        })
        setProducts(response.data || [])
      } catch (err) {
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const getImageFromBuffer = (imageData) => {
    if (!imageData) return null
    if (typeof imageData === 'string') return imageData
    if (imageData.data && Array.isArray(imageData.data)) {
      const bytes = new Uint8Array(imageData.data)
      const blob = new Blob([bytes], { type: 'image/webp' })
      return URL.createObjectURL(blob)
    }
    return null
  }

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleEditProduct = (product) => {
    setEditModal(product)
    setEditForm({
      id: product._id,
      name: product.name,
      price: product.price,
      discount: product.discount,
      size: product.size,
      available: product.available,
      quantity: product.quantity
    })
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleSaveProduct = async () => {
    if (!editForm.name || !editForm.price) {
      alert('Please fill required fields')
      return
    }

    setUpdating(true)
    try {
      const response = await axios.post(`${url}/product/edit`, editForm, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })

      // Update local state
      setProducts(products.map(p => p._id === editForm.id ? response.data : p))
      setEditModal(null)
      alert('Product updated successfully!')
    } catch (err) {
      console.error('Error updating product:', err)
      alert('Error updating product: ' + (err.response?.data?.message || err.message))
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    setDeleting(true)
    try {
      await axios.get(`${url}/product/delete/${productId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true,
      })

      // Remove from local state
      setProducts(products.filter(p => p._id !== productId))
      alert('Product deleted successfully!')
    } catch (err) {
      console.error('Error deleting product:', err)
      alert('Error deleting product: ' + (err.response?.data?.message || err.message))
    } finally {
      setDeleting(false)
    }
  }

  const handleCreateFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setCreateForm({
      ...createForm,
      [name]: type === 'checkbox' ? checked : value
    })
  }

  const handleQuantityChange = (index, value) => {
    const newQuantities = [...createForm.quantities]
    newQuantities[index] = parseInt(value) || 0
    setCreateForm({
      ...createForm,
      quantities: newQuantities
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProduct = async () => {
    if (!createForm.name || !createForm.price) {
      alert('Please fill required fields')
      return
    }

    setCreating(true)
    try {
      const formData = new FormData()
      formData.append('name', createForm.name)
      formData.append('price', createForm.price)
      formData.append('discount', createForm.discount || 0)
      formData.append('available', createForm.available)
      
      // Append each size individually
      createForm.sizes.forEach((size, index) => {
        formData.append(`size[${index}]`, size)
      })
      
      // Append each quantity individually
      createForm.quantities.forEach((qty, index) => {
        formData.append(`quantity[${index}]`, qty)
      })
      
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const response = await axios.post(`${url}/product/create`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        },
        withCredentials: true,
      })

      // Add new product to state
      setProducts([...products, response.data])
      setCreateModal(false)
      setImageFile(null)
      setImagePreview(null)
      setCreateForm({
        name: '',
        price: '',
        discount: '',
        available: true,
        sizes: [7, 8, 9, 10],
        quantities: [0, 0, 0, 0]
      })
      alert('Product created successfully!')
    } catch (err) {
      console.error('Error creating product:', err)
      alert('Error creating product: ' + (err.response?.data?.message || err.message))
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Manage Products</h1>
        <p className="text-gray-600 mb-6">Total Products: {products.length}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-rose-400 to-rose-300 text-white rounded-lg font-semibold hover:shadow-md transition"
          >
            + Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <div key={product._id} className="bg-white/80 backdrop-blur rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition">
                  {getImageFromBuffer(product.image) && (
                    <img
                      src={getImageFromBuffer(product.image)}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-600 capitalize mt-1">{product.category}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
                        {product.discount > 0 && (
                          <p className="text-sm text-green-600 font-semibold">{product.discount}% off</p>
                        )}
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Sizes & Stock</p>
                        <div className="space-y-1">
                          {product.size && product.size.map((size, idx) => (
                            <p key={idx} className="text-xs text-gray-700">
                              <span className="font-bold text-rose-500">{size}</span>
                              <span className="text-gray-500 mx-1">×</span>
                              <span className="font-semibold">{product.quantity?.[idx] || 0}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition text-sm disabled:opacity-50"
                        disabled={deleting}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product._id)}
                        className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition text-sm disabled:opacity-50"
                        disabled={deleting}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />

      {/* Edit Product Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h2>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={editForm.name || ''}
                  onChange={handleFormChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={editForm.price || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Discount %</label>
                  <input
                    type="number"
                    name="discount"
                    value={editForm.discount || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Size</label>
                  <input
                    type="text"
                    name="size"
                    value={editForm.size || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={editForm.quantity || ''}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={editForm.available || false}
                  onChange={handleFormChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700">Available</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSaveProduct}
                disabled={updating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={() => setEditModal(null)}
                disabled={updating}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Product Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-in my-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Product</h2>

            <div className="space-y-4 mb-6">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Image</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-rose-400 transition cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg mx-auto" />
                  ) : (
                    <div className="text-gray-500">
                      <p className="text-lg font-semibold">📸 Upload Image</p>
                      <p className="text-xs mt-1">Click or drag image here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateFormChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                />
              </div>

              {/* Price and Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={createForm.price}
                    onChange={handleCreateFormChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Discount %</label>
                  <input
                    type="number"
                    name="discount"
                    value={createForm.discount}
                    onChange={handleCreateFormChange}
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              {/* Available Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="available"
                  checked={createForm.available}
                  onChange={handleCreateFormChange}
                  className="w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-semibold text-gray-700">Available</span>
              </label>

              {/* Size and Quantity */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Sizes & Quantities</label>
                <div className="grid grid-cols-2 gap-3">
                  {createForm.sizes.map((size, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <p className="text-xs text-gray-600 font-semibold mb-2">Size {size}</p>
                      <input
                        type="number"
                        value={createForm.quantities[index]}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        placeholder="Qty"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 text-center"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCreateProduct}
                disabled={creating}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creating ? 'Creating...' : 'Create Product'}
              </button>
              <button
                onClick={() => {
                  setCreateModal(false)
                  setImageFile(null)
                  setImagePreview(null)
                  setCreateForm({
                    name: '',
                    price: '',
                    discount: '',
                    available: true,
                    sizes: [7, 8, 9, 10],
                    quantities: [0, 0, 0, 0]
                  })
                }}
                disabled={creating}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products
