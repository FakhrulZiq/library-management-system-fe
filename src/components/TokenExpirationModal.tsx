"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/authContext";
import { decodeJwt } from "@/utility/utilities";

export default function TokenExpirationModal() {
  const { refreshToken, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [autoRefreshed, setAutoRefreshed] = useState(false);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const decoded = decodeJwt(token);
      if (!decoded?.exp) return;

      const expiresIn = decoded.exp * 1000 - Date.now();

      if (expiresIn < 60000 && expiresIn > 0 && !showWarning) {
        setCountdown(Math.floor(expiresIn / 1000));
        setShowWarning(true);
        startInactivityTimer();
      }
    };

    const interval = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(interval);
  }, [showWarning]);

  const resetInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    setInactivityTimer(
      setTimeout(() => {
        logout();
      }, 60000)
    );
  };

  const startInactivityTimer = () => {
    window.addEventListener("mousemove", handleUserActivity);
    window.addEventListener("keydown", handleUserActivity);
    resetInactivityTimer();
  };

  const stopInactivityTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    window.removeEventListener("mousemove", handleUserActivity);
    window.removeEventListener("keydown", handleUserActivity);
  };

  const handleUserActivity = async () => {
    resetInactivityTimer();
    if (!autoRefreshed) {
      await handleRefresh();
      try {
        await refreshToken();
        setAutoRefreshed(true);
        setShowWarning(false);
        stopInactivityTimer();
      } catch (err) {
        console.error("Auto-refresh failed:", err);
      }
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshToken();
      setShowWarning(false);
      setAutoRefreshed(true);
      stopInactivityTimer();
      setCountdown(60); 
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  // Countdown effect
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowWarning(false);
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
          Your session will expire in {countdown} seconds. Would you like to
          stay logged in?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={logout}
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

