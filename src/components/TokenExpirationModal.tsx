"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";

export default function TokenExpirationModal() {
  const { refreshToken } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60 seconds to expire
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  // Check token expiration periodically
  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = decodeJwt(token);
      if (!decoded?.exp) return;

      const expiresIn = decoded.exp * 1000 - Date.now();

      if (expiresIn < 300000 && expiresIn > 0) {
        // 5 minutes remaining
        setCountdown(Math.floor(expiresIn / 1000));
        setShowWarning(true);
        startInactivityTimer();
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Handle user activity
  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    setInactivityTimer(
      setTimeout(() => {
        setShowWarning(false);
      }, 30000)
    ); // 30 seconds of inactivity
  };

  const startInactivityTimer = () => {
    window.addEventListener("mousemove", resetInactivityTimer);
    window.addEventListener("keydown", resetInactivityTimer);
    resetInactivityTimer();
  };

  const stopInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    window.removeEventListener("mousemove", resetInactivityTimer);
    window.removeEventListener("keydown", resetInactivityTimer);
  };

  const handleRefresh = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
      stopInactivityTimer();
    } catch (error) {
      console.error("Token refresh failed:", error);
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning]);

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm text-gray-700 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">Session About to Expire</h3>
        <p className="mb-4">
          Your session will expire in {countdown} seconds due to inactivity.
          Would you like to stay logged in?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowWarning(false)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Logout
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper function to decode JWT
function decodeJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}
