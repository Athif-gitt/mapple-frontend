import React from "react";
import Home from "./Home";
import Login from "./features/auth/Login";
import { Routes, Route } from "react-router-dom";
import Cart from "./components/Cart";
import Products from "./components/Products";
import SignUp from "./features/SignUp";
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

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/products" element={<Products />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/iphone" element={<Iphone />}></Route>
        <Route path="/macbook" element={<MacBook />}></Route>
        <Route path="/earpod" element={<AirPod />}></Route>
        <Route path="/payment" element={<Payment />}></Route>
        {/* <Route path="/payment" element={<Payment />}></Route> */}
        <Route path="/orders" element={<Orders />}></Route>
        <Route path="/confirmation" element={<Confirmation />}></Route>
        <Route path="/product-details" element={<ProductDetails />} />
        <Route path="/admin-home/*" element={<AdminHome />} />
        <Route path="/wishlist" element={<Wishlist />}></Route>
        <Route path="/orders/:id" element={<OrderDetails />} />
        {/* <Route path="/admin-home/users/" element={<AdminUsers />} />
        <Route path="/admin-home/users/" element={<AdminUsers />} />
        <Route path="/admin-home/users/" element={<AdminUsers />} />
        <Route path="/admin-home/users/:id" element={<UserDetails />} /> */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
