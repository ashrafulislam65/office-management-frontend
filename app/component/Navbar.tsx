 // app/component/Navbar.tsx
"use client"

import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout, isLoading } = useSession();
  const router = useRouter();

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
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Office Management System</h1>
            {/* Add a check for user.role before calling toUpperCase() */}
            {user.role && (
              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {user.role.toUpperCase()}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, {user.fullName || user.email}
            </span>
            
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {user.fullName 
                      ? user.fullName.charAt(0).toUpperCase() 
                      : user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li>
                  <a className="justify-between">
                    Profile
                    <span className="badge">New</span>
                  </a>
                </li>
                <li><a>Settings</a></li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}