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

  // const validate = () => {
  //   const newError = {};

  //   if (!name.trim()) {
  //     newError.nameError = "Required";
  //   }

  //   if (!email.trim()) {
  //     newError.emailError = "Required";
  //   } else if (!email.includes("@")) {
  //     newError.emailError = "@ required";
  //   }

  //   if (!password.trim()) {
  //     newError.passwordError = "Required";
  //   } else if (password.length < 6) {
  //     newError.passwordError = "Password must be at least 6 characters";
  //   }

  //   if (!confirmPassword.trim()) {
  //     newError.confirmPasswordError = "Required";
  //   } else if (password !== confirmPassword) {
  //     newError.confirmPasswordError = "Passwords do not match";
  //   }

  //   return newError;
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError({}); // clear old errors

  try {
    await api.post("/auth/register/", {
      username: name,
      email,
      password,
    });

    alert("Account created successfully!");
    navigate("/login");

  } catch (err) {
    if (err.response?.status === 400) {
      const backendErrors = err.response.data;
      const formattedErrors = {};

      if (backendErrors.username) {
        formattedErrors.nameError = backendErrors.username[0];
      }

      if (backendErrors.email) {
        formattedErrors.emailError = backendErrors.email[0];
      }

      if (backendErrors.password) {
        formattedErrors.passwordError = backendErrors.password[0];
      }

      setError(formattedErrors);
    } else {
      alert("Something went wrong");
    }
  }
};



  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 font-sans">
      <form
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
          <p className="text-slate-500 text-sm">Join Mapple for premium products</p>
        </div>

        <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          placeholder="Enter username"
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-3">{error.nameError}</p>

        <label className="block text-sm font-semibold text-slate-700 mb-2">E-Mail</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-3">{error.emailError}</p>

        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-3">{error.passwordError}</p>

        <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-6">{error.confirmPasswordError}</p>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Create Account
          </button>

          <button
            type="button"
            className="w-full bg-white text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
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
