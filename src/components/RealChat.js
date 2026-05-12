// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { io } from "socket.io-client";
// import toast from 'react-hot-toast';
// import { Send, Users, MessageCircle, LogOut, MoreVertical, Paperclip } from 'lucide-react';

// export default function RealChat() {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);


//   const toastShownRef = useRef({
//     welcome: false,
//     connected: false,
//     disconnected: false
//   });

//   // Get logged in user
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const res = await fetch('/api/auth/me');
//         const data = await res.json();
        
//         if (data.user) {
//           setCurrentUserId(data.user.id);
//           if (!toastShownRef.current.welcome) {
//             toastShownRef.current.welcome = true;
//             // toast.success(`Welcome ${data.user.name}!`);
//           }
//         } else {
//           window.location.href = '/login';
//           return;
//         }
        
        
//         try {
//           const res = await fetch('/api/users');
//           const data = await res.json();
//           if (data.success && data.users.length > 0) {
//             setUsers(data.users);
//           }
//         } catch (error) {
//           toast.error('Failed to load users');
//         } finally {
//           setLoading(false);
//         }
        
//       } catch (error) {
//         window.location.href = '/login';
//         return;
//       }
//     };
    
//     getCurrentUser();
// }, []);
      
//   //     try {
//   //       const res = await fetch('/api/users');
//   //       const data = await res.json();
//   //       if (data.success && data.users.length > 0) {
//   //         setUsers(data.users);
//   //       }
//   //     } catch (error) {
//   //       toast.error('Failed to load users');
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };
    
//   //   getCurrentUser();
//   // }, []);

//   // Socket connection - FIXED with proper dependencies
//   useEffect(() => {
//     if (!currentUserId) return;
    
//     // const newSocket = io("http://localhost:3001", {
//     //   transports: ["websocket"]
//     // });
    
//     const newSocket = io("http://192.168.0.239:3001", {
//       transports: ["websocket"]
//     });
//     setSocket(newSocket);
    
//     newSocket.on('connect', () => {
//       setIsConnected(true);
//       newSocket.emit('user-auth', currentUserId);
//       if (!toastShownRef.current.connected) {
//         toastShownRef.current.connected = true;
//         // toast.success('Connected to chat');
//       }
//     });
    
//     newSocket.on('users-online', (onlineUserIds) => {
//       setOnlineUsers(onlineUserIds);
//     });
    

//     // FIX 1: Handle incoming messages
//     newSocket.on('new-message', (message) => {
//       console.log('New message:', message);

//       // Update messages if this is for selected user
//       if (selectedUser && Number(selectedUser.id) === Number(message.fromUserId)) {
//         setMessages(prev => [...prev, message]);
//       }
//       // Refresh users list to show latest message
//       fetchUsers();
//       toast.success(`New message`);
//     });
    
//     // FIX 2: Handle sent message confirmation
//     newSocket.on('message-sent', (message) => {
//       console.log('Message sent:', message);
//       setMessages(prev => [...prev, message]);
//     });
    
//     newSocket.on('chat-history', (history) => {
//       console.log(' Chat history:', history.length);
//       setMessages(history);
//     });
    
//     newSocket.on('disconnect', () => {
//       setIsConnected(false);
//       if (!toastShownRef.current.disconnected) {
//         toastShownRef.current.disconnected = true;
//         // toast.error('Disconnected');
//       }
//     });
    
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [currentUserId, selectedUser]); // FIX 3: Added selectedUser to dependencies
  
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('/api/users');
//       const data = await res.json();
//       if (data.success) {
//         setUsers(data.users);
//       }
//     } catch (error) {
//       console.error('Error refreshing users:', error);
//     }
//   };
  
//   // Load chat history when selected user changes
//   useEffect(() => {
//     if (socket && selectedUser && isConnected) {
//       setMessages([]);
//       socket.emit('get-chat-history', selectedUser.id);
//     }
//   }, [selectedUser, socket, isConnected]);
  
//   // Auto-scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
  
//   const sendMessage = () => {
//     if (!socket || !messageInput.trim() || !selectedUser) {
//       toast.error('Cannot send message');
//       return;
//     }
    
//     const content = messageInput.trim();
//     console.log(' Sending:', { toUserId: selectedUser.id, content });
    
//     // Clear input immediately
//     setMessageInput('');
    
//     // Send to server
//     socket.emit('send-message', {
//       toUserId: selectedUser.id,
//       content: content
//     });
    
//     inputRef.current?.focus();
//   };
  
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };
  
//   const isUserOnline = (userId) => onlineUsers.includes(Number(userId));
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
//           <p className="mt-4 text-white text-lg font-medium">Loading chat...</p>
//         </div>
//       </div>
//     );
//   }
  
//   const currentUser = users.find(u => u.id === currentUserId);
  
//   return (
//     <div className="flex h-full overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Sidebar */}
//       <div className="w-80 bg-white shadow-xl flex flex-col">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold"> ChatApp</h1>
//               <p className="text-sm text-blue-100 mt-1">
//                 {isConnected ? ' Online' : ' Offline'}
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//               <span className="text-lg font-semibold">
//                 {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </span>
//             </div>
//           </div>
//           <div className="mt-3 text-sm">
//             <p className="font-medium">{currentUser?.name}</p>
//             <p className="text-blue-100 text-xs">{currentUser?.email}</p>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-3 bg-gray-50 border-b">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Users className="h-4 w-4" />
//               <span className="text-xs font-semibold">CONTACTS</span>
//             </div>
//           </div>
          
//           {users.filter(u => u.id !== currentUserId).map(user => (
//             <button
//               key={user.id}
//               onClick={() => setSelectedUser(user)}
//               className={`w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b hover:bg-gray-50 ${
//                 selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//               }`}
//             >
//               <div className="relative">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
//                   isUserOnline(user.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
//                 }`}>
//                   {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                 </div>
//                 {isUserOnline(user.id) && (
//                   <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
//                 )}
//               </div>
//               <div className="flex-1 text-left">
//                 <div className="font-semibold text-gray-800">{user.name}</div>
//                 <div className="text-xs text-gray-500">
//                   {isUserOnline(user.id) ? 'Online' : 'Offline'}
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>
        
//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </div>
      
//       {/* Chat Area */}
//       {selectedUser ? (
//         <div className="flex-1 flex flex-col bg-gray-50">
//           <div className="bg-white border-b px-6 py-4 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
//                 isUserOnline(selectedUser.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
//               }`}>
//                 {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//               <div>
//                 <h2 className="font-semibold text-gray-800 text-lg">{selectedUser.name}</h2>
//                 <p className="text-sm text-gray-500">
//                   {isUserOnline(selectedUser.id) ? ' Online' : '⚫ Offline'}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-6 min-h-0">
//             {messages.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
//                   <MessageCircle className="h-10 w-10 text-blue-500" />
//                 </div>
//                 <p className="text-gray-500 text-lg font-medium">No messages yet</p>
//                 <p className="text-sm text-gray-400 mt-1">Say hello to {selectedUser.name}</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-w-3xl mx-auto">
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={msg.id || idx}
//                     className={`flex ${msg.fromUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div
//                       className={`max-w-md px-4 py-2 rounded-2xl ${
//                         msg.fromUserId === currentUserId
//                           ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
//                           : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
//                       }`}
//                     >
//                       <p className="text-sm break-words">{msg.content}</p>
//                       <p className={`text-xs mt-1 ${
//                         msg.fromUserId === currentUserId ? 'text-blue-100' : 'text-gray-400'
//                       }`}>
//                         {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//                 <div ref={messagesEndRef} />
//               </div>
//             )}
//           </div>
          
//           <div className="bg-white border-t p-4 shadow-lg">
//             <div className="flex gap-2 max-w-4xl mx-auto">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                 placeholder={`Message ${selectedUser.name}...`}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                 disabled={!isConnected}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!messageInput.trim() || !isConnected}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
//               >
//                 <Send className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col items-center justify-center">
//           <div className="text-center">
//             <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//               <MessageCircle className="h-16 w-16 text-blue-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to ChatApp</h2>
//             <p className="text-gray-400">Select a contact to start messaging</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import { Send, Users, MessageCircle, LogOut } from 'lucide-react';

export default function RealChat() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCounts, setUnreadCounts] = useState({});
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null); // ✅ NEW: Reference for messages container

  const toastShownRef = useRef({
    welcome: false,
    connected: false,
    disconnected: false
  });

  // Get logged in user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        
        if (data.user) {
          setCurrentUserId(data.user.id);
        } else {
          window.location.href = '/login';
          return;
        }
        
        try {
          const res = await fetch('/api/users');
          const data = await res.json();
          if (data.success && data.users.length > 0) {
            setUsers(data.users);
          }
        } catch (error) {
          toast.error('Failed to load users');
        } finally {
          setLoading(false);
        }
        
      } catch (error) {
        window.location.href = '/login';
        return;
      }
    };
    
    getCurrentUser();
  }, []);

  // Socket connection
  useEffect(() => {
    if (!currentUserId) return;
    
    const newSocket = io("http://192.168.0.239:3001", {
      transports: ["websocket"]
    });
    setSocket(newSocket);
    
    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user-auth', currentUserId);
    });
    
    newSocket.on('users-online', (onlineUserIds) => {
      setOnlineUsers(onlineUserIds);
    });
    
    newSocket.on('new-message', (message) => {
      console.log('New message:', message);

      if (selectedUser && Number(selectedUser.id) === Number(message.fromUserId)) {
        setMessages(prev => [...prev, message]);
        setUnreadCounts(prev => ({ ...prev, [message.fromUserId]: 0 }));
      } else {
        setUnreadCounts(prev => ({
          ...prev,
          [message.fromUserId]: (prev[message.fromUserId] || 0) + 1
        }));
      }
      
      updateUserLastMessage(message.fromUserId, message.content, message.createdAt);
      toast.success(`New message`);
    });
    
    newSocket.on('message-sent', (message) => {
      console.log('Message sent:', message);
      setMessages(prev => [...prev, message]);
      updateUserLastMessage(message.toUserId, message.content, message.createdAt);
    });
    
    newSocket.on('chat-history', (history) => {
      console.log('Chat history:', history.length);
      setMessages(history);
      // ✅ FIX: Scroll to bottom after loading messages
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
      }, 100);
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });
    
    return () => {
      newSocket.disconnect();
    };
  }, [currentUserId, selectedUser]);
  
  const updateUserLastMessage = (userId, content, timestamp) => {
    setUsers(prevUsers => {
      const updatedUsers = prevUsers.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            lastMessage: content,
            lastMessageTime: timestamp || new Date().toISOString()
          };
        }
        return user;
      });
      
      return updatedUsers.sort((a, b) => {
        const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
        const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
        return timeB - timeA;
      });
    });
  };
  
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) {
        const sortedUsers = data.users.sort((a, b) => {
          const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
          const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
          return timeB - timeA;
        });
        setUsers(sortedUsers);
      }
    } catch (error) {
      console.error('Error refreshing users:', error);
    }
  };
  
  // Load chat history when selected user changes
  useEffect(() => {
    if (socket && selectedUser && isConnected) {
      setMessages([]);
      socket.emit('get-chat-history', selectedUser.id);
      setUnreadCounts(prev => ({ ...prev, [selectedUser.id]: 0 }));
    }
  }, [selectedUser, socket, isConnected]);
  
  // ✅ FIX: Better auto-scroll that doesn't hide header
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages]);
  
  const sendMessage = () => {
    if (!socket || !messageInput.trim() || !selectedUser) {
      toast.error('Cannot send message');
      return;
    }
    
    const content = messageInput.trim();
    console.log('Sending:', { toUserId: selectedUser.id, content });
    
    setMessageInput('');
    socket.emit('send-message', {
      toUserId: selectedUser.id,
      content: content
    });
    
    inputRef.current?.focus();
  };
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  
  const isUserOnline = (userId) => onlineUsers.includes(Number(userId));
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg font-medium">Loading chat...</p>
        </div>
      </div>
    );
  }
  
  const currentUser = users.find(u => u.id === currentUserId);
  
  const sortedUsers = [...users.filter(u => u.id !== currentUserId)].sort((a, b) => {
    const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
    const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
    return timeB - timeA;
  });
  
  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">ChatApp</h1>
              <p className="text-sm text-blue-100 mt-1">
                {isConnected ? '🟢 Online' : '⚫ Offline'}
              </p>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="mt-3 text-sm">
            <p className="font-medium">{currentUser?.name}</p>
            <p className="text-blue-100 text-xs">{currentUser?.email}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold">CONTACTS</span>
            </div>
          </div>
          
          {sortedUsers.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b hover:bg-gray-50 ${
                selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                  isUserOnline(user.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                }`}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                {isUserOnline(user.id) && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-gray-800">{user.name}</div>
                  {unreadCounts[user.id] > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {unreadCounts[user.id]}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {isUserOnline(user.id) ? '🟢 Online' : '⚫ Offline'}
                </div>
                {user.lastMessage && (
                  <div className="text-xs text-gray-400 truncate mt-1 max-w-[180px]">
                    {user.lastMessage.length > 30 ? user.lastMessage.substring(0, 30) + '...' : user.lastMessage}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
      
      {/* ✅ FIXED: Chat Area with proper fixed header */}
      {selectedUser ? (
        <div className="flex-1 flex flex-col bg-gray-50 h-full">
          {/* ✅ Header - Fixed at top, never hides */}
          <div className="bg-white border-b px-6 py-4 shadow-sm flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
                isUserOnline(selectedUser.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">{selectedUser.name}</h2>
                <p className="text-sm text-gray-500">
                  {isUserOnline(selectedUser.id) ? '🟢 Online' : '⚫ Offline'}
                </p>
              </div>
            </div>
          </div>
          
          {/* ✅ Messages Container - Only this scrolls */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto" 
          >
            <div className="p-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-10 w-10 text-blue-500" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Say hello to {selectedUser.name}</p>
                </div>
              ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                  {messages.map((msg, idx) => (
                    <div
                      key={msg.id || idx}
                      className={`flex ${msg.fromUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2 rounded-2xl ${
                          msg.fromUserId === currentUserId
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm shadow-md'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.fromUserId === currentUserId ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
          
          {/* ✅ Input Field - Fixed at bottom */}
          <div className="bg-white border-t p-4 shadow-lg flex-shrink-0">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message ${selectedUser.name}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageCircle className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to ChatApp</h2>
            <p className="text-gray-400">Select a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}


// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { io } from "socket.io-client";
// import toast from 'react-hot-toast';
// import { Send, Users, MessageCircle, LogOut } from 'lucide-react';

// export default function RealChat() {
//   const [currentUserId, setCurrentUserId] = useState(null);
//   const [users, setUsers] = useState([]);
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [onlineUsers, setOnlineUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   const toastShownRef = useRef({
//     welcome: false,
//     connected: false,
//     disconnected: false
//   });

//   // Get logged in user
//   useEffect(() => {
//     const getCurrentUser = async () => {
//       try {
//         const res = await fetch('/api/auth/me');
//         const data = await res.json();
        
//         if (data.user) {
//           setCurrentUserId(data.user.id);
//         } else {
//           window.location.href = '/login';
//           return;
//         }
        
//         try {
//           const res = await fetch('/api/users');
//           const data = await res.json();
//           if (data.success && data.users.length > 0) {
//             setUsers(data.users);
//           }
//         } catch (error) {
//           toast.error('Failed to load users');
//         } finally {
//           setLoading(false);
//         }
        
//       } catch (error) {
//         window.location.href = '/login';
//         return;
//       }
//     };
    
//     getCurrentUser();
//   }, []);

//   // Socket connection
//   useEffect(() => {
//     if (!currentUserId) return;
    
//     const newSocket = io("http://192.168.0.239:3001", {
//       transports: ["websocket"]
//     });
//     setSocket(newSocket);
    
//     newSocket.on('connect', () => {
//       setIsConnected(true);
//       newSocket.emit('user-auth', currentUserId);
//     });
    
//     newSocket.on('users-online', (onlineUserIds) => {
//       setOnlineUsers(onlineUserIds);
//     });
    
//     newSocket.on('new-message', (message) => {
//       console.log('New message:', message);

//       if (selectedUser && Number(selectedUser.id) === Number(message.fromUserId)) {
//         setMessages(prev => [...prev, message]);
//         setUnreadCounts(prev => ({ ...prev, [message.fromUserId]: 0 }));
//       } else {
//         setUnreadCounts(prev => ({
//           ...prev,
//           [message.fromUserId]: (prev[message.fromUserId] || 0) + 1
//         }));
//       }
      
//       updateUserLastMessage(message.fromUserId, message.content, message.createdAt);
//       toast.success(`New message`);
//     });
    
//     newSocket.on('message-sent', (message) => {
//       console.log('Message sent:', message);
//       setMessages(prev => [...prev, message]);
//       updateUserLastMessage(message.toUserId, message.content, message.createdAt);
//     });
    
//     newSocket.on('chat-history', (history) => {
//       console.log('Chat history:', history.length);
//       setMessages(history);
//     });
    
//     newSocket.on('disconnect', () => {
//       setIsConnected(false);
//     });
    
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [currentUserId, selectedUser]);
  
//   const updateUserLastMessage = (userId, content, timestamp) => {
//     setUsers(prevUsers => {
//       const updatedUsers = prevUsers.map(user => {
//         if (user.id === userId) {
//           return {
//             ...user,
//             lastMessage: content,
//             lastMessageTime: timestamp || new Date().toISOString()
//           };
//         }
//         return user;
//       });
      
//       return updatedUsers.sort((a, b) => {
//         const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
//         const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
//         return timeB - timeA;
//       });
//     });
//   };
  
//   const fetchUsers = async () => {
//     try {
//       const res = await fetch('/api/users');
//       const data = await res.json();
//       if (data.success) {
//         const sortedUsers = data.users.sort((a, b) => {
//           const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
//           const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
//           return timeB - timeA;
//         });
//         setUsers(sortedUsers);
//       }
//     } catch (error) {
//       console.error('Error refreshing users:', error);
//     }
//   };
  
//   // Load chat history when selected user changes
//   useEffect(() => {
//     if (socket && selectedUser && isConnected) {
//       setMessages([]);
//       socket.emit('get-chat-history', selectedUser.id);
//       setUnreadCounts(prev => ({ ...prev, [selectedUser.id]: 0 }));
//     }
//   }, [selectedUser, socket, isConnected]);
  
//   // Auto-scroll to bottom when new message arrives
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);
  
//   const sendMessage = () => {
//     if (!socket || !messageInput.trim() || !selectedUser) {
//       toast.error('Cannot send message');
//       return;
//     }
    
//     const content = messageInput.trim();
//     console.log('Sending:', { toUserId: selectedUser.id, content });
    
//     setMessageInput('');
//     socket.emit('send-message', {
//       toUserId: selectedUser.id,
//       content: content
//     });
    
//     inputRef.current?.focus();
//   };
  
//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     window.location.href = '/login';
//   };
  
//   const isUserOnline = (userId) => onlineUsers.includes(Number(userId));
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mx-auto"></div>
//           <p className="mt-4 text-white text-lg font-medium">Loading chat...</p>
//         </div>
//       </div>
//     );
//   }
  
//   const currentUser = users.find(u => u.id === currentUserId);
  
//   const sortedUsers = [...users.filter(u => u.id !== currentUserId)].sort((a, b) => {
//     const timeA = a.lastMessageTime ? new Date(a.lastMessageTime) : new Date(0);
//     const timeB = b.lastMessageTime ? new Date(b.lastMessageTime) : new Date(0);
//     return timeB - timeA;
//   });
  
//   return (
//     <div className="flex h-screen flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* Sidebar */}
//       <div className="w-80 bg-white shadow-xl flex flex-col h-full">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-2xl font-bold">ChatApp</h1>
//               <p className="text-sm text-blue-100 mt-1">
//                 {isConnected ? '🟢 Online' : '⚫ Offline'}
//               </p>
//             </div>
//             <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
//               <span className="text-lg font-semibold">
//                 {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
//               </span>
//             </div>
//           </div>
//           <div className="mt-3 text-sm">
//             <p className="font-medium">{currentUser?.name}</p>
//             <p className="text-blue-100 text-xs">{currentUser?.email}</p>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-3 bg-gray-50 border-b">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Users className="h-4 w-4" />
//               <span className="text-xs font-semibold">CONTACTS</span>
//             </div>
//           </div>
          
//           {sortedUsers.map(user => (
//             <button
//               key={user.id}
//               onClick={() => setSelectedUser(user)}
//               className={`w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b hover:bg-gray-50 ${
//                 selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//               }`}
//             >
//               <div className="relative">
//                 <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
//                   isUserOnline(user.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
//                 }`}>
//                   {user.name?.charAt(0)?.toUpperCase() || 'U'}
//                 </div>
//                 {isUserOnline(user.id) && (
//                   <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
//                 )}
//               </div>
//               <div className="flex-1 text-left">
//                 <div className="flex items-center justify-between">
//                   <div className="font-semibold text-gray-800">{user.name}</div>
//                   {unreadCounts[user.id] > 0 && (
//                     <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
//                       {unreadCounts[user.id]}
//                     </span>
//                   )}
//                 </div>
//                 <div className="text-xs text-gray-500">
//                   {isUserOnline(user.id) ? '🟢 Online' : '⚫ Offline'}
//                 </div>
//                 {user.lastMessage && (
//                   <div className="text-xs text-gray-400 truncate mt-1 max-w-[180px]">
//                     {user.lastMessage.length > 30 ? user.lastMessage.substring(0, 30) + '...' : user.lastMessage}
//                   </div>
//                 )}
//               </div>
//             </button>
//           ))}
//         </div>
        
//         <div className="p-4 border-t">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200"
//           >
//             <LogOut className="h-4 w-4" />
//             <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </div>
      
//       {/* Chat Area - Header Fixed, Messages Scroll */}
//       {selectedUser ? (
//         <div className="flex-1 flex flex-col bg-gray-50 h-full">
//           {/* ✅ HEADER - Fixed at top, never hides */}
//           <div className="bg-white border-b px-6 py-4 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ${
//                 isUserOnline(selectedUser.id) ? 'bg-gradient-to-br from-green-400 to-green-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
//               }`}>
//                 {selectedUser.name?.charAt(0)?.toUpperCase() || 'U'}
//               </div>
//               <div>
//                 <h2 className="font-semibold text-gray-800 text-lg">{selectedUser.name}</h2>
//                 <p className="text-sm text-gray-500">
//                   {isUserOnline(selectedUser.id) ? '🟢 Online' : '⚫ Offline'}
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* ✅ MESSAGES - Only this area scrolls */}
//           <div className="flex-1 overflow-y-auto">
//             <div className="p-6">
//               {messages.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center h-full">
//                   <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
//                     <MessageCircle className="h-10 w-10 text-blue-500" />
//                   </div>
//                   <p className="text-gray-500 text-lg font-medium">No messages yet</p>
//                   <p className="text-sm text-gray-400 mt-1">Say hello to {selectedUser.name}</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4 max-w-3xl mx-auto">
//                   {messages.map((msg, idx) => (
//                     <div
//                       key={msg.id || idx}
//                       className={`flex ${msg.fromUserId === currentUserId ? 'justify-end' : 'justify-start'}`}
//                     >
//                       <div
//                         className={`max-w-md px-4 py-2 rounded-2xl ${
//                           msg.fromUserId === currentUserId
//                             ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm'
//                             : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
//                         }`}
//                       >
//                         <p className="text-sm break-words">{msg.content}</p>
//                         <p className={`text-xs mt-1 ${
//                           msg.fromUserId === currentUserId ? 'text-blue-100' : 'text-gray-400'
//                         }`}>
//                           {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
//                         </p>
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={messagesEndRef} />
//                 </div>
//               )}
//             </div>
//           </div>
          
//           {/* ✅ INPUT - Fixed at bottom */}
//           <div className="bg-white border-t p-4 shadow-lg">
//             <div className="flex gap-2 max-w-4xl mx-auto">
//               <input
//                 ref={inputRef}
//                 type="text"
//                 value={messageInput}
//                 onChange={(e) => setMessageInput(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//                 placeholder={`Message ${selectedUser.name}...`}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                 disabled={!isConnected}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!messageInput.trim() || !isConnected}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
//               >
//                 <Send className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col items-center justify-center">
//           <div className="text-center">
//             <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//               <MessageCircle className="h-16 w-16 text-blue-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-700 mb-2">Welcome to ChatApp</h2>
//             <p className="text-gray-400">Select a contact to start messaging</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }