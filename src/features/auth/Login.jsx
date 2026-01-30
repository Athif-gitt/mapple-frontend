import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";


function Login() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});

  // const validate = () => {
  //   const newError = {};

  //   if (!name.trim()) {
  //     newError.nameError = "Username is required";
  //   }

  //   if (!password.trim()) {
  //     newError.passwordError = "Password is required";
  //   } else if (password.length < 6) {
  //     newError.passwordError = "Password must be at least 6 characters";
  //   }

  //   return newError;
  // };

  // 🔐 PASSWORD LOGIN (OAuth2 Password Grant)

const handleSubmit = async (e) => {
  e.preventDefault();
  setError({});

  try {
    const res = await api.post("/token/", {
      username: name.trim(),
      password,
    });

    console.log("LOGIN RESPONSE:", res.data);

    localStorage.setItem("access-token", res.data.access);
    localStorage.setItem("refresh-token", res.data.refresh);

    const userRes = await api.get("/auth/me/");

    if (userRes.data.is_staff) {
      navigate("/admin-home/stats/");
    } else {
      navigate("/");
    }
  } catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err);
    setError({
      nameError: "Invalid username or password",
      passwordError: "Invalid username or password",
    });
  }
};



  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/accounts/google/login/`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-50 font-sans">
      <form
        className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-sm border border-slate-100"
        onSubmit={handleSubmit}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-sm">
            Please sign in to your account
          </p>
        </div>

        {/* Username */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Username
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter username"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-4">{error.nameError}</p>

        {/* Password */}
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all mb-1"
        />
        <p className="text-red-500 text-xs mb-6">{error.passwordError}</p>

        <div className="flex flex-col gap-3">
          {/* Password Login */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
          >
            Login
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white text-slate-700 border border-slate-200 py-3.5 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-3"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* Signup */}
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
