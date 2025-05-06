"use client";

import { useAuth } from "@/context/authContext";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiLock, FiMail } from "react-icons/fi";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.message || "Login failed");
      } else {
        const data = await res.json();
        login(
          data.accessToken,
          data.refreshToken,
          data.role,
          data.email,
          data.name,
          data.id
        );
      }
    } catch (err) {
      console.warn(err);
      setError("An error occurred during login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Login
        </h1>

        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        {/* Email field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="relative mb-4">
          <FiMail className="absolute top-3.5 left-3 text-gray-500" />
          <input
            type="email"
            placeholder="you@example.com"
            className="pl-10 pr-4 py-2 w-full border border-gray-500 rounded-lg placeholder-gray-400 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="relative mb-6">
          <FiLock className="absolute top-3.5 left-3 text-gray-500" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 py-2 w-full border border-gray-500 rounded-lg placeholder-gray-400 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-3.5 right-3 cursor-pointer text-gray-500"
          >
            {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white cursor-pointer font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Login
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          Don’t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}
