"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Home, LogIn, UserPlus, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in (you can adjust this logic)
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout");
      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      alert("Logout failed");
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              UserManager
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex gap-1 md:gap-2 items-center">
            <Link
              href="/"
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>

            {!isLoggedIn ? (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>

                <Link
                  href="/register"
                  className="flex items-center gap-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all duration-300 text-sm font-medium ml-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">Register</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-300 text-sm font-medium"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-300 text-sm font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}