"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FiLock, FiMail } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [retypePassword, setRetypePassword] = useState("");
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const route = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (password !== retypePassword) {
        toast.error(`Password doesn't match`);
        return;
      }

      const res = await fetch("http://localhost:3001/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        toast.error(errData.message || "Reset password failed");
        return;
      }

      toast.success("Password reset successful!. Proceed to login");
      setTimeout(() => {
        route.push("/login");
      }, 2000);
    } catch (err) {
      console.warn(err);
      toast.error("An error occurred during reset password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Reset Password
        </h1>
        <p className="text-sm text-center mt-2 mb-6 text-gray-600">
          Enter a new password to reset the password to you account. We will ask
          for this password whenever you login
        </p>

        {/* Email field */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Email<span className="text-red-700">*</span>
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
          Password<span className="text-red-700">*</span>
        </label>
        <div className="relative mb-3">
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
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Retype Password<span className="text-red-700">*</span>
        </label>
        <div className="relative mb-3">
          <FiLock className="absolute top-3.5 left-3 text-gray-500" />
          <input
            type={showRetypePassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 py-2 w-full border border-gray-500 rounded-lg placeholder-gray-400 text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            required
          />
          <div
            onClick={() => setShowRetypePassword(!showRetypePassword)}
            className="absolute top-3.5 right-3 cursor-pointer text-gray-500"
          >
            {showRetypePassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 mt-6 text-white cursor-pointer font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Reset Password
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          <Link href="/login" className="text-blue-600 hover:underline">
            Return To Login
          </Link>
        </p>
      </form>
      <ToastContainer position="top-right" />
    </div>
  );
}
