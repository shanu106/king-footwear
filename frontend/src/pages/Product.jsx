import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Product = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuth, addToCart } = useAuth()
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [product, setProduct] = useState(location.state?.product || null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [toastMessage, setToastMessage] = useState('')
  const url = window.RUNTIME_CONFIG.VITE_BACKEND_URL;
  // const url = import.meta.env.VITE_BACKEND_URL

  // Common shoe sizes
  const shoeSizes = [ '6',  '7',  '8',  '9',  '10',]

  // Convert image buffer/string to data URL
  const extractImageFromBuffer = (imageBuffer) => {
    try {
      if (!imageBuffer) return null
      
      if (typeof imageBuffer === 'string') {
        return `data:image/webp;base64,${imageBuffer}`
      }
      
      if (imageBuffer.data && Array.isArray(imageBuffer.data)) {
        const binaryString = String.fromCharCode.apply(null, imageBuffer.data)
        const base64String = btoa(binaryString)
        return `data:image/webp;base64,${base64String}`
      }
      
      return null
    } catch (error) {
      console.error('Error extracting image:', error)
      return null
    }
  }

  // Fetch product if not passed via location state
  useEffect(() => {
    // Reset selections when product changes
    setQuantity(1)
    setSelectedSize('')
    
    if (!product && id) {
      const fetchProduct = async () => {
        try {
          console.log(`Fetching product from: ${url}/product/${id}`)
          const response = await axios.get(`${url}/get-product/${id}`)
          console.log('Single Product Response:', response.data)
          setProduct(response.data)
        } catch (error) {
          console.error('Error fetching product:', error)
          // Fallback: try alternate endpoint if first fails
          try {
            const fallbackResponse = await axios.get(`${url}/get-product/${id}`)
            console.log('Fallback Product Response:', fallbackResponse.data)
            setProduct(fallbackResponse.data)
          } catch (fallbackError) {
            console.error('Fallback also failed:', fallbackError)
          }
        }
      }
      fetchProduct()
    } else if (product) {
      // If product is passed via location state, update it
      console.log('Product updated from location state:', product)
    }
  }, [id, url])

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await axios.get(`${url}/products`)
        // Get 4 random related products excluding current product
        const related = response.data
          .filter(p => p._id !== id)
          .sort(() => Math.random() - 0.5)
          .slice(0, 4)
        setRelatedProducts(related)
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    if (id) {
      fetchRelated()
    }
  }, [id, url])

  const handleAddToCart = () => {
    if (!isAuth) {
      navigate('/login')
      return
    }

    if (!selectedSize) {
      setToastMessage('Please select a size!')
      setTimeout(() => setToastMessage(''), 3000)
      return
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: extractImageFromBuffer(product.image),
      description: product.description,
      size: selectedSize,
      quantity: parseInt(quantity)
    }

    addToCart(cartItem)
    setToastMessage(`${product.name} (Size ${selectedSize}) added to cart!`)
    setTimeout(() => setToastMessage(''), 3000)
  }

  const handleBuyNow = () => {
    if (!isAuth) {
      navigate('/login')
      return
    }

    if (!selectedSize) {
      setToastMessage('Please select a size!')
      setTimeout(() => setToastMessage(''), 3000)
      return
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: extractImageFromBuffer(product.image),
      description: product.description,
      size: selectedSize,
      quantity: parseInt(quantity)
    }

    addToCart(cartItem)
    navigate('/cart')
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 p-7">
        <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
          <Navbar />
        </div>
        <main className="max-w-7xl mx-auto mt-20">
          <div className="text-center">
            <p className="text-xl text-gray-500">Loading product...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const imageUrl = extractImageFromBuffer(product.image)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 p-7">
      <div className="bg-gradient-to-r from-rose-100 via-rose-50 to-amber-50 text-gray-900 px-7 pt-7">
        <Navbar />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-7 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
          {toastMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold transition"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Product Image */}
          <div className="bg-white rounded-2xl p-8 shadow-lg flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-auto object-contain max-h-96"
              />
            ) : (
              <div className="w-full h-96 bg-gradient-to-br from-rose-100 to-amber-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <span className="inline-block text-xs font-semibold text-gray-500 bg-rose-50 px-3 py-1 rounded-full mb-4">
                Premium Collection
              </span>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              <p className="text-gray-600 text-lg mb-6">{product.description}</p>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl p-6 mb-6 border border-rose-100">
              <p className="text-gray-600 text-sm mb-2">Price</p>
              <p className="text-4xl font-bold text-rose-600">₹{product.price}</p>
              <p className="text-sm text-gray-500 mt-2">✓ Free Shipping</p>
            </div>
            {/* Size Selector */}
            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-3">Select Size</p>
              <div className="grid grid-cols-5 gap-2">
                {shoeSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 rounded-lg font-semibold transition ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-rose-400 to-rose-300 text-white shadow-md'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {!selectedSize && (
                <p className="text-xs text-red-500 mt-2">* Please select a size</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-gray-700 font-semibold mb-3">Quantity</p>
              <div className="flex items-center gap-4 bg-white rounded-lg border border-gray-200 p-2 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  −
                </button>
                <span className="text-lg font-semibold min-w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg shadow-md hover:shadow-lg transition"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-6 py-3 text-base font-semibold text-rose-600 bg-white border-2 border-rose-400 rounded-lg hover:bg-rose-50 transition"
              >
                Buy Now
              </button>
            </div>

            {/* Product Features */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Why choose this product?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span className="text-gray-700">Premium quality materials for comfort</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span className="text-gray-700">Free shipping on all orders</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span className="text-gray-700">Easy returns within 30 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-rose-500 mt-1">✓</span>
                  <span className="text-gray-700">Authentic guarantee</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {relatedProducts.map((p) => {
                const relatedImageUrl = extractImageFromBuffer(p.image)
                return (
                  <div
                    key={p._id}
                    className="bg-white rounded-lg p-3 shadow hover:-translate-y-1 transition cursor-pointer"
                    onClick={() => {
                      setProduct(p)
                      setQuantity(1)
                      setSelectedSize('')
                      window.scrollTo(0, 0)
                      navigate(`/product/${p._id}`, { state: { product: p } })
                    }}
                  >
                    <div className="aspect-square rounded-lg bg-gradient-to-br from-rose-50 to-white flex items-center justify-center mb-2 overflow-hidden hover:shadow-md transition">
                      {relatedImageUrl ? (
                        <img
                          src={relatedImageUrl}
                          alt={p.name}
                          className="w-full h-full object-contain"
                        />
                      ) : null}
                    </div>

                    <div className="mb-2">
                      <div className="font-semibold text-xs line-clamp-2">{p.name}</div>
                      <div className="font-bold text-xs text-rose-600 mt-1">₹{p.price}</div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const cartItem = {
                            id: p._id,
                            name: p.name,
                            price: p.price,
                            image: relatedImageUrl,
                            description: p.description,
                            quantity: 1
                          }
                          if (isAuth) {
                            addToCart(cartItem)
                            setToastMessage(`${p.name} added to cart!`)
                            setTimeout(() => setToastMessage(''), 3000)
                          } else {
                            navigate('/login')
                          }
                        }}
                        className="flex-1 px-2 py-1 text-xs font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded hover:shadow-md transition"
                      >
                        Add
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const cartItem = {
                            id: p._id,
                            name: p.name,
                            price: p.price,
                            image: relatedImageUrl,
                            description: p.description,
                            quantity: 1
                          }
                          if (isAuth) {
                            addToCart(cartItem)
                            navigate('/cart')
                          } else {
                            navigate('/login')
                          }
                        }}
                        className="flex-1 px-2 py-1 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Product