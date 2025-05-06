"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    token: string,
    refreshToken: string,
    userRole: string,
    userEmail: string,
    userName: string,
    userId: string
  ) => void;
  logout: () => void;
  refreshToken: () => void;
  role: string;
  email: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      const savedRole = localStorage.getItem("role");
      const savedEmail = localStorage.getItem("email");
      const savedName = localStorage.getItem("name");

      if (!token) {
        setIsLoading(false);
        return;
      }

      if (savedRole) {
        setRole(savedRole);
      }

      if (savedEmail) {
        setEmail(savedEmail);
      }

      if (savedName) {
        setName(savedName);
      }

      try {
        const res = await fetch("http://localhost:3001/auth/verify", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data?.valid) {
            setIsAuthenticated(true);
          } else {
            await refreshToken();
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    verifyToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      logout();
      return false;
    }

    try {
      const res = await fetch("http://localhost:3001/auth/refresh-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.accessToken);
        setIsAuthenticated(true);
        return true;
      }
      throw new Error("Refresh failed");
    } catch (error) {
      logout();
      console.warn(error);
      return false;
    }
  };

  const login = (
    token: string,
    refreshToken: string,
    userRole: string,
    userEmail: string,
    userName: string,
    userId: string
  ) => {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("name", userName);
    localStorage.setItem("id", userId);

    setIsAuthenticated(true);
    setRole(userRole);
    setEmail(userEmail);
    setName(userName);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setRole("");
    setEmail("");
    setName("");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
        role,
        email,
        name,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
