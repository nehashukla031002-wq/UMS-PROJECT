"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();


      if (!res.ok) {
        toast.error(data.message);
        return;
      }
  
      toast.success("Registration successfull");
  
      setTimeout(() => {
        
        router.push("/login");
      }, 1500);

      

    } catch (error) {
      console.log(error);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
  
  <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

    <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">
      Create Account
    </h1>

    <p className="text-center text-gray-500 mb-6 text-sm">
      Join us today 
    </p>

    {/* Error */}
    {error && (
      <div className="bg-red-100 text-red-600 p-2 rounded-md mb-4 text-sm text-center">
        {error}
      </div>
    )}

    <form onSubmit={handleRegister} className="space-y-4">

      {/* Name */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          placeholder="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="example@gmail.com"
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
      </div>

      {/* Password */}
      <div>
        <label className="text-sm font-medium text-gray-700">
          Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 text-xs hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Enter Confirm Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 mt-1 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-gray-500 text-xs hover:text-gray-700"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>
      </div>

      {/* Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
      >
        {loading ? "Creating Account..." : "Register"}
      </button>
    </form>

    {/* Footer */}
    <p className="text-center text-sm text-gray-600 mt-5">
      Already have an account?{" "}
      <Link
        href="/login"
        className="text-blue-600 font-medium hover:underline"
      >
        Login
      </Link>
    </p>

  </div>
</div>    
</div>
  );
}