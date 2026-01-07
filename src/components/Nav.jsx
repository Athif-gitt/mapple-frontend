import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Nav() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const fetchCartQuantity = async () => {
      const token = localStorage.getItem("access-token");
      if (!token) return;

      setLoggedIn(true);

      try {
        const res = await axios.get(`http://localhost:3010/users/${user.id}`);
        const cartItems = res.data.cart || [];
        const totalQuantity = cartItems.reduce(
          (acc, item) => acc + item.quantity,
          0
        );
        setCartQuantity(totalQuantity);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
      }
    };

    fetchCartQuantity();
  }, []);

  return (
    <div>
      <nav className="flex justify-between items-center bg-white px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">Mapple </h1>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/">Home</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer">
            <Link to="/products">Products</Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer relative">
            <Link to="/cart">
              Cart
              <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs absolute -top-2 -right-3">
                {cartQuantity}
              </span>
            </Link>
          </li>
          <li className="hover:text-blue-600 cursor-pointer relative">
            <Link to={"/orders"}>Orders</Link>
          </li>

          {loggedIn ? (
            <li
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => {
                localStorage.removeItem("access-token");
                localStorage.removeItem("refresh-token");
                setLoggedIn(false);
              }}
            >
              Logout
            </li>
          ) : (
            <li className="hover:text-blue-600 cursor-pointer">
              <Link to="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Nav;
