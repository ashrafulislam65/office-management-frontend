'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  fullName: string;
  photoUrl?: string;
}

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/employees/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/';
    }
  };

  if (isLoading) {
    return (
      <nav>
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Loading...</a>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">Company Name</Link>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
          
          {user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="User profile"
                    src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                <li>
                  <Link href="/profile">Profile</Link>
                </li>
                <li>
                  <Link href="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/Login" className="btn btn-outline btn-primary">Login</Link>
              <Link href="/Register" className="btn btn-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}