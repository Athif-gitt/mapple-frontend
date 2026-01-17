import React, { useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";
import Cart from "../components/Cart";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({});

  const validate = () => {
    const newError = {};

    if (!name.trim()) {
      newError.nameError = "Required";
    }

    if (!email.trim()) {
      newError.emailError = "Required";
    } else if (!email.includes("@")) {
      newError.emailError = "@ required";
    }

    if (!password.trim()) {
      newError.passwordError = "Required";
    } else if (password.length < 6) {
      newError.passwordError = "Password must be at least 6 characters";
    }

    if (!confirmPassword.trim()) {
      newError.confirmPasswordError = "Required";
    } else if (password !== confirmPassword) {
      newError.confirmPasswordError = "Passwords do not match";
    }

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
      const res = await api.post(
        "/auth/register/",
        {
          username: name,
          email,
          password,
        }
      );

      alert("Account created successfully!");
      navigate("/login");

    } catch (err) {
      console.error(err);

      if (err.response?.status === 400) {
        alert("User already exists or invalid data");
      } else {
        alert(err.response.Object);
      }
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h1>

        <label className="block text-gray-700 mb-2">Username</label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          placeholder="Enter username"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600 mb-4">{error.nameError}</p>

        <label className="block text-gray-700 mb-2">E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600 mb-4">{error.emailError}</p>

        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600 mb-4">{error.passwordError}</p>

        <label className="block text-gray-700 mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600 mb-6">{error.confirmPasswordError}</p>

        <div className="flex flex-row p-4 border-black">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mr-1 cursor-pointer"
          >
            Create Account
          </button>

          <button
            type="button"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Back to Login
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;
