//  // app/component/Navbar.tsx
// "use client"

// import { useSession } from '@/context/SessionContext';
// import { useRouter } from 'next/navigation';

// export default function Navbar() {
//   const { user, logout, isLoading } = useSession();
//   const router = useRouter();

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   // Don't render anything while loading or if there's no user
//   if (isLoading || !user) return null;

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-xl font-bold">Office Management System</h1>
//             {/* Add a check for user.role before calling toUpperCase() */}
//             {user.role && (
//               <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                 {user.role.toUpperCase()}
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center space-x-4">
//             <span className="text-gray-700">
//               Welcome, {user.fullName || user.email}
//             </span>
            
//             <div className="dropdown dropdown-end">
//               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                 <div className="w-10 rounded-full bg-indigo-500 flex items-center justify-center">
//                   <span className="text-white font-bold">
//                     {user.fullName 
//                       ? user.fullName.charAt(0).toUpperCase() 
//                       : user.email.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//               <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//                 <li>
//                   <a className="justify-between">
//                     Profile
//                     <span className="badge">New</span>
//                   </a>
//                 </li>
//                 <li><a>Settings</a></li>
//                 <li>
//                   <button onClick={handleLogout}>Logout</button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }





// app/component/Navbar.tsx
// "use client"

// import { useSession } from '@/context/SessionContext';
// import { useRouter } from 'next/navigation';
// import { useState, useEffect } from 'react';
// import Pusher from 'pusher-js';

// interface Notification {
//   id: string;
//   message: string;
//   type: string;
//   timestamp: Date;
//   read: boolean;
// }

// export default function Navbar() {
//   const { user, logout, isLoading } = useSession();
//   const router = useRouter();
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   useEffect(() => {
//     if (!user) return;

//     // Initialize Pusher
//     const pusher = new Pusher("2493dde53f4df046b213", {
//       cluster: "mt1",
//     });

//     // Subscribe to memorandum channel
//     const memorandumChannel = pusher.subscribe("memorandum-channel");
//     memorandumChannel.bind("memorandum-created", (data: any) => {
//       addNotification({
//         message: `New memorandum created: ${data.title}`,
//         type: "memorandum"
//       });
//     });

//     memorandumChannel.bind("memorandum-updated", (data: any) => {
//       addNotification({
//         message: `Memorandum updated: ${data.title}`,
//         type: "memorandum"
//       });
//     });

//     memorandumChannel.bind("memorandum-deleted", (data: any) => {
//       addNotification({
//         message: `Memorandum deleted`,
//         type: "memorandum"
//       });
//     });

//     // Subscribe to email channel
//     const emailChannel = pusher.subscribe("email-channel");
//     emailChannel.bind("email-sent", (data: any) => {
//       addNotification({
//         message: `Email sent to ${data.to}`,
//         type: "email"
//       });
//     });

//     emailChannel.bind("email-error", (data: any) => {
//       addNotification({
//         message: `Failed to send email to ${data.to}: ${data.error}`,
//         type: "error"
//       });
//     });

//     return () => {
//       pusher.unsubscribe("memorandum-channel");
//       pusher.unsubscribe("email-channel");
//     };
//   }, [user]);

//   const addNotification = (notification: { message: string; type: string }) => {
//     const newNotification: Notification = {
//       id: Date.now().toString(),
//       message: notification.message,
//       type: notification.type,
//       timestamp: new Date(),
//       read: false
//     };
    
//     setNotifications(prev => [newNotification, ...prev]);
//     setUnreadCount(prev => prev + 1);
    
//     // Auto-hide notification after 5 seconds
//     setTimeout(() => {
//       setNotifications(prev => 
//         prev.map(n => n.id === newNotification.id ? { ...n, read: true } : n)
//       );
//     }, 5000);
//   };

//   const markAllAsRead = () => {
//     setNotifications(prev => prev.map(n => ({ ...n, read: true })));
//     setUnreadCount(0);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   // Don't render anything while loading or if there's no user
//   if (isLoading || !user) return null;

//   return (
//     <nav className="bg-white shadow-lg">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <div className="flex items-center space-x-4">
//             <h1 className="text-xl font-bold">Office Management System</h1>
//             {/* Add a check for user.role before calling toUpperCase() */}
//             {user.role && (
//               <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
//                 {user.role.toUpperCase()}
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center space-x-4">
//             {/* Notifications Dropdown */}
//             <div className="dropdown dropdown-end">
//               <div 
//                 tabIndex={0} 
//                 role="button" 
//                 className="btn btn-ghost btn-circle"
//                 onClick={() => setShowNotifications(!showNotifications)}
//               >
//                 <div className="indicator">
//                   <svg 
//                     xmlns="http://www.w3.org/2000/svg" 
//                     className="h-6 w-6" 
//                     fill="none" 
//                     viewBox="0 0 24 24" 
//                     stroke="currentColor"
//                   >
//                     <path 
//                       strokeLinecap="round" 
//                       strokeLinejoin="round" 
//                       strokeWidth="2" 
//                       d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
//                     />
//                   </svg>
//                   {unreadCount > 0 && (
//                     <span className="badge badge-xs badge-primary indicator-item">
//                       {unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </div>
              
//               {showNotifications && (
//                 <div 
//                   tabIndex={0} 
//                   className="mt-3 z-[1] card card-compact dropdown-content w-96 bg-base-100 shadow"
//                 >
//                   <div className="card-body">
//                     <div className="flex justify-between items-center">
//                       <span className="font-bold text-lg">Notifications</span>
//                       {unreadCount > 0 && (
//                         <button 
//                           className="text-xs text-blue-500"
//                           onClick={markAllAsRead}
//                         >
//                           Mark all as read
//                         </button>
//                       )}
//                     </div>
                    
//                     <div className="divider my-1"></div>
                    
//                     <div className="h-96 overflow-y-auto">
//                       {notifications.length === 0 ? (
//                         <div className="text-center text-gray-500 py-4">
//                           No notifications
//                         </div>
//                       ) : (
//                         <ul className="menu menu-sm gap-1">
//                           {notifications.map((notification) => (
//                             <li key={notification.id}>
//                               <div className={`p-2 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50'}`}>
//                                 <div className="flex justify-between items-start">
//                                   <span className="text-sm">{notification.message}</span>
//                                   {!notification.read && (
//                                     <div className="badge badge-primary badge-xs"></div>
//                                   )}
//                                 </div>
//                                 <div className="text-xs text-gray-500 mt-1">
//                                   {notification.timestamp.toLocaleTimeString()}
//                                 </div>
//                               </div>
//                             </li>
//                           ))}
//                         </ul>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <span className="text-gray-700">
//               Welcome, {user.fullName || user.email}
//             </span>
            
//             <div className="dropdown dropdown-end">
//               <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
//                 <div className="w-10 rounded-full bg-indigo-500 flex items-center justify-center">
//                   <span className="text-white font-bold">
//                     {user.fullName 
//                       ? user.fullName.charAt(0).toUpperCase() 
//                       : user.email.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//               </div>
//               <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
//                 <li>
//                   <a className="justify-between">
//                     Profile
//                     <span className="badge">New</span>
//                   </a>
//                 </li>
//                 <li><a>Settings</a></li>
//                 <li>
//                   <button onClick={handleLogout}>Logout</button>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }   



// app/component/Navbar.tsx
"use client"

import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Pusher from 'pusher-js';

interface Notification {
  id: string;
  title: string;
  message: string;
  sender: string;
  timestamp: Date;
  type: 'memorandum' | 'email' | 'notice' | 'general';
  read: boolean;
}

export default function Navbar() {
  const { user, logout, isLoading } = useSession();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Initialize Pusher
    const pusher = new Pusher("2493dde53f4df046b213", {
      cluster: "mt1",
    });

    // Subscribe to memorandum channel
    const memorandumChannel = pusher.subscribe("memorandum-channel");
    memorandumChannel.bind("memorandum-created", (data: any) => {
      addNotification({
        title: "New Memorandum",
        message: data.title,
        sender: user.fullName || user.email,
        type: "memorandum"
      });
    });

    memorandumChannel.bind("memorandum-updated", (data: any) => {
      addNotification({
        title: "Memorandum Updated",
        message: data.title,
        sender: user.fullName || user.email,
        type: "memorandum"
      });
    });

    memorandumChannel.bind("memorandum-deleted", (data: any) => {
      addNotification({
        title: "Memorandum Deleted",
        message: `Memorandum ID: ${data.id}`,
        sender: user.fullName || user.email,
        type: "memorandum"
      });
    });

    // Subscribe to email channel
    const emailChannel = pusher.subscribe("email-channel");
    emailChannel.bind("email-sent", (data: any) => {
      addNotification({
        title: "Email Sent",
        message: `To: ${data.to}`,
        sender: user.fullName || user.email,
        type: "email"
      });
    });

    return () => {
      pusher.unsubscribe("memorandum-channel");
      pusher.unsubscribe("email-channel");
    };
  }, [user]);

  const addNotification = (notification: { 
    title: string; 
    message: string; 
    sender: string;
    type: 'memorandum' | 'email' | 'notice' | 'general';
  }) => {
    const newNotification: Notification = {
      id: Date.now().toString(),
      title: notification.title,
      message: notification.message,
      sender: notification.sender,
      timestamp: new Date(),
      type: notification.type,
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const getTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Don't render anything while loading or if there's no user
  if (isLoading || !user) return null;

  return (
    <nav className="bg-blue-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Logo and System Name */}
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Office Management System</h1>
            {user.role && (
              <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                {user.role.toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Right side - User info and notifications */}
          <div className="flex items-center space-x-6">
            {/* Notifications Dropdown */}
            <div className="dropdown dropdown-end">
              <div 
                tabIndex={0} 
                role="button" 
                className="btn btn-ghost btn-circle relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 badge badge-xs badge-error">
                    {unreadCount}
                  </span>
                )}
              </div>
              
              {/* Notifications Dropdown Content */}
              {showNotifications && (
                <div 
                  tabIndex={0} 
                  className="mt-3 z-[100] card card-compact dropdown-content w-96 bg-base-100 shadow-xl border border-gray-200"
                >
                  <div className="card-body p-0">
                    {/* Notifications Header */}
                    <div className="bg-blue-800 text-white p-4">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Notifications</span>
                        {unreadCount > 0 && (
                          <button 
                            className="text-sm text-blue-200 hover:text-white"
                            onClick={markAllAsRead}
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                          <div className="text-sm">No notifications</div>
                          <div className="text-xs mt-1">You're all caught up!</div>
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                                notification.read ? 'bg-white' : 'bg-blue-50'
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-semibold text-gray-900">
                                  {notification.title}
                                </span>
                                {!notification.read && (
                                  <span className="badge badge-primary badge-xs"></span>
                                )}
                              </div>
                              
                              <div className="text-sm text-gray-700 mb-2">
                                {notification.message}
                              </div>
                              
                              <div className="flex justify-between items-center text-xs text-gray-500">
                                <span>By {notification.sender}</span>
                                <span>{getTimeAgo(notification.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {/* Notifications Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <button className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium">
                          See All Notifications
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3">
              <span className="text-sm">
                Welcome, {user.fullName || user.email}
              </span>
              
              {/* User Dropdown */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full bg-white flex items-center justify-center">
                    <span className="text-blue-800 font-bold text-sm">
                      {user.fullName 
                        ? user.fullName.charAt(0).toUpperCase() 
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                  <li className="p-2 border-b">
                    <div className="text-xs text-gray-500">
                      Welcome {user.fullName || user.email}
                    </div>
                  </li>
                  <li><a>Profile Settings</a></li>
                  <li><a>Account Settings</a></li>
                  <li className="border-t mt-2">
                    <button onClick={handleLogout} className="text-red-600 hover:text-red-800">
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}