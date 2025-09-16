 
"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import ProtectedRoute from "@/app/component/ProtectedRoute";
import api from "@/lib/api";

interface Memorandum {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  admin?: {
    adminId: string;
    email: string;
  };
}

export default function MemorandumPage() {
  const [memorandums, setMemorandums] = useState<Memorandum[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Form states
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchAdminData();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchMemorandums();
      setupPusher();
    }
  }, [adminId]);

  const fetchAdminData = async () => {
    try {
      const response = await api.get("/session");
      setAdminId(response.data.adminId || response.data.id || "");
      setAdminEmail(response.data.email || "");
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchMemorandums = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/${adminId}/memorandums`);
      setMemorandums(response.data);
    } catch (error: any) {
      console.error("Error fetching memorandums:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const setupPusher = () => {
    const pusher = new Pusher("2493dde53f4df046b213", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("memorandum-channel");
    channel.bind("memorandum-created", (data: any) => {
      setNotifications(prev => [...prev, `New memorandum created: ${data.title}`]);
      fetchMemorandums();
    });

    channel.bind("memorandum-updated", (data: any) => {
      setNotifications(prev => [...prev, `Memorandum updated: ${data.title}`]);
      fetchMemorandums();
    });

    channel.bind("memorandum-deleted", (data: any) => {
      setNotifications(prev => [...prev, `Memorandum deleted: ${data.id}`]);
      fetchMemorandums();
    });

    return () => {
      pusher.unsubscribe("memorandum-channel");
    };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      alert("Please fill all fields");
      return;
    }
    
    try {
      await api.post(`/${adminId}/memorandums`, {
        title,
        content
      });
      
      alert("Memorandum created successfully!");
      setTitle("");
      setContent("");
      setShowCreateForm(false);
      fetchMemorandums();
    } catch (error: any) {
      console.error("Create memorandum error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const startEdit = (memorandum: Memorandum) => {
    setEditingId(memorandum.id);
    setEditTitle(memorandum.title);
    setEditContent(memorandum.content);
  };

  const handleUpdate = async (id: string) => {
    if (!editTitle || !editContent) {
      alert("Please fill all fields");
      return;
    }
    
    try {
      await api.patch(`/${adminId}/memorandums/${id}`, {
        title: editTitle,
        content: editContent
      });
      
      alert("Memorandum updated successfully!");
      setEditingId(null);
      fetchMemorandums();
    } catch (error: any) {
      console.error("Update memorandum error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this memorandum?")) {
      return;
    }
    
    try {
      await api.delete(`/${adminId}/memorandums/${id}`);
      alert("Memorandum deleted successfully!");
      fetchMemorandums();
    } catch (error: any) {
      console.error("Delete memorandum error:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-6xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Memorandum Management</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Admin: {adminEmail} {adminId && `(ID: ${adminId})`}
            </div>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {showCreateForm ? 'Cancel' : 'Create New Memorandum'}
            </button>
          </div>
        </div>
        
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Recent Activities</h3>
            <div className="space-y-2">
              {notifications.map((notification, index) => (
                <div key={index} className="text-sm text-blue-700">
                  • {notification}
                </div>
              ))}
            </div>
            <button 
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              onClick={() => setNotifications([])}
            >
              Clear notifications
            </button>
          </div>
        )}

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Create New Memorandum</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  id="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Memorandum title"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                  id="content"
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Memorandum content..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Memorandum
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Memorandum List */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Memorandums</h2>
          
          {loading ? (
            <div className="text-center py-4">Loading memorandums...</div>
          ) : memorandums.length === 0 ? (
            <div className="text-center py-4">No memorandums found.</div>
          ) : (
            <div className="space-y-4">
              {memorandums.map((memorandum) => (
                <div key={memorandum.id} className="border border-gray-200 rounded-lg p-4">
                  {editingId === memorandum.id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Memorandum title"
                      />
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Memorandum content..."
                      />
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(memorandum.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-medium">{memorandum.title}</h3>
                      <p className="text-gray-600 mt-2 whitespace-pre-line">{memorandum.content}</p>
                      <div className="text-sm text-gray-500 mt-2">
                        Created by: {memorandum.admin?.email || 'Unknown'} 
                        {memorandum.admin?.adminId && ` (ID: ${memorandum.admin.adminId})`} 
                        on {new Date(memorandum.createdAt).toLocaleString()}
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => startEdit(memorandum)}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(memorandum.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}  


















































































































































































// // app/admin/dashboard/memorandum/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import Pusher from "pusher-js";
// import ProtectedRoute from "@/app/component/ProtectedRoute";
// import api from "@/lib/api";

// interface Memorandum {
//   id: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   admin: {
//     adminId: string;
//     email: string;
//   };
// }

// export default function MemorandumPage() {
//   const [memorandums, setMemorandums] = useState<Memorandum[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [adminId, setAdminId] = useState("");
//   const [adminEmail, setAdminEmail] = useState("");
//   const [notifications, setNotifications] = useState<string[]>([]);
  
//   // Form states
//   const [showCreateForm, setShowCreateForm] = useState(false);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [editTitle, setEditTitle] = useState("");
//   const [editContent, setEditContent] = useState("");

//   useEffect(() => {
//     fetchAdminData();
//   }, []);

//   useEffect(() => {
//     if (adminId) {
//       fetchMemorandums();
//       setupPusher();
//     }
//   }, [adminId]);

//   const fetchAdminData = async () => {
//     try {
//       const response = await api.get("/session");
//       setAdminId(response.data.id); // Using id instead of adminId
//       setAdminEmail(response.data.email);
//     } catch (error: any) {
//       console.error("Error fetching admin data:", error);
//     }
//   };

//   const fetchMemorandums = async () => {
//     try {
//       setLoading(true);
//       // Correct endpoint based on your backend
//       const response = await api.get(`/${adminId}/memorandums`);
//       setMemorandums(response.data);
//     } catch (error: any) {
//       console.error("Error fetching memorandums:", error);
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const setupPusher = () => {
//     const pusher = new Pusher("2493dde53f4df046b213", {
//       cluster: "mt1",
//     });

//     const channel = pusher.subscribe("memorandum-channel");
//     channel.bind("memorandum-created", (data: any) => {
//       setNotifications(prev => [...prev, `New memorandum created: ${data.title}`]);
//       fetchMemorandums();
//     });

//     channel.bind("memorandum-updated", (data: any) => {
//       setNotifications(prev => [...prev, `Memorandum updated: ${data.title}`]);
//       fetchMemorandums();
//     });

//     channel.bind("memorandum-deleted", (data: any) => {
//       setNotifications(prev => [...prev, `Memorandum deleted: ${data.id}`]);
//       fetchMemorandums();
//     });

//     return () => {
//       pusher.unsubscribe("memorandum-channel");
//     };
//   };

//   const handleCreate = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!title || !content) {
//       alert("Please fill all fields");
//       return;
//     }
    
//     try {
//       // Correct endpoint based on your backend
//       await api.post(`/${adminId}/memorandums`, {
//         title,
//         content
//       });
      
//       alert("Memorandum created successfully!");
//       setTitle("");
//       setContent("");
//       setShowCreateForm(false);
//       fetchMemorandums();
//     } catch (error: any) {
//       console.error("Create memorandum error:", error);
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const startEdit = (memorandum: Memorandum) => {
//     setEditingId(memorandum.id);
//     setEditTitle(memorandum.title);
//     setEditContent(memorandum.content);
//   };

//   const handleUpdate = async (id: string) => {
//     if (!editTitle || !editContent) {
//       alert("Please fill all fields");
//       return;
//     }
    
//     try {
//       await api.patch(`/${adminId}/memorandums/${id}`, {
//         title: editTitle,
//         content: editContent
//       });
      
//       alert("Memorandum updated successfully!");
//       setEditingId(null);
//       fetchMemorandums();
//     } catch (error: any) {
//       console.error("Update memorandum error:", error);
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this memorandum?")) {
//       return;
//     }
    
//     try {
//       await api.delete(`/${adminId}/memorandums/${id}`);
//       alert("Memorandum deleted successfully!");
//       fetchMemorandums();
//     } catch (error: any) {
//       console.error("Delete memorandum error:", error);
//       alert(`Error: ${error.response?.data?.message || error.message}`);
//     }
//   };

//   return (
//     <ProtectedRoute requiredRole="admin">
//       <div className="max-w-6xl mx-auto py-6 px-4">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Memorandum Management</h1>
//           <div className="text-sm text-gray-600">
//             Admin ID: {adminId} | Email: {adminEmail}
//           </div>
//           <button
//             onClick={() => setShowCreateForm(!showCreateForm)}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//           >
//             {showCreateForm ? 'Cancel' : 'Create New Memorandum'}
//           </button>
//         </div>
        
//         {/* Notifications */}
//         <div className="mb-4">
//           {notifications.map((notification, index) => (
//             <div key={index} className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-2">
//               {notification}
//             </div>
//           ))}
//         </div>

//         {/* Create Form */}
//         {showCreateForm && (
//           <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//             <h2 className="text-xl font-semibold mb-4">Create New Memorandum</h2>
//             <form onSubmit={handleCreate} className="space-y-4">
//               <div>
//                 <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
//                 <input
//                   type="text"
//                   id="title"
//                   required
//                   value={title}
//                   onChange={(e) => setTitle(e.target.value)}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Memorandum title"
//                 />
//               </div>
//               <div>
//                 <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
//                 <textarea
//                   id="content"
//                   required
//                   rows={6}
//                   value={content}
//                   onChange={(e) => setContent(e.target.value)}
//                   className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Memorandum content..."
//                 />
//               </div>
//               <button
//                 type="submit"
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Create Memorandum
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Memorandum List */}
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-xl font-semibold mb-4">Memorandums</h2>
          
//           {loading ? (
//             <div className="text-center py-4">Loading memorandums...</div>
//           ) : memorandums.length === 0 ? (
//             <div className="text-center py-4">No memorandums found.</div>
//           ) : (
//             <div className="space-y-4">
//               {memorandums.map((memorandum) => (
//                 <div key={memorandum.id} className="border border-gray-200 rounded-lg p-4">
//                   {editingId === memorandum.id ? (
//                     <div className="space-y-4">
//                       <input
//                         type="text"
//                         value={editTitle}
//                         onChange={(e) => setEditTitle(e.target.value)}
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <textarea
//                         value={editContent}
//                         onChange={(e) => setEditContent(e.target.value)}
//                         rows={4}
//                         className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
//                       />
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleUpdate(memorandum.id)}
//                           className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                         >
//                           Save
//                         </button>
//                         <button
//                           onClick={() => setEditingId(null)}
//                           className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
//                         >
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <h3 className="text-lg font-medium">{memorandum.title}</h3>
//                       <p className="text-gray-600 mt-2 whitespace-pre-line">{memorandum.content}</p>
//                       <div className="text-sm text-gray-500 mt-2">
//                         Created by: {memorandum.admin.email} (ID: {memorandum.admin.adminId}) on {new Date(memorandum.createdAt).toLocaleString()}
//                       </div>
//                       <div className="flex space-x-2 mt-4">
//                         <button
//                           onClick={() => startEdit(memorandum)}
//                           className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDelete(memorandum.id)}
//                           className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }


// app/admin/dashboard/memorandum/page.tsx