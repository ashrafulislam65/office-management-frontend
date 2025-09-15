'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';

interface FormData {
  fullName: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'} flex`}>
        <div className="flex-1">
          {type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span>{message}</span>
        </div>
        <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
      </div>
    </div>
  );
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>();

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = `Registration failed with status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMessage = response.statusText || errorMessage;
        }
        
        showToast(errorMessage, 'error');
        return;
      }

      const responseData = await response.json();
      showToast(responseData.message || 'Registration successful!', 'success');
      reset();
    } catch (error: any) {
      console.error('Registration failed:', error);
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
      
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Employee Registration</h1>
          <p className="py-6">
            Register a new employee account. All fields are required for completing the registration process.
          </p>
          <p className="text-sm text-gray-600">
            Already have an account? <Link href="/Login" className="link link-primary">Login here</Link>
          </p>
        </div>
        
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset disabled={isSubmitting}>
                {/* Full Name */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your Full Name" 
                    className={`input input-bordered ${errors.fullName ? 'input-error' : ''}`}
                    {...register('fullName', {
                      required: 'Full name is required',
                      maxLength: {
                        value: 100,
                        message: 'Full name must be shorter than or equal to 100 characters'
                      }
                    })}
                  />
                  {errors.fullName && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.fullName.message}</span>
                    </label>
                  )}
                </div>

                {/* Age */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Age</span>
                  </label>
                  <input 
                    type="number" 
                    placeholder="Your Age (ex-30)" 
                    className={`input input-bordered ${errors.age ? 'input-error' : ''}`}
                    {...register('age', {
                      required: 'Age is required',
                      min: {
                        value: 18,
                        message: 'Employee must be at least 18 years old'
                      },
                      max: {
                        value: 65,
                        message: 'Employee must be younger than 65 years'
                      },
                      valueAsNumber: true
                    })}
                  />
                  {errors.age && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.age.message}</span>
                    </label>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email</span>
                  </label>
                  <input 
                    type="email" 
                    placeholder="john.doe@aiub.edu" 
                    className={`input input-bordered ${errors.email ? 'input-error' : ''}`}
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
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
                      placeholder="Password" 
                      className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        }
                      })}
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  {errors.password && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.password.message}</span>
                    </label>
                  )}
                </div>

                {/* Gender */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select 
                    className={`select select-bordered ${errors.gender ? 'select-error' : ''}`}
                    {...register('gender', {
                      required: 'Please select a gender'
                    })}
                  >
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.gender.message}</span>
                    </label>
                  )}
                </div>

                {/* Phone Number */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Phone Number</span>
                  </label>
                  <input 
                    type="tel" 
                    placeholder="01234567891" 
                    className={`input input-bordered ${errors.phoneNumber ? 'input-error' : ''}`}
                    {...register('phoneNumber', {
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]+$/,
                        message: 'Phone number must contain only digits'
                      },
                      minLength: {
                        value: 11,
                        message: 'Phone number must be at least 11 digits'
                      }
                    })}
                  />
                  {errors.phoneNumber && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.phoneNumber.message}</span>
                    </label>
                  )}
                </div>

                <div className="form-control mt-6">
                  <button 
                    type="submit" 
                    className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                  </button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}