'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';


interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginStatus, setLoginStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setLoginStatus(null);
    
    try {
      console.log('Sending login data:', data);
      
      
      const response = await fetch('http://localhost:3000/employees/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include' 
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = responseData.error || 
                            responseData.message ||
                            `HTTP error! status: ${response.status}`;
        
        throw new Error(errorMessage);
      }

      console.log('Login successful:', responseData);
      setLoginStatus({ 
        message: 'Login successful! Redirecting to Home Page...', 
        isError: false 
      });
      
      
      const sessionCheck = await fetch('http://localhost:3000/employees/session/check', {
        credentials: 'include'
      });
      
      const sessionData = await sessionCheck.json();
      
      if (sessionData.isLoggedIn) {
        
        localStorage.setItem('user', JSON.stringify(sessionData.employee));
        
        
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        throw new Error('Session not established properly');
      }
      
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoginStatus({ 
        message: error.message || 'Login failed. Please check your credentials.',
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const useDemoCredentials = () => {
    reset({
      email: 'demo@aiub.edu',
      password: 'demo123'
    });
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Login now!</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset" disabled={isSubmitting}>
                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="your.email@aiub.edu" 
                    className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      },
                      validate: (value) =>
                        value.endsWith('@aiub.edu') || 'Email must be from aiub.edu domain'
                    })}
                  />
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email.message}</span>
                    </label>
                  )}
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Password</span>
                  </label>
                  <div className="relative">
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter your password" 
                      className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password.message}</span>
                    </label>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right mt-2">
                  <a className="link link-hover text-sm text-blue-600">Forgot password?</a>
                </div>

                {/* Login Status Message */}
                {loginStatus && (
                  <div className={`alert ${loginStatus.isError ? 'alert-error' : 'alert-success'} mt-4`}>
                    <div>
                      <span>{loginStatus.message}</span>
                    </div>
                  </div>
                )}

                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Logging in...' : 'Login'}
                  </button>
                </div>

                

                

                {/* Sign up link */}
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="/Register" className="link link-primary">Sign up</a>
                  </p>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}