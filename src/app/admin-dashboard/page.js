"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users", {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      setUsers(data.users);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 DELETE USER
  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("User deleted");

      // instant UI update
      setUsers(users.filter((user) => user.id !== id));

    } catch (error) {
      console.log(error);
      toast.error("Delete failed");
    }
  };

  // 🔹 UPDATE USER
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `/api/admin/users/${editingUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(editingUser),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return;
      }

      toast.success("User updated");

      setEditingUser(null);
      fetchUsers();

    } catch (error) {
      console.log(error);
      toast.error("Update failed");
    }
  };

  return (
    <div>
      <Navbar />

      <div className="min-h-screen bg-gray-100 px-4 py-8">
        <div className="max-w-4xl mx-auto">

          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
            <h1 className="text-2xl font-bold">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 text-sm">
              Manage all users
            </p>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-xl shadow-sm p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-600">
                  <th className="text-left py-2">Name</th>
                  <th className="text-left py-2">Email</th>
                  <th className="text-left py-2">Role</th>
                  <th className="text-left py-2">Status</th>
                  <th className="text-left py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">{user.role}</td>
                    <td className="py-2">{user.status}</td>

                    <td className="py-2 flex gap-2">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EDIT FORM */}
          {editingUser && (
            <div className="mt-6 bg-white p-5 rounded-xl shadow-sm">
              <h2 className="text-lg font-semibold mb-3">
                Edit User
              </h2>

              <form
                onSubmit={handleUpdate}
                className="space-y-3"
              >
                <input
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      name: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Name"
                />

                <input
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      email: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                  placeholder="Email"
                />

                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      role: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>

                <select
                  value={editingUser.status}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      status: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="SUSPENDED">SUSPENDED</option>
                </select>

                <div className="flex gap-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Save
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}