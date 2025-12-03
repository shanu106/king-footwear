import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


const Home = () => {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const url = window.RUNTIME_CONFIG.VITE_BACKEND_URL;
  // const url = import.meta.env.VITE_BACKEND_URL;
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { isAuth, addToCart } = useAuth();
  const [toastMessage, setToastMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState(10000);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sizeModal, setSizeModal] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const sizes = [7, 8, 9, 10];

  // Category options
  const categories = [
    { id: "all", name: "All Products", icon: "🎽" },
    { id: "sandals", name: "Sandals", icon: "👡" },
    { id: "heels", name: "Heels", icon: "👠" },
    { id: "flats", name: "Flats", icon: "🩴" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "casual", name: "Casual", icon: "👟" },
  ];

  // Convert image buffer/string to data URL
  const extractImageFromBuffer = (imageBuffer) => {
    try {
      if (!imageBuffer) return null;
      
      // If it's already a string (base64)
      if (typeof imageBuffer === "string") {
        return `data:image/webp;base64,${imageBuffer}`;
      }
      
      // If it's an object with data array (from MongoDB Binary)
      if (imageBuffer.data && Array.isArray(imageBuffer.data)) {
        const binaryString = String.fromCharCode.apply(null, imageBuffer.data);
        const base64String = btoa(binaryString);
        return `data:image/webp;base64,${base64String}`;
      }
      
      return null;
    } catch (error) {
      console.error("Error extracting image:", error);
      return null;
    }
  };

  const getProducts = async () => {
    if (!url) return;
    try {
      const response = await axios.get(`${url}/products`);
      
      setProducts(response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  const handleAddToCart = (product) => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    // Show size selection modal
    setSizeModal(product);
    setSelectedSize(null);
  };

  const handleConfirmAddToCart = (product, size) => {
    if (!size) {
      alert('Please select a size');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: extractImageFromBuffer(product.image),
      description: product.description,
      size: size,
      quantity: 1
    };

    addToCart(cartItem);
    setToastMessage(`${product.name} (Size ${size}) added to cart!`);
    setTimeout(() => setToastMessage(""), 3000);
    setSizeModal(null);
    setSelectedSize(null);
  };

  const handleBuyNow = (product) => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    const cartItem = {
      id: product._id,
      name: product.name,
      price: product.price,
      image: extractImageFromBuffer(product.image),
      description: product.description,
      quantity: 1
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  // Filter products based on category and price
  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        p => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by price range
    filtered = filtered.filter(p => p.price <= priceRange);

    setFilteredProducts(filtered);
  }, [products, selectedCategory, priceRange]);

  useEffect(() => {
    // fetch products once when component mounts
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 text-gray-900 p-7">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-7 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-pulse z-50">
          {toastMessage}
        </div>
      )}

      <main className="max-w-7xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-9 shadow-lg">
            <span className="inline-block text-sm font-semibold text-gray-500 bg-rose-50 px-3 py-1 rounded-full">New season</span>
            <h1 id="hero-heading" className="mt-4 text-3xl md:text-4xl font-extrabold leading-tight">Effortless sandals for every summer moment</h1>
            <p className="text-gray-500 mt-3">Discover curated styles — lightweight, comfortable, and designed to elevate everyday outfits. Crafted with soft tones and thoughtful details.</p>

            <div className="flex items-center gap-3 mt-6">
              <button className="px-5 py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-rose-400 to-rose-300 shadow-md hover:shadow-lg transition">Shop collection</button>
              <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition">Learn more</button>
            </div>

            <div className="flex gap-4 mt-5 text-gray-500 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-100 block"></span>
                Soft leather
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-50 block"></span>
                Lightweight soles
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-50 block"></span>
                Timeless silhouettes
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <svg className="w-72 md:w-96" viewBox="0 0 400 360" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Illustration of a sandal">
              <rect width="400" height="360" rx="20" fill="url(#g)"/>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#fff"/>
                  <stop offset="1" stopColor="#f8f3f1"/>
                </linearGradient>
              </defs>
              <g transform="translate(40,60)">
                <path d="M40 190c45 20 130 18 180-6 18-8 28-22 24-36-8-28-88-20-140-16-50 4-84 48-64 58z" fill="#efe0db"/>
                <path d="M30 120c12-28 54-48 110-36 24 5 46 22 44 34-3 18-20 24-40 30-44 13-100 2-114-28z" fill="#d8b8ad"/>
                <path d="M120 26c34 2 82 26 96 42 6 8 2 18-6 22-22 12-72-6-96-24-18-14-14-46 6-40z" fill="#f7dfd7" opacity="0.95"/>
                <circle cx="170" cy="60" r="4" fill="#7a6f6a"/>
              </g>
            </svg>
          </div>
        </section>

        {/* Filter Section */}
        <section className="mt-12 mb-10">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          
          {/* Category Filter */}
          <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-rose-400 to-rose-300 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <label className="font-semibold text-gray-900">Price Range</label>
              <span className="text-lg font-bold text-rose-600">₹{priceRange}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(parseInt(e.target.value))}
              className="w-full h-2 bg-gradient-to-r from-rose-200 to-amber-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #fb7185 0%, #fda4af ${(priceRange / 10000) * 100}%, #fecaca ${(priceRange / 10000) * 100}%, #fecaca 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₹0</span>
              <span>₹10,000</span>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Featured picks</h2>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>

          {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" role="list">
            {filteredProducts.map((p) => {
              const imageUrl = extractImageFromBuffer(p.image);
              return (
                <article key={p._id} className="bg-white rounded-xl p-4 shadow hover:-translate-y-2 transition cursor-pointer" role="listitem" aria-label={p.name}>
                  <div 
                    onClick={() => handleProductClick(p)}
                    className="aspect-square rounded-lg bg-gradient-to-br from-rose-50 to-white flex items-center justify-center mb-3 overflow-hidden hover:shadow-lg transition"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                    ) : null}
                  </div>

                  <div 
                    onClick={() => handleProductClick(p)}
                    className="flex items-center justify-between mb-3 hover:opacity-70 transition cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold">{p.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">₹{p.price}</div>
                      <div className="text-xs text-gray-400">Free shipping</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(p)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg hover:shadow-md transition"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleProductClick(p)}
                      className="flex-1 px-4 py-2 text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                    >
                      Buy Now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or browse all products</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setPriceRange(10000)
                }}
                className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg hover:shadow-md transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />

      {/* Size Selection Modal */}
      {sizeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Size</h2>
            <p className="text-gray-600 mb-6">{sizeModal.name}</p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 rounded-lg font-bold text-lg transition ${
                    selectedSize === size
                      ? 'bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-900 border-2 border-gray-200 hover:border-rose-400 hover:shadow-md'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleConfirmAddToCart(sizeModal, selectedSize)}
                disabled={!selectedSize}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-400 to-rose-500 text-white rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add to Cart
              </button>
              <button
                onClick={() => {
                  setSizeModal(null);
                  setSelectedSize(null);
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
