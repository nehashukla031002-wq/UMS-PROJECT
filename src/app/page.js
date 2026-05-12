"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Users, Shield, LayoutDashboard, KeyRound, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* 🔵 SIDEBAR - FIXED */}
      <div className="w-[260px] hidden md:flex flex-col bg-gradient-to-b from-blue-500 to-indigo-600 text-white shadow-xl h-full overflow-y-auto">
        
        <div className="flex flex-col h-full px-6 py-8">
          <div className="mt-6">
            {/* Logo with icon */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                UserManager
              </h1>
            </div>

            <p className="text-sm text-blue-100 mb-8 leading-relaxed border-l-2 border-white/30 pl-4">
              Complete user management solution with secure authentication.
            </p>

            {/* Navigation Items */}
            <div className="space-y-2 text-sm">
              {[
                { name: "Users", icon: Users },
                { name: "Authentication", icon: Shield },
                { name: "Dashboard", icon: LayoutDashboard },
                { name: "Recovery", icon: KeyRound }
              ].map((item) => (
                <div
                  key={item.name}
                  className="group flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                >
                  <item.icon className="w-4 h-4 text-white/80 group-hover:scale-110 transition-transform" />
                  <span className="text-white/90 group-hover:text-white">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="mt-auto text-center text-xs text-blue-100 border-t border-white/20 pt-4 pb-2">
            <p>© 2026 UserManager</p>
            <p className="text-[10px] mt-1 opacity-75">v2.0.0</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-8 md:py-12">
          
          {/* HERO SECTION */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="inline-block mb-6"
            >
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 rounded-2xl shadow-lg">
                <Users className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              User Management System
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
              Secure, scalable, and modern user management solution for your applications.
            </p>

            {/* 🔥 BUTTONS - PERFECTLY ALIGNED */}
            <div className="flex justify-center gap-4 mt-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-sm font-medium border border-blue-500 text-blue-600 
                  transition-all duration-300 hover:bg-blue-50 hover:border-blue-600"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* FEATURES GRID */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "👥 User Control",
                desc: "Add, edit and delete users easily with our intuitive interface.",
                gradient: "from-blue-500 to-blue-600"
              },
              {
                title: "🔐 Secure Auth",
                desc: "Login, register and password reset with enterprise-grade security.",
                gradient: "from-emerald-500 to-emerald-600"
              },
              {
                title: "⚙️ Admin Panel",
                desc: "Manage roles, permissions and full system access control.",
                gradient: "from-purple-500 to-purple-600"
              },
            ].map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white p-6 rounded-xl shadow-md 
                hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className={`h-1 w-12 bg-gradient-to-r ${card.gradient} rounded-full mb-4 group-hover:w-20 transition-all duration-300`} />
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ABOUT SECTION */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-2xl mx-auto text-center mt-16 mb-8"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Built with Modern Tech
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Built using Next.js 14, Prisma ORM, and PostgreSQL database, 
                this system provides secure authentication and role-based access 
                with a clean and modern interface.
              </p>
              
              {/* Tech Stack Tags */}
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind"].map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-white/80 rounded-md text-xs text-gray-600 shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

        </div>

        {/* MAIN FOOTER - FIXED */}
        <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-3 text-center">
          <p className="text-gray-400 text-xs">
            © 2026 User Management System. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}