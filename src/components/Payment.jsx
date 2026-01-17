import React, { useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

export default function Payment() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newError = {};
    if (!cardNumber) newError.cardNumberError = "Required";
    if (!expiry) newError.expiryError = "Required";
    if (!cvv) newError.cvvError = "Required";
    return newError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    try {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedUser) {
        alert("No user found!");
        return;
      }

      const res = await api.get(
        `/users/${loggedUser.id}`
      );
      const userData = res.data;
      const resPatch = await api.patch(
        `/users/${userData.id}`,
        { purchase: userData.cart }
      );
      console.log(resPatch.data);

      navigate("/confirmation", { state: { order: userData.cart } });

      // console.log("User data:", userData);
      // console.log("Cart items:", userData.cart);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 w-96"
      >
        <h2 className="text-xl font-semibold text-center mb-6">Card Payment</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Card Number
          </label>
          <input
            name="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            type="text"
            placeholder="1234 5678 9012 3456"
            className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          {error.cardNumberError && (
            <p className="text-red-500 text-sm mt-1">
              *{error.cardNumberError}
            </p>
          )}
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              Expiry
            </label>
            <input
              name="expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              type="text"
              placeholder="MM/YY"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error.expiryError && (
              <p className="text-red-500 text-sm mt-1">*{error.expiryError}</p>
            )}
          </div>

          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-600">
              CVV
            </label>
            <input
              name="cvv"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              type="password"
              placeholder="123"
              className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {error.cvvError && (
              <p className="text-red-500 text-sm mt-1">*{error.cvvError}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
}
