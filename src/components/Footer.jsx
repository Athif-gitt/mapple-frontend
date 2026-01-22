import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 text-slate-500 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Mapple </h2>
          <p className="max-w-sm mb-4">
            Premium accessories for your premium devices. Quality, trust, and style all in one place.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Shop</h4>
          <ul className="space-y-2">
            <li><Link to="/products" className="hover:text-indigo-600 transition-colors">All Products</Link></li>
            <li><Link to="/wishlist" className="hover:text-indigo-600 transition-colors">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h4 className="font-bold text-slate-800 mb-4">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">FAQs</a></li>
            <li><a href="#" className="hover:text-indigo-600 transition-colors">Returns</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Mapple. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-indigo-600 transition-colors">Facebook</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
          <a href="#" className="hover:text-indigo-600 transition-colors">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
