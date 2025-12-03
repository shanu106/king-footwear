import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const { isAuth, loading, getCartCount } = useAuth();
  const cartCount = getCartCount();

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4 mb-7">
      <div 
        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition"
        onClick={() => navigate('/')}
      >
        <div className="w-11 h-11 bg-gradient-to-br from-rose-100 to-rose-50 rounded-lg grid place-items-center text-rose-700 font-extrabold shadow-md">
          S
        </div>
        <div>
          <div className="text-sm text-gray-500 font-semibold">Sandalista</div>
          <div className="text-xs text-gray-400">women's footwear</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {showSearch && (
          <input
            className="w-64 md:w-80 px-3 py-2 rounded-lg border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-rose-200 transition"
            placeholder="Search sandals, slides..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
            autoFocus
          />
        )}

        <button
          onClick={() => setShowSearch((s) => !s)}
          aria-label="Toggle search"
          title="Search"
          className="bg-white hover:cursor-pointer hover:scale-90 rounded-xl p-2 shadow flex items-center justify-center transition"
        >
          <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 21l-4.35-4.35" stroke="#7a6f6a" strokeWidth="1.6" strokeLinecap="round"/>
            <circle cx="11" cy="11" r="6" stroke="#7a6f6a" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        {!loading && isAuth ? (
          <>
            <button
              onClick={() => navigate('/cart')}
              className="bg-white rounded-xl hover:scale-90 hover:cursor-pointer p-2 shadow flex items-center justify-center transition relative"
              aria-label="Cart"
              title="Cart"
            >
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M3 3h2l1.5 9h11L21 7H6" stroke="#7a6f6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="20" r="1.6" fill="#7a6f6a"/>
                <circle cx="18" cy="20" r="1.6" fill="#7a6f6a"/>
              </svg>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-rose-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="bg-white hover:cursor-pointer hover:scale-90 rounded-xl p-2 shadow flex items-center justify-center transition"
              aria-label="Profile"
              title="Profile"
            >
              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="#7a6f6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 20a8 8 0 0116 0" stroke="#7a6f6a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        ) : !loading ? (
          <>
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-rose-400 to-rose-300 rounded-lg shadow hover:shadow-md transition"
            >
              Sign Up
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
