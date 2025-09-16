'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className={`max-w-4xl w-full transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-9xl font-bold text-indigo-600 mb-4 relative z-10">404</h1>
            <div className="absolute -inset-4 bg-indigo-100 rounded-full blur-lg opacity-70 -z-10"></div>
          </div>
          <h2 className="text-5xl font-bold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Oops! The page you're looking for seems to have wandered off into the digital void.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          {/* Animated illustration */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute w-full h-full">
              <div className="animate-pulse absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 bg-indigo-200 rounded-full opacity-30"></div>
              </div>
              <div className="animate-ping absolute inset-0 flex items-center justify-center animation-delay-1000">
                <div className="w-32 h-32 bg-indigo-300 rounded-full opacity-40"></div>
              </div>
              <div className="animate-pulse absolute inset-0 flex items-center justify-center animation-delay-2000">
                <div className="w-24 h-24 bg-indigo-400 rounded-full opacity-60"></div>
              </div>
            </div>
            
            <div className="relative z-10 bg-white p-6 rounded-2xl shadow-lg border-2 border-indigo-100">
              <svg 
                className="w-20 h-20 text-indigo-600 mx-auto" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p className="text-sm text-gray-500 mt-2">Page not available</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="btn btn-primary btn-lg shadow-lg transform transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              Go Home
            </Link>
            
            <Link 
              href="/MembersPage" 
              className="btn btn-outline btn-primary btn-lg transform transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Browse Members
            </Link>
            
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-ghost btn-lg transform transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Go Back
            </button>
          </div>
        </div>

        {/* Additional information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Looking for something specific?</h3>
          <p className="text-gray-600 mb-4">
            If you can't find what you're looking for, try these options:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Check the URL</h4>
                <p className="text-sm text-gray-600">Make sure there are no typos in the address</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Use search</h4>
                <p className="text-sm text-gray-600">Try using the search function</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Navigation menu</h4>
                <p className="text-sm text-gray-600">Browse through our navigation menu</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Contact support</h4>
                <p className="text-sm text-gray-600">Reach out to our support team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500">© {new Date().getFullYear()} Office Management System</p>
        </div>
      </div>
    </div>
  );
}