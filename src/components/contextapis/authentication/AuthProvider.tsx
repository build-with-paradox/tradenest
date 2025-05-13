"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useSession, signOut } from "next-auth/react";

interface User {
  id?: number;
  username?: string;
  email?: string;
  name?:string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setIsAuthenticated?: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuth: () => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession(); // Get NextAuth session
  const router = useRouter();

  // Check authentication for both JWT & NextAuth
  const checkAuth = async (): Promise<boolean> => {
    try {
      if (session?.user) {
        setIsAuthenticated(true);
        setUser({
          email: session.user.email || "", // Ensure email exists
          username: session.user.username || session.user.email?.split("@")[0] || "User", // Use username, or fallback to email prefix
        });
        return true;
      }
      
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return false;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}accounts/verifyauth/`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        return true;
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }

    setIsAuthenticated(false);
    setUser(null);
    return false;
  };

  useEffect(() => {
    const verifyAuth = async () => {
      const isLoggedIn = await checkAuth();
      if (isLoggedIn) {
        router.push("/"); // Redirect to home if logged in
      } else {
        router.push("/"); // Redirect to home if not logged in
      }
    };
  
    verifyAuth();
  }, [session]); // Runs when session changes
  

  // Logout function
  const logout = () => {
    if (session) {
      signOut(); // Logout from Google/GitHub
    } else {
      localStorage.removeItem("access_token"); // Clear JWT
      setIsAuthenticated(false);
      setUser(null);
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, checkAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
