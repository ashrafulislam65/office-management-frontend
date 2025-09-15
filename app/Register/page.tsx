'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  fullName: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  phoneNumber: string;
}

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

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
  };

  const hideToast = () => {
    setToast(null);
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      
      console.log('Sending data to server:', data);
      
      
      const response = await fetch('http://localhost:3000/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      
      if (!response.ok) {
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
       
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.message || errorData.details?.message || errorMessage;
          } catch (e) {
            console.error('Error parsing JSON response:', e);
           
            errorMessage = response.statusText || errorMessage;
          }
        } else {
          
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      // If response is OK, parse JSON
      const responseData = await response.json();
      console.log('Registration successful:', responseData);
      showToast(responseData.message || 'Registration successful! Employee created.', 'success');
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
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Sign Up</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
            quasi. In deleniti eaque aut repudiandae et a id nisi.
          </p>
        </div>
        
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset" disabled={isSubmitting}>
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
                      placeholder="Password" 
                      className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        maxLength: {
                          value: 30,
                          message: 'Password must be less than 30 characters'
                        },
                        validate: {
                          hasUpperCase: (value) =>
                            /[A-Z]/.test(value) ||
                            'Password must contain at least one uppercase letter',
                          hasLowerCase: (value) =>
                            /[a-z]/.test(value) ||
                            'Password must contain at least one lowercase letter',
                          hasNumber: (value) =>
                            /\d/.test(value) || 'Password must contain at least one number',
                          hasSpecialChar: (value) =>
                            /[!@#$%^&*]/.test(value) ||
                            'Password must contain at least one special character'
                        }
                      })}
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
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
                      },
                      maxLength: {
                        value: 15,
                        message: 'Phone number must be less than 15 digits'
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
                    className={`btn btn-neutral ${isSubmitting ? 'loading' : ''}`}
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