"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import Link from "next/link"; 

import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit, 
  Key, 
  Activity,
  Save,
  X,
  Eye,
  EyeOff,
  MessageCircle  
} from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState(null);

  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });

  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Activity State
  const [showActivity, setShowActivity] = useState(false);

  // Fetch Profile
  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/profile", {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);

        setEditData({
          name: data.user.name,
          email: data.user.email,
        });
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Edit Input Change
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  // Password Input Change
  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // Update Profile
  const handleEditProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setIsEditing(false);
        fetchProfile();
      }
    } catch (error) {
      console.log(error);
      alert("Profile update failed");
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      alert(data.message);

      if (response.ok) {
        setIsChangingPassword(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
        });
      }
    } catch (error) {
      console.log(error);
      alert("Password change failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />

      <div className="px-6 py-8 md:py-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Welcome Section - WITH CHAT BUTTON */}
          <motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="bg-gradient-to-r from-blue-200 to-indigo-400 rounded-2xl shadow-xl p-8 mb-8 text-white"
>
  <div className="flex justify-between items-start">
    <div>
      <h1 className="text-3xl md:text-4xl font-bold mb-2">
        Welcome Back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}!
      </h1>
      <p className="text-blue-100 text-lg">
        Manage your profile and account details here.
      </p>
    </div>
    
    {/* Chat Button */}
    <Link href="/chat">
      <button className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-5 py-3 rounded-xl font-semibold transition-all border border-white/30">
        <MessageCircle className="w-5 h-5" />
        <span>Open Chat</span>
      </button>
    </Link>
  </div>
</motion.div>


          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Profile Card - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  My Profile
                </h2>
              </div>

              {user ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="text-gray-800 font-medium">{user.name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email Address</p>
                      <p className="text-gray-800 font-medium">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Role</p>
                      <p className="text-gray-800 font-medium capitalize">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Joined Date</p>
                      <p className="text-gray-800 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-pulse">Loading profile...</div>
                </div>
              )}
            </motion.div>

            {/* Quick Actions - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Quick Actions
                </h2>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsEditing(true);
                    setIsChangingPassword(false);
                    setShowActivity(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Edit className="w-5 h-5" />
                  Edit Profile
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsChangingPassword(true);
                    setIsEditing(false);
                    setShowActivity(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Key className="w-5 h-5" />
                  Change Password
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowActivity(true);
                    setIsEditing(false);
                    setIsChangingPassword(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Activity className="w-5 h-5" />
                  View Activity
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Edit Profile Form - Enhanced */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Edit className="w-6 h-6 text-blue-600" />
                  Edit Profile
                </h2>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleEditProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                    placeholder="Enter Name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="Enter Email"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
                  >
                    <Save className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Change Password Form - Enhanced */}
          {isChangingPassword && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Key className="w-6 h-6 text-blue-600" />
                  Change Password
                </h2>
                <button
                  onClick={() => setIsChangingPassword(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Old Password
                  </label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      name="oldPassword"
                      value={passwordData.oldPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter Old Password"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Enter New Password"
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
                  >
                    <Save className="w-5 h-5" />
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* View Activity - Enhanced */}
          {showActivity && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-emerald-600" />
                  Recent Activity
                </h2>
                <button
                  onClick={() => setShowActivity(false)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { action: "Logged in successfully", time: "2 minutes ago", icon: "🔐" },
                  { action: "Viewed dashboard", time: "5 minutes ago", icon: "📊" },
                  { action: "Updated profile information", time: "1 hour ago", icon: "✏️" },
                  { action: "Changed password", time: "2 days ago", icon: "🔑" },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-800 font-medium">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}