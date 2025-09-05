 "use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';

interface FormData {
  email: string;
  password: string;
}

export default function Signin() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Please fill out all fields');
      setIsLoading(false);
      return;
    }

    try {
      // Hardcoded URL - Frontend:1900, Backend:9001
      const response = await fetch('http://localhost:9001/admin/users/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store user info
        localStorage.setItem('user', JSON.stringify({
          id: data.user.id,
          email: data.user.email,
          role: data.role,
          fullName: data.user.fullName
        }));

        toast.success(`Welcome back, ${data.user.fullName || data.user.email}!`);

        // Redirect based on role
        switch (data.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'employee':
            router.push('/employee/dashboard');
            break;
          case 'hr':
            router.push('/hr/dashboard');
            break;
          default:
            router.push('/dashboard');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || 'Sign in failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Error signing in:', error);
      toast.error('Cannot connect to server. Make sure the backend is running on port 9001.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Toaster />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign In</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Use your admin (.xyz), employee (@aiub.edu), or HR email
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Email address" 
                value={formData.email} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Password" 
                value={formData.password} 
                onChange={handleChange} 
              />
            </div>
          </div>
          <div>
            <button 
              type="submit" 
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Simple debug info */}
        <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
          <p>Backend: http://localhost:9001</p>
          <p>Frontend: http://localhost:1900</p>
        </div>
      </div>
    </div>
  );
}