"use client";

import { ConfirmationModal } from "@/components/ConfirmationMessageModal";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  matricOrStaffNo: string;
};

export default function ProfilePage() {
  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [user, setUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const { role } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [message, setMessage] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    fetch(`http://localhost:3001/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or not found");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setEditUser(data); // Initialize edit state
      })
      .catch((err) => console.error("Failed to fetch user", err));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditUser({ ...editUser!, [e.target.name]: e.target.value });
  };

  const handleUpdateUser = () => {
    setShowUpdateModal(true);
  };

  const confirmUpdateUser = async () => {
    if (!editUser) return;

    setUpdateLoading(true);
    setUpdateError(null);

    const token = localStorage.getItem("token");

    try {
      const { id, ...userData } = editUser;
      const userId = localStorage.getItem("id");

      const response = await fetch(`http://localhost:3001/user/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      const updated = await response.json();

      if (!response.ok) {
        toast.error(updated.message || "Failed to update user");
      }

      setUser(updated);
      setShowUpdateModal(false);
      toast.success("User updated successfully");
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "Failed to update user";
      toast.error(msg);
      setUpdateError(msg);
      console.error("Update error:", error);
    } finally {
      setUpdateLoading(false);
    }
  };

  const cancelUpdate = () => {
    setShowUpdateModal(false);
    setUpdateError(null);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("id");

    if (newPassword !== retypePassword) {
      setMessage("Passwords do not match.");
      return;
    }

    const token = localStorage.getItem("token");

    const res = await fetch(
      `http://localhost:3001/user/change-password/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Failed to update user");
    } else {
      setShowUpdateModal(false);
      toast.success("Password reset successfully");
    }

    if (res.ok) {
      setOldPassword("");
      setNewPassword("");
      setRetypePassword("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-gray-700 rounded-xl shadow-md mt-6">
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-4">
          <button
            onClick={() => setTab("profile")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              tab === "profile"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Update Profile
          </button>
          <button
            onClick={() => setTab("password")}
            className={`px-4 py-2 font-medium cursor-pointer ${
              tab === "password"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-500"
            }`}
          >
            Reset Password
          </button>
        </nav>
      </div>

      {tab === "profile" ? (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              className="w-full border border-gray-300 rounded p-2"
              name="name"
              value={editUser?.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              className="w-full border border-gray-300 rounded p-2"
              name="email"
              value={editUser?.email || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block font-medium">Matric/Staff No</label>
            <input
              className="w-full border border-gray-300 rounded p-2"
              name="matricOrStaffNo"
              value={editUser?.matricOrStaffNo || ""}
              onChange={handleChange}
              required
            />
          </div>
          {(role === "admin" || role === "librarian") && (
            <div>
              <label className="block font-medium">Role</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                name="role"
                value={editUser?.role || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select role</option>
                <option value="admin">Admin</option>
                <option value="librarian">Librarian</option>
                <option value="student">Student</option>
              </select>
            </div>
          )}
          <div>
            <label className="block font-medium">Status</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              name="status"
              value={editUser?.status || ""}
              onChange={handleChange}
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleUpdateUser}
            className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700"
          >
            Update
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block font-medium">Old Password</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded p-2 pr-10"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          </div>
          <div>
            <label className="block font-medium">New Password</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded p-2 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </div>
            </div>
          </div>
          <div>
            <label className="block font-medium">Re-type Password</label>
            <div className="relative">
              <input
                type={showRetypePassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded p-2 pr-10"
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                required
              />
              <div
                className="absolute top-2.5 right-3 cursor-pointer"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
              >
                {showRetypePassword ? (
                  <AiOutlineEyeInvisible />
                ) : (
                  <AiOutlineEye />
                )}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-indigo-700"
          >
            Reset Password
          </button>
        </form>
      )}

      {showUpdateModal && (
        <ConfirmationModal
          message="Are you sure you want to update this profile?"
          onConfirm={confirmUpdateUser}
          onCancel={cancelUpdate}
          confirmText={updateLoading ? "Updating..." : "Update"}
          cancelText="Cancel"
          type="update"
        />
      )}

      {updateError && (
        <p className="text-sm text-red-600 mt-2">{updateError}</p>
      )}

      {updateError && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
          <span className="block sm:inline">{updateError}</span>
          <button
            onClick={() => setUpdateError(null)}
            className="absolute top-0 right-0 px-2 py-1"
          >
            &times;
          </button>
        </div>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
}
