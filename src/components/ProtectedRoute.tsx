"use client";

import { useAuth } from "@/context/authContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or your custom loader
  }

  return isAuthenticated ? children : null;
}
