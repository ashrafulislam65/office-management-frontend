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
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
      }
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
      <nav className="sticky top-0 z-50">
        <div className="navbar bg-base-100 shadow-sm">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">Office Management</Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50">
      <div className="navbar bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">Office Management</Link>
          
          {/* Navigation Links - Always Visible */}
          <div className="flex-none hidden md:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/Services">Services</Link></li>
              <li><Link href="/Contact">Contact</Link></li>
              <li><Link href="/Privacy">Privacy</Link></li>
              {/* Add Members link for both logged in and non-logged in users */}
              <li><Link href="/MembersPage">Members</Link></li>
              {user && (
                <>
                  <li><Link href="/Leave">Leave</Link></li>
                  <li><Link href="/Tasks">Tasks</Link></li>
                </>
              )}
            </ul>
          </div>
        </div>
        
        <div className="flex gap-2">
          {user ? (
            <>
              {/* Mobile menu */}
              <div className="dropdown md:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/privacy">Privacy</Link></li>
                  {/* Add Members link to mobile menu */}
                  <li><Link href="/MembersPage">Members</Link></li>
                  <li><Link href="/Leave">Leave</Link></li>
                  <li><Link href="/Tasks">Tasks</Link></li>
                  <li><Link href="/Profile">Profile</Link></li>
                  <li><button onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>

              {/* Desktop Profile Dropdown */}
              <div className="dropdown dropdown-end hidden md:block">
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
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                  <li>
                    <Link href="/Profile">Profile</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Mobile menu for non-logged in users */}
              <div className="dropdown md:hidden">
                <div tabIndex={0} role="button" className="btn btn-ghost">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </div>
                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/services">Services</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/privacy">Privacy</Link></li>
                  {/* Add Members link for non-logged in users in mobile menu */}
                  <li><Link href="/MembersPage">Members</Link></li>
                  <li><Link href="/Login">Login</Link></li>
                  <li><Link href="/Register">Register</Link></li>
                </ul>
              </div>

              {/* Desktop buttons for non-logged in users */}
              <div className="hidden md:flex gap-2">
                <Link href="/Login" className="btn btn-outline btn-primary">Login</Link>
                <Link href="/Register" className="btn btn-primary">Register</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}