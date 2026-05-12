"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // email URL se auto fill
  useEffect(() => {
    const emailFromURL = params.get("email");
    if (emailFromURL) {
      setFormData((prev) => ({
        ...prev,
        email: emailFromURL,
      }));
    }
  }, [params]);

  // input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // submit
  const handleReset = async (e) => {
    e.preventDefault();

    // validation
    if (!formData.email || !formData.otp || !formData.newPassword) {
      toast.error("All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
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

      toast.success("Password reset successful ");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
        
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Reset Password
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Enter OTP and new password
          </p>

          <form onSubmit={handleReset} className="space-y-5">

            {/* Email */}
            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 bg-gray-100"
              />
            </div>

            {/* OTP */}
            <div>
              <label className="text-sm text-gray-600">OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                value={formData.otp}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="text-sm text-gray-600">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}