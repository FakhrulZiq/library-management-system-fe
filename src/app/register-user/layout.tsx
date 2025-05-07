"use client";

import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/authContext";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 h-screen overflow-y-auto">
        {children}
      </main>{" "}
    </div>
  );
}
