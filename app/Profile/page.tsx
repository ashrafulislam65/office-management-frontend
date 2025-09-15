'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  fullName: string;
  phoneNumber?: string;
  department?: string;
  photoUrl?: string;
  status?: string;
  age?: number;
  gender?: string;
}

interface UpdateProfileForm {
  fullName: string;
  phoneNumber: string;
  department: string;
}

interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const router = useRouter();

  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<UpdateProfileForm>();
  const { register: registerPassword, handleSubmit: handlePasswordSubmit, formState: { errors: passwordErrors }, watch, reset: resetPassword } = useForm<ChangePasswordForm>();

  // Toast message function
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove toast after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 3000);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/Login');
      return;
    }

    const userObj = JSON.parse(userData);
    setUser(userObj);
    
    // Fetch full user details
    fetchUserDetails(userObj.id);
  }, [router]);

  const fetchUserDetails = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${userId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const userDetails = await response.json();
        setUser(userDetails);
        resetProfile({
          fullName: userDetails.fullName,
          phoneNumber: userDetails.phoneNumber || '',
          department: userDetails.department || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error);
      showToast('Failed to load profile details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const onProfileUpdate = async (data: UpdateProfileForm) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${user.id}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Profile updated successfully!', 'success');
        
        // Update local user data
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPasswordChange = async (data: ChangePasswordForm) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${user.id}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword
        }),
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Password changed successfully! Redirecting to login...', 'success');
        resetPassword();
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          // Logout and redirect to login
          localStorage.removeItem('user');
          router.push('/Login');
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePhotoByUrl = async (photoUrl: string) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${user.id}/photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl }),
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Photo updated successfully!', 'success');
        
        // Update local user data
        const updatedUser = { ...user, photoUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setShowUrlInput(false);
        setPhotoUrlInput('');
      } else {
        throw new Error('Failed to update photo');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.length) return;
    
    const file = e.target.files[0];
    
    try {
      // Create a simple URL for the uploaded file
      const photoUrl = URL.createObjectURL(file);
      
      const response = await fetch(`http://localhost:3000/employees/${user.id}/photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ photoUrl }),
        credentials: 'include'
      });

      if (response.ok) {
        showToast('Photo updated successfully!', 'success');
        
        // Update local user data
        const updatedUser = { ...user, photoUrl };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        throw new Error('Failed to update photo');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your profile</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Toast Container */}
      <div className="toast toast-top toast-end z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${
              toast.type === 'success' ? 'alert-success' :
              toast.type === 'error' ? 'alert-error' : 'alert-info'
            } shadow-lg mb-2`}
          >
            <div>
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <div className="tabs mb-6">
        <a 
          className={`tab tab-bordered ${activeTab === 'profile' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('profile')}
        >
          Profile Information
        </a> 
        <a 
          className={`tab tab-bordered ${activeTab === 'password' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('password')}
        >
          Change Password
        </a>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body items-center text-center">
                <div className="avatar mb-4">
                  <div className="w-32 rounded-full">
                    <img src={user.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} alt="Profile" />
                  </div>
                </div>
                <h2 className="card-title">{user.fullName}</h2>
                <p>{user.email}</p>
                {user.department && <p className="badge badge-primary mt-2">{user.department}</p>}
                {user.status && <p className="badge badge-secondary mt-1">{user.status}</p>}
                
                <div className="mt-4 space-y-2 w-full">
                  {!showUrlInput ? (
                    <>
                      <label htmlFor="photo-upload" className="btn btn-primary btn-sm w-full">
                        Change Photo
                      </label>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onPhotoChange}
                      />
                      <button 
                        className="btn btn-outline btn-sm w-full"
                        onClick={() => setShowUrlInput(true)}
                      >
                        Use URL Instead
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <input
                        type="url"
                        placeholder="Enter image URL"
                        className="input input-bordered input-sm w-full"
                        value={photoUrlInput}
                        onChange={(e) => setPhotoUrlInput(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-success btn-sm flex-1"
                          onClick={() => updatePhotoByUrl(photoUrlInput)}
                          disabled={!photoUrlInput}
                        >
                          Update Photo
                        </button>
                        <button 
                          className="btn btn-error btn-sm flex-1"
                          onClick={() => {
                            setShowUrlInput(false);
                            setPhotoUrlInput('');
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h2 className="card-title mb-4">Personal Information</h2>
                <form onSubmit={handleProfileSubmit(onProfileUpdate)}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Full Name *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${profileErrors.fullName ? 'input-error' : ''}`}
                        {...registerProfile('fullName', { required: 'Full name is required' })}
                      />
                      {profileErrors.fullName && (
                        <span className="text-error text-sm">{profileErrors.fullName.message}</span>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Email</span>
                      </label>
                      <input
                        type="email"
                        className="input input-bordered"
                        value={user.email}
                        disabled
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Phone Number</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${profileErrors.phoneNumber ? 'input-error' : ''}`}
                        {...registerProfile('phoneNumber')}
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Department</span>
                      </label>
                      <input
                        type="text"
                        className="input input-bordered"
                        {...registerProfile('department')}
                      />
                    </div>

                    {user.age && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Age</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered"
                          value={user.age}
                          disabled
                        />
                      </div>
                    )}

                    {user.gender && (
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Gender</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={user.gender}
                          disabled
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-control mt-6">
                    <button
                      type="submit"
                      className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'password' && (
        <div className="card bg-base-100 shadow-md max-w-2xl mx-auto">
          <div className="card-body">
            <h2 className="card-title mb-4">Change Password</h2>
            <form onSubmit={handlePasswordSubmit(onPasswordChange)}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password *</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                  {...registerPassword('currentPassword', { required: 'Current password is required' })}
                />
                {passwordErrors.currentPassword && (
                  <span className="text-error text-sm">{passwordErrors.currentPassword.message}</span>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">New Password *</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered ${passwordErrors.newPassword ? 'input-error' : ''}`}
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
                      message: 'Password must contain uppercase, lowercase, number and special character'
                    }
                  })}
                />
                {passwordErrors.newPassword && (
                  <span className="text-error text-sm">{passwordErrors.newPassword.message}</span>
                )}
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Confirm New Password *</span>
                </label>
                <input
                  type="password"
                  className={`input input-bordered ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                  {...registerPassword('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === watch('newPassword') || 'Passwords do not match'
                  })}
                />
                {passwordErrors.confirmPassword && (
                  <span className="text-error text-sm">{passwordErrors.confirmPassword.message}</span>
                )}
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}