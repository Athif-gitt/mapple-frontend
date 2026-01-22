import React, { useState } from "react";
import api from "@/api/axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  // 'name' state is used to collect the username from the input field
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  const validate = () => {
    const newError = {};

    if (!name.trim()) {
      newError.nameError = "Username is required";
    }

    if (!password.trim()) {
      newError.passwordError = "Password is required";
    } else if (password.length < 6) {
      newError.passwordError = "Password must be at least 6 characters";
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
      // FIX: Map React 'name' to the 'username' key required by your Django Serializer
      const res = await api.post("/auth/login/", {
        username: name.trim(),
        password: password,
      });

      // Securely store JWT tokens
      localStorage.setItem("access-token", res.data.access);
      localStorage.setItem("refresh-token", res.data.refresh);

      // Fetch user details for conditional routing
      const userRes = await api.get("/auth/me/");
      if (userRes.data.is_staff) {
        window.location.href = "/admin-home/stats/"; 
      } else {
        navigate("/"); 
      }
    } catch (err) {
      // Debug log to capture exact field errors from Django
      console.error("Backend Validation Error:", err.response?.data);
      
      const serverError = err.response?.data;
      if (serverError?.non_field_errors) {
          alert(serverError.non_field_errors[0]);
      } else if (serverError?.detail) {
          alert(serverError.detail);
      } else {
          alert("Login failed. Please check your credentials.");
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
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Please sign in to your account</p>
        </div>

        {/* Username Input */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
        <div className="relative mb-1">
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            value={name}
            placeholder="Enter username"
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <p className="text-red-500 text-xs mb-4">{error.nameError}</p>

        {/* Password Input */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
        <div className="relative mb-1">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
          />
        </div>
        <p className="text-red-500 text-xs mb-6">{error.passwordError}</p>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full bg-white text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors"
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;