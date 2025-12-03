import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-white to-rose-50 border-t border-rose-100 mt-12 py-8">
      <div className="max-w-7xl mx-auto px-7">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-3">Sandalista</h3>
            <p className="text-sm text-gray-600">Elegant sandals crafted for comfort and everyday elegance. Discover modern styles for every occasion.</p>
          </div>

          {/* Shop Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-rose-400 transition">Women's Sandals</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">New Arrivals</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Best Sellers</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Sale</a></li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-rose-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Returns</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">FAQ</a></li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-rose-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Terms &amp; Conditions</a></li>
              <li><a href="#" className="hover:text-rose-400 transition">Blog</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-rose-100 pt-6">
          <div className="text-center text-sm text-gray-600">
            <p>© {new Date().getFullYear()} Sandalista — Designed for comfort and everyday elegance.</p>
            <p className="mt-2">Made with ♥ by Shahnawaj Nilgar.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
