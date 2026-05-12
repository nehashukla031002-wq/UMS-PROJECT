'use client';

import { useState, useEffect } from 'react';
import RealChat from '@/components/RealChat';
import GroupChat from '@/components/GroupChat';
import { MessageCircle, Users } from 'lucide-react';

export default function ChatPage() {
  const [activeTab, setActiveTab] = useState('private');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) setCurrentUserId(data.user.id);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  if (!currentUserId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('private')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
              activeTab === 'private'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle className="h-5 w-5" />
            Chats
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 flex items-center justify-center gap-2 py-4 font-medium transition-all ${
              activeTab === 'groups'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users className="h-5 w-5" />
            Groups
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'private' ? (
          <RealChat />
        ) : (
          <GroupChat currentUserId={currentUserId} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}