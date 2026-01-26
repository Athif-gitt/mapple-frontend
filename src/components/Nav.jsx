import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/api/axios";

function Nav() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    const token = localStorage.getItem("access-token");
    if (!token) {
      setLoggedIn(false);
      return;
    }

    setLoggedIn(true);

    const fetchCartQuantity = async () => {
      try {
        const res = await api.get("/cart/");
        const items = res.data.items || [];
        const totalQuantity = items.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartQuantity(totalQuantity);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    const fetchProfileInitial = async () => {
      try {
        const res = await api.get("/auth/profile/dashboard/");
        const name = res.data.profile?.full_name || "U";
        setUserInitial(name.charAt(0).toUpperCase());
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };

    fetchCartQuantity();
    fetchProfileInitial();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Mapple
          </span>
          <span className="text-2xl"></span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
          <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
          <li><Link to="/products" className="hover:text-indigo-600">Products</Link></li>
          <li><Link to="/wishlist" className="hover:text-indigo-600">Wishlist</Link></li>
          <li><Link to="/orders" className="hover:text-indigo-600">Orders</Link></li>
        </ul>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative group p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-700 group-hover:text-indigo-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 
                   1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 
                   1.125 0 0 1-1.12-1.243l1.264-12A1.125 
                   1.125 0 0 1 5.513 7.5h12.974c.576 
                   0 1.059.435 1.119 1.007ZM8.625 
                   10.5a.375.375 0 1 1-.75 0 
                   .375.375 0 0 1 .75 0Zm7.5 
                   0a.375.375 0 1 1-.75 0 
                   .375.375 0 0 1 .75 0Z"
              />
            </svg>

            {cartQuantity > 0 && (
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                {cartQuantity}
              </span>
            )}
          </Link>

          {/* Login / Logout */}
          {loggedIn ? (
            <button
              onClick={() => {
                localStorage.removeItem("access-token");
                localStorage.removeItem("refresh-token");
                setLoggedIn(false);
                navigate("/login");
              }}
              className="text-sm font-medium text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Login
            </Link>
          )}

          {/* 👤 Profile Icon — ALWAYS LAST */}
          <button
            onClick={() =>
              loggedIn ? navigate("/profile") : navigate("/login")
            }
            title="Profile"
            className="
              w-9 h-9
              rounded-full
              border border-black
              flex items-center justify-center
              font-semibold
              text-black
              hover:bg-black hover:text-white
              transition
            "
          >
            {userInitial}
          </button>
        </div>
      </nav>
    </header>
  );
}

export default Nav;
