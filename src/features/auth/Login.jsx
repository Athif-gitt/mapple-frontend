import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});

  const validate = () => {
    const newError = {};

    if (!name.trim()) {
      newError.nameError = "Required";
    }

    if (!password.trim()) {
      newError.passwordError = "Required";
    } else if (password.length < 6) {
      newError.passwordError = "Password must be at least 6 characters";
    }

    if (!email.trim()) {
      newError.emailError = "Required";
    } else if (!email.includes("@")) {
      newError.emailError = "@ required";
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
    const res = await axios.post(
      "http://127.0.0.1:8000/api/auth/login/",
      {
        username: name,
        password: password,
      }
    );

    // Save token in browser storage
    localStorage.setItem("access-token", res.data.access);
    localStorage.setItem("refresh-token", res.data.refresh);

    // Redirect after login
    navigate("/");

  } catch (err) {
    console.error(err);
    alert("Invalid username or password");
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login / Sign Up
        </h1>

        <label className="block text-gray-700 mb-2">Username</label>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          placeholder="Enter username"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600">{error.nameError}</p>

        <label className="block text-gray-700 mb-2">E-Mail</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
          className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600">{error.emailError}</p>

        <label className="block text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <p className="text-amber-600">{error.passwordError}</p>

        <div className="flex flex-row p-4 border-black">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors mr-1 cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
