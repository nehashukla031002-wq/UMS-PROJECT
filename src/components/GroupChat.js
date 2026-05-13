// 'use client';

// import { useEffect, useState, useRef } from 'react';
// import { io } from "socket.io-client";
// import toast from 'react-hot-toast';
// import { Send, Users, Plus, X, LogOut, ChevronDown, MessageCircle } from 'lucide-react';

// export default function GroupChat({ currentUserId, onLogout }) {
//   const [groups, setGroups] = useState([]);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showMembersModal, setShowMembersModal] = useState(false);
//   const [allUsers, setAllUsers] = useState([]);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);

//   // Fetch groups and users
//   useEffect(() => {
//     fetchGroups();
//     fetchAllUsers();
//   }, []);

// // Socket connection
//   useEffect(() => {
//     if (!currentUserId) return;
    
//     console.log("Connecting to socket server...");
//     // const newSocket = io("http://localhost:3001", {
//     //   transports: ["websocket"]
//     // });
//     const newSocket = io("http://192.168.0.239:3001", {
//       transports: ["websocket"]
//     });
    
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log("Socket connected!");
//       setIsConnected(true);
//       newSocket.emit('user-auth', currentUserId);
//     });


// //   useEffect(() => {
// //     if (!currentUserId) return;
    
// //     // ✅ Dynamic URL - current browser ke hostname ko use karega
// //     const socketUrl = `http://${window.location.hostname}:3001`;
// //     console.log("🔌 Connecting to socket server:", socketUrl);
    
// //     const newSocket = io(socketUrl, {
// //       transports: ["websocket"]
// //     });
    
// //     setSocket(newSocket);

// //     newSocket.on('connect', () => {
// //       console.log("Socket connected!");
// //       setIsConnected(true);
// //       newSocket.emit('user-auth', currentUserId);
// //     });
    
// //     newSocket.on('connect_error', (error) => {
// //       console.error("Socket connection error:", error.message);
// //     });
    
// //     // Cleanup function
// //     return () => {
// //       newSocket.disconnect();
// //     };
// // }, [currentUserId]);

//   //  Listen for new group messages - WITH DUPLICATE CHECK
//   newSocket.on('new-group-message', (message) => {
//       console.log(" NEW MESSAGE RECEIVED:", message);
      
//       if (selectedGroup && selectedGroup.id === message.groupId) {
//         setMessages(prev => {
//           // Check if message already exists (avoid duplicates)
//           const exists = prev.some(m => m.id === message.id);
//           if (!exists) {
//             console.log(" Adding new message, total:", prev.length + 1);
//             return [...prev, message];
//           }
//           console.log(" Duplicate ignored, message ID:", message.id);
//           return prev;
//         });
//       }
      
//       fetchGroups();
//     });

//     newSocket.on('connect_error', (err) => {
//       console.error("Socket error:", err);
//     });

//     return () => {
//       console.log("🔌 Disconnecting socket");
//       newSocket.disconnect();
//     };
//   }, [currentUserId, selectedGroup]);

//   // Join group room when selected
//   useEffect(() => {
//     if (socket && selectedGroup && isConnected) {
//       console.log(`Joining group room: ${selectedGroup.id}`);
//       socket.emit('join-group', selectedGroup.id);
//       loadMessages(selectedGroup.id);
      
//       return () => {
//         if (socket && selectedGroup) {
//           console.log(` Leaving group room: ${selectedGroup.id}`);
//           socket.emit('leave-group', selectedGroup.id);
//         }
//       };
//     }
//   }, [selectedGroup, socket, isConnected]);

//   const fetchGroups = async () => {
//     try {
//       const res = await fetch('/api/groups');
//       const data = await res.json();
//       if (data.success) {
//         setGroups(data.groups);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const fetchAllUsers = async () => {
//     try {
//       const res = await fetch('/api/users');
//       const data = await res.json();
//       if (data.success) setAllUsers(data.users);
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   const loadMessages = async (groupId) => {
//     try {
//       const res = await fetch(`/api/groups/${groupId}/messages`);
//       const data = await res.json();
//       if (data.success) {
//         setMessages(data.messages);
//         console.log(`Loaded ${data.messages.length} messages`);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     }
//   };

//   // FIXED: Send message - NO OPTIMISTIC UPDATE
//   const sendMessage = () => {
//     if (!socket || !messageInput.trim() || !selectedGroup) {
//       toast.error("Cannot send message");
//       return;
//     }
    
//     const content = messageInput.trim();
//     const groupId = selectedGroup.id;
    
//     console.log(` Sending message to group ${groupId}: ${content}`);
    
//     setMessageInput('');
//     socket.emit('send-group-message', {
//       groupId: groupId,
//       content: content
//     });
    
//     inputRef.current?.focus();
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 50);
//   };

//   const createGroup = async (name, memberIds) => {
//     try {
//       const res = await fetch('/api/groups', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name, memberIds })
//       });
      
//       if (res.ok) {
//         toast.success('Group created!');
//         fetchGroups();
//         setShowCreateModal(false);
//       } else {
//         toast.error('Failed to create group');
//       }
//     } catch (error) {
//       toast.error('Failed to create group');
//     }
//   };

//   const leaveGroup = async () => {
//     // Show confirmation toast
//     toast((t) => (
//       <div className="flex flex-col gap-3 min-w-[280px]">
//         <div className="flex items-center gap-2">
//           <span className="text-xl"></span>
//           <span className="font-semibold text-gray-800">Leave "{selectedGroup?.name}"?</span>
//         </div>
//         <p className="text-sm text-gray-500">You won't be able to send or receive messages in this group.</p>
//         <div className="flex gap-2 justify-end mt-2">
//           <button
//             onClick={() => {
//               toast.dismiss(t.id);
//               toast("You're still in the group ");
//             }}
//             className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={async () => {
//               toast.dismiss(t.id);
//               const loadingId = toast.loading("Leaving group...");
              
//               try {
//                 console.log("Leaving group:", selectedGroup.id, "User:", currentUserId);
                
//                 const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
//                   method: 'DELETE',
//                   headers: { 'Content-Type': 'application/json' },
//                   body: JSON.stringify({ userId: currentUserId })
//                 });
                
//                 const data = await res.json();
//                 console.log("Response:", data);
                
//                 toast.dismiss(loadingId);
                
//                 if (res.ok) {
//                   toast.success(`Left "${selectedGroup.name}"`);
//                   setSelectedGroup(null);
//                   fetchGroups();
//                 } else {
//                   toast.error(data.error || "Failed to leave group");
//                 }
//               } catch (error) {
//                 toast.dismiss(loadingId);
//                 console.error("Leave group error:", error);
//                 toast.error("Something went wrong");
//               }
//             }}
//             className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
//           >
//             Leave Group
//           </button>
//         </div>
//       </div>
//     ), {
//       duration: 10000,
//       position: 'top-center',
//     });
//   };


//   // Auto-scroll
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
//       {/* LEFT SIDEBAR */}
//       <div className="w-80 bg-white shadow-xl flex flex-col">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold"> Groups</h2>
//               <p className="text-sm text-blue-100 mt-1">
//                 {isConnected ? ' Connected' : ' Disconnected'}
//               </p>
//             </div>
//             <button onClick={onLogout} className="p-2 hover:bg-white/20 rounded-lg transition">
//               <LogOut className="h-5 w-5" />
//             </button>
//           </div>
//           <div className="mt-3 text-sm">
//             <p className="font-medium">User ID: {currentUserId}</p>
//           </div>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           <div className="p-3 bg-gray-50 border-b">
//             <div className="flex items-center gap-2 text-gray-600">
//               <Users className="h-4 w-4" />
//               <span className="text-xs font-semibold">ALL GROUPS</span>
//             </div>
//           </div>
          
//           {groups.length === 0 ? (
//             <div className="p-8 text-center text-gray-400">
//               <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
//               <p className="text-sm">No groups yet</p>
//               <p className="text-xs mt-1">Create your first group!</p>
//             </div>
//           ) : (
//             groups.map(group => (
//               <button
//                 key={group.id}
//                 onClick={() => setSelectedGroup(group)}
//                 className={`w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b hover:bg-gray-50 ${
//                   selectedGroup?.id === group.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//                 }`}
//               >
//                 <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
//                   {group.name?.charAt(0)?.toUpperCase()}
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-semibold text-gray-800"># {group.name}</div>
//                   <div className="text-xs text-gray-500 flex items-center gap-1">
//                     <Users className="h-3 w-3" />
//                     {group.members?.length || 0} members
//                   </div>
//                 </div>
//               </button>
//             ))
//           )}
//         </div>
        
//         <button
//           onClick={() => setShowCreateModal(true)}
//           className="m-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 transition shadow-md"
//         >
//           <Plus className="h-5 w-5" />
//           Create New Group
//         </button>
//       </div>
      
//       {/* RIGHT CHAT AREA */}
//       {selectedGroup ? (
//         <div className="flex-1 flex flex-col bg-gray-50">
//           <div className="bg-white border-b px-6 py-4 shadow-sm">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
//                   {selectedGroup.name?.charAt(0)?.toUpperCase()}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800"># {selectedGroup.name}</h2>
//                   <button
//                     onClick={() => setShowMembersModal(true)}
//                     className="text-sm text-blue-500 hover:underline mt-1 flex items-center gap-1"
//                   >
//                     <Users className="h-3 w-3" />
//                     {selectedGroup.members?.length || 0} members
//                     <ChevronDown className="h-3 w-3" />
//                   </button>
//                 </div>
//               </div>
//               <button
//                 onClick={leaveGroup}
//                 className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm shadow-md"
//               >
//                 Exit Group
//               </button>
//             </div>
//           </div>
          
//           <div className="flex-1 overflow-y-auto p-6">
//             {messages.length === 0 ? (
//               <div className="flex flex-col items-center justify-center h-full">
//                 <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
//                   <MessageCircle className="h-10 w-10 text-blue-500" />
//                 </div>
//                 <p className="text-gray-500 text-lg font-medium">No messages yet</p>
//                 <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
//               </div>
//             ) : (
//               <div className="space-y-4 max-w-3xl mx-auto">
//                 {messages.map((msg) => (
//                   <div
//                     key={msg.id}
//                     className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
//                   >
//                     <div className={`max-w-md ${msg.userId === currentUserId ? 'text-right' : ''}`}>
//                       {msg.userId !== currentUserId && msg.user?.name && (
//                         <div className="text-xs text-gray-500 mb-1 font-medium">{msg.user.name}</div>
//                       )}
//                       <div
//                         className={`px-4 py-2 rounded-2xl inline-block ${
//                           msg.userId === currentUserId
//                             ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm shadow-md'
//                             : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
//                         }`}
//                       >
//                         <p className="text-sm break-words">{msg.content}</p>
//                         <p className={`text-xs mt-1 ${
//                           msg.userId === currentUserId ? 'text-blue-100' : 'text-gray-400'
//                         }`}>
//                           {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
//                         </p>
//                       </div>
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
//                 placeholder={`Message #${selectedGroup.name}...`}
//                 className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
//                 disabled={!isConnected}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={!messageInput.trim() || !isConnected}
//                 className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md"
//               >
//                 <Send className="h-5 w-5" />
//               </button>
//             </div>
//             {!isConnected && (
//               <p className="text-xs text-red-500 text-center mt-2">Connecting to server...</p>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//           <div className="text-center">
//             <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
//               <Users className="h-16 w-16 text-blue-500" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-700 mb-2">Groups</h2>
//             <p className="text-gray-400">Select a group to start chatting</p>
//           </div>
//         </div>
//       )}
      
//       {/* Create Group Modal */}
//       {showCreateModal && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-96">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold">Create New Group</h3>
//               <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             <input
//               id="groupName"
//               type="text"
//               placeholder="Group name"
//               className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
//             />
            
//             <p className="text-sm font-semibold mb-2">Add members:</p>
//             <div className="space-y-2 max-h-60 overflow-y-auto mb-4 border rounded-lg p-2">
//               {allUsers.filter(u => u.id !== currentUserId).map(user => (
//                 <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
//                   <input type="checkbox" value={user.id} className="member-checkbox w-4 h-4 text-blue-500" />
//                   <span>{user.name}</span>
//                 </label>
//               ))}
//             </div>
            
//             <div className="flex gap-2">
//               <button
//                 onClick={() => setShowCreateModal(false)}
//                 className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   const name = document.getElementById('groupName').value;
//                   const memberIds = Array.from(document.querySelectorAll('.member-checkbox:checked'))
//                     .map(cb => cb.value);
//                   if (name) createGroup(name, memberIds);
//                   else toast.error("Group name required");
//                 }}
//                 className="flex-1 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
//               >
//                 Create Group
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {/* Members Modal */}
//       {showMembersModal && selectedGroup && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-bold"> Members</h3>
//               <button onClick={() => setShowMembersModal(false)} className="p-1 hover:bg-gray-100 rounded">
//                 <X className="h-5 w-5" />
//               </button>
//             </div>
            
//             <div className="space-y-2">
//               {selectedGroup.members?.map(member => (
//                 <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
//                       {member.user.name?.charAt(0)?.toUpperCase()}
//                     </div>
//                     <div>
//                       <div className="font-medium text-gray-800">{member.user.name}</div>
//                       <div className="text-xs text-gray-500">{member.user.email}</div>
//                     </div>
//                   </div>
//                   {member.role === "ADMIN" && (
//                     <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Admin</span>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







//demooooo

'use client';

import { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import toast from 'react-hot-toast';
import { Send, Users, Plus, X, LogOut, ChevronDown, MessageCircle } from 'lucide-react';

export default function GroupChat({ currentUserId, onLogout }) {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch groups and users
  useEffect(() => {
    fetchGroups();
    fetchAllUsers();
  }, []);

// Socket connection
  useEffect(() => {
    if (!currentUserId) return;
    
    console.log("Connecting to socket server...");
    // const newSocket = io("http://localhost:3001", {
    //   transports: ["websocket"]
    // });
    const newSocket = io("http://192.168.0.239:3001", {
      transports: ["websocket"]
    });
    
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log("Socket connected!");
      setIsConnected(true);
      newSocket.emit('user-auth', currentUserId);
    });


//   useEffect(() => {
//     if (!currentUserId) return;
    
//     // ✅ Dynamic URL - current browser ke hostname ko use karega
//     const socketUrl = `http://${window.location.hostname}:3001`;
//     console.log("🔌 Connecting to socket server:", socketUrl);
    
//     const newSocket = io(socketUrl, {
//       transports: ["websocket"]
//     });
    
//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       console.log("Socket connected!");
//       setIsConnected(true);
//       newSocket.emit('user-auth', currentUserId);
//     });
    
//     newSocket.on('connect_error', (error) => {
//       console.error("Socket connection error:", error.message);
//     });
    
//     // Cleanup function
//     return () => {
//       newSocket.disconnect();
//     };
// }, [currentUserId]);

  //  Listen for new group messages - WITH DUPLICATE CHECK
  newSocket.on('new-group-message', (message) => {
      console.log(" NEW MESSAGE RECEIVED:", message);
      
      if (selectedGroup && selectedGroup.id === message.groupId) {
        setMessages(prev => {
          // Check if message already exists (avoid duplicates)
          const exists = prev.some(m => m.id === message.id);
          if (!exists) {
            console.log(" Adding new message, total:", prev.length + 1);
            return [...prev, message];
          }
          console.log(" Duplicate ignored, message ID:", message.id);
          return prev;
        });
      }
      
      fetchGroups();
    });

    newSocket.on('connect_error', (err) => {
      console.error("Socket error:", err);
    });

    return () => {
      console.log("🔌 Disconnecting socket");
      newSocket.disconnect();
    };
  }, [currentUserId, selectedGroup]);

  // Join group room when selected
  useEffect(() => {
    if (socket && selectedGroup && isConnected) {
      console.log(`Joining group room: ${selectedGroup.id}`);
      socket.emit('join-group', selectedGroup.id);
      loadMessages(selectedGroup.id);
      
      return () => {
        if (socket && selectedGroup) {
          console.log(` Leaving group room: ${selectedGroup.id}`);
          socket.emit('leave-group', selectedGroup.id);
        }
      };
    }
  }, [selectedGroup, socket, isConnected]);

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/groups');
      const data = await res.json();
      if (data.success) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (data.success) setAllUsers(data.users);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const loadMessages = async (groupId) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/messages`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
        console.log(`Loaded ${data.messages.length} messages`);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // FIXED: Send message - NO OPTIMISTIC UPDATE
  const sendMessage = () => {
    if (!socket || !messageInput.trim() || !selectedGroup) {
      toast.error("Cannot send message");
      return;
    }
    
    const content = messageInput.trim();
    const groupId = selectedGroup.id;
    
    console.log(` Sending message to group ${groupId}: ${content}`);
    
    setMessageInput('');
    socket.emit('send-group-message', {
      groupId: groupId,
      content: content
    });
    
    inputRef.current?.focus();
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const createGroup = async (name, memberIds) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, memberIds })
      });
      
      if (res.ok) {
        toast.success('Group created!');
        fetchGroups();
        setShowCreateModal(false);
      } else {
        toast.error('Failed to create group');
      }
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const leaveGroup = async () => {
    // Show confirmation toast
    toast((t) => (
      <div className="flex flex-col gap-3 min-w-[280px]">
        <div className="flex items-center gap-2">
          <span className="text-xl"></span>
          <span className="font-semibold text-gray-800">Leave "{selectedGroup?.name}"?</span>
        </div>
        <p className="text-sm text-gray-500">You won't be able to send or receive messages in this group.</p>
        <div className="flex gap-2 justify-end mt-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toast("You're still in the group ");
            }}
            className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingId = toast.loading("Leaving group...");
              
              try {
                console.log("Leaving group:", selectedGroup.id, "User:", currentUserId);
                
                const res = await fetch(`/api/groups/${selectedGroup.id}/members`, {
                  method: 'DELETE',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ userId: currentUserId })
                });
                
                const data = await res.json();
                console.log("Response:", data);
                
                toast.dismiss(loadingId);
                
                if (res.ok) {
                  toast.success(`Left "${selectedGroup.name}"`);
                  setSelectedGroup(null);
                  fetchGroups();
                } else {
                  toast.error(data.error || "Failed to leave group");
                }
              } catch (error) {
                toast.dismiss(loadingId);
                console.error("Leave group error:", error);
                toast.error("Something went wrong");
              }
            }}
            className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Leave Group
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
      position: 'top-center',
    });
  };


  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-full bg-gradient-to-br from-gray-50 to-gray-100">
      {/* LEFT SIDEBAR */}
      <div className="w-80 bg-white shadow-xl flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold"> Groups</h2>
              <p className="text-sm text-blue-100 mt-1">
                {isConnected ? ' Connected' : ' Disconnected'}
              </p>
            </div>
            <button onClick={onLogout} className="p-2 hover:bg-white/20 rounded-lg transition">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 text-sm">
            <p className="font-medium">User ID: {currentUserId}</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-xs font-semibold">ALL GROUPS</span>
            </div>
          </div>
          
          {groups.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No groups yet</p>
              <p className="text-xs mt-1">Create your first group!</p>
            </div>
          ) : (
            groups.map(group => (
              <button
                key={group.id}
                onClick={() => setSelectedGroup(group)}
                className={`w-full p-4 text-left transition-all duration-200 flex items-center gap-3 border-b hover:bg-gray-50 ${
                  selectedGroup?.id === group.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {group.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800"># {group.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {group.members?.length || 0} members
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
        
        <button
          onClick={() => setShowCreateModal(true)}
          className="m-4 p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 flex items-center justify-center gap-2 transition shadow-md"
        >
          <Plus className="h-5 w-5" />
          Create New Group
        </button>
      </div>
      
      {/* RIGHT CHAT AREA */}
      {selectedGroup ? (
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="bg-white border-b px-6 py-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {selectedGroup.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800"># {selectedGroup.name}</h2>
                  <button
                    onClick={() => setShowMembersModal(true)}
                    className="text-sm text-blue-500 hover:underline mt-1 flex items-center gap-1"
                  >
                    <Users className="h-3 w-3" />
                    {selectedGroup.members?.length || 0} members
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <button
                onClick={leaveGroup}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm shadow-md"
              >
                Exit Group
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <MessageCircle className="h-10 w-10 text-blue-500" />
                </div>
                <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                <p className="text-sm text-gray-400 mt-1">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mx-auto">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.userId === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-md ${msg.userId === currentUserId ? 'text-right' : ''}`}>
                      {msg.userId !== currentUserId && msg.user?.name && (
                        <div className="text-xs text-gray-500 mb-1 font-medium">{msg.user.name}</div>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl inline-block ${
                          msg.userId === currentUserId
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-sm shadow-md'
                            : 'bg-white text-gray-800 rounded-bl-sm shadow-md'
                        }`}
                      >
                        <p className="text-sm break-words">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.userId === currentUserId ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="bg-white border-t p-4 shadow-lg">
            <div className="flex gap-2 max-w-4xl mx-auto">
              <input
                ref={inputRef}
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Message #${selectedGroup.name}...`}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!messageInput.trim() || !isConnected}
                className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-md"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            {!isConnected && (
              <p className="text-xs text-red-500 text-center mt-2">Connecting to server...</p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="h-16 w-16 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Groups</h2>
            <p className="text-gray-400">Select a group to start chatting</p>
          </div>
        </div>
      )}
      
      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Group</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <input
              id="groupName"
              type="text"
              placeholder="Group name"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
            
            <p className="text-sm font-semibold mb-2">Add members:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto mb-4 border rounded-lg p-2">
              {allUsers.filter(u => u.id !== currentUserId).map(user => (
                <label key={user.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input type="checkbox" value={user.id} className="member-checkbox w-4 h-4 text-blue-500" />
                  <span>{user.name}</span>
                </label>
              ))}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const name = document.getElementById('groupName').value;
                  const memberIds = Array.from(document.querySelectorAll('.member-checkbox:checked'))
                    .map(cb => cb.value);
                  if (name) createGroup(name, memberIds);
                  else toast.error("Group name required");
                }}
                className="flex-1 p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Members Modal */}
      {showMembersModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold"> Members</h3>
              <button onClick={() => setShowMembersModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {selectedGroup.members?.map(member => (
                <div key={member.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {member.user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{member.user.name}</div>
                      <div className="text-xs text-gray-500">{member.user.email}</div>
                    </div>
                  </div>
                  {member.role === "ADMIN" && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Admin</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}









