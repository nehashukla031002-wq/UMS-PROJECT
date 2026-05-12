"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgot = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("OTP sent to your email ");

      // next step page
      setTimeout(() => {
        router.push(`/reset-password?email=${email}`);
      }, 1500);

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
            Forgot Password
          </h1>

          <p className="text-center text-gray-500 mb-6">
            Enter your email to receive OTP
          </p>

          <form onSubmit={handleForgot} className="space-y-5">

            <div>
              <label className="text-sm text-gray-600">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 mt-1 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}