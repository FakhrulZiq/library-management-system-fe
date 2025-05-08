"use client";

import SuccessModal from "@/components/SuccessRegisterModal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    retypePassword: "",
    role: "student",
    name: "",
    matricOrStaffNo: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.retypePassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const { ...payload } = formData;

    try {
      const response = await fetch("http://localhost:3001/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.message || "Registration failed.";
        toast.error(errorMessage);
      }

      setMessage("Registration successful!");
      setShowModal(true);
    } catch (error) {
      setMessage(error.message || "An unexpected error occurred.");
      console.error(error);
    }
  };

  const handleLoginRedirect = () => {
    setShowModal(false);
    router.push("/staff");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-600 rounded-xl shadow-md mt-6">
      <div className="bg-white rounded-2xl rounded">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Add User
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="name"
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            name="matricOrStaffNo"
            type="text"
            placeholder="Matric or Staff No"
            value={formData.matricOrStaffNo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="student">Student</option>
            <option value="librarian">Librarian</option>
          </select>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded pr-10"
              required
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3.5 right-3 cursor-pointer text-gray-500"
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </div>
          </div>

          <div className="relative">
            <input
              name="retypePassword"
              type={showPassword ? "text" : "password"}
              placeholder="Retype Password"
              value={formData.retypePassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded pr-10"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white cursor-pointer font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Add User
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-600">{message}</p>
        )}
      </div>

      {showModal && (
        <SuccessModal
          message="User added sucessfully!"
          onClose={handleLoginRedirect}
          buttonText="Complete"
        />
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}
