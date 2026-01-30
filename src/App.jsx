import React, { Profiler } from "react";
import Home from "./Home";
import Login from "./features/auth/Login";
import { Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import Products from "./components/Products";
import Signup from "./features/Signup"
import Iphone from "./components/Products/Iphone";
import AirPod from "./components/Products/AirPod";
import MacBook from "./components/Products/MacBook";
import Footer from "./components/Footer";
import ProductDetails from "./components/ProductDetails";
import AdminHome from "./Admin/Pages/AdminHome";
import Payment from "./components/Payment";
import Confirmation from "./components/Confirmation";
import Orders from "./components/Orders";
import Wishlist from "./components/Wishlist";
import OrderDetails from "./components/OrderDetails";
import AdminUsers from "./Admin/Pages/AdminUsers";
import UserDetails from "./Admin/Pages/UserDetails";
import Nav from "./components/Nav";
import ScrollToTop from "./utils/ScrollToTop";
import OAuthCallback from "@/features/auth/OAuthCallback";
import Profile from './components/Profile'


function App() {
  return (
    <div>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />}></Route>
        <Route path="/signup" element={<Signup />}></Route>

        {/* Unify Legacy Routes */}
        <Route path="/iphone" element={<Products categoryProp="iphone" />}></Route>
        <Route path="/macbook" element={<Products categoryProp="macbook" />}></Route>
        <Route path="/earpod" element={<Products categoryProp="airpods" />}></Route>

        <Route path="/payment" element={<Payment />}></Route>
        {/* <Route path="/payment" element={<Payment />}></Route> */}
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/confirmation" element={<Confirmation />}></Route>
        <Route path="/products/:id/" element={<ProductDetails />} />
        <Route path="/admin-home/*" element={<AdminHome />} />
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/orders/:id" element={<OrderDetails />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        <Route path="/profile" element={<Profile />} />


      </Routes>
      <Footer />
    </div>
  );
}

export default App;
