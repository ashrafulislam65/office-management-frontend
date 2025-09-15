'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface LeaveApplication {
  employeeId: number;
  type: 'sick' | 'vacation' | 'personal' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  reason?: string;
}

interface LeaveRecord {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  updatedAt: string;
  duration: number;
}

export default function LeavePage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('apply');
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<LeaveApplication>();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        fetchLeaveRecords(userObj.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Invalid user data. Please login again.');
      }
    }
    setIsLoading(false);
  }, []);

  const fetchLeaveRecords = async (employeeId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/leave/employee/${employeeId}`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaveRecords(data);
      } else {
        console.error('Failed to fetch leave records:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch leave records:', error);
      setError('Network error. Please check your connection.');
    }
  };

  const onSubmit = async (data: LeaveApplication) => {
    if (!user) {
      setError('User not found. Please login again.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      console.log('Submitting leave application:', {
        ...data,
        employeeId: user.id
      });

      const response = await fetch('http://localhost:3000/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          employeeId: user.id
        }),
        credentials: 'include'
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Leave application successful:', result);
        
        alert('Leave application submitted successfully!');
        reset();
        fetchLeaveRecords(user.id);
      } else {
        let errorMessage = 'Failed to submit leave application';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
          console.error('Server error details:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        setError(errorMessage);
        alert(errorMessage);
      }
    } catch (error: any) {
      console.error('Network error:', error);
      const errorMessage = error.message || 'Network error. Please check your connection.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
  };

  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const numberOfDays = watchStartDate && watchEndDate ? calculateDays(watchStartDate, watchEndDate) : 0;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning">
          Please log in to access leave management.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Leave Management</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="tabs mb-6">
        <button 
          className={`tab tab-bordered ${activeTab === 'apply' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('apply')}
        >
          Apply for Leave
        </button> 
        <button 
          className={`tab tab-bordered ${activeTab === 'history' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('history')}
        >
          Leave History
        </button>
      </div>

      {activeTab === 'apply' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Apply for Leave</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Leave Type *</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.type ? 'select-error' : ''}`}
                    {...register('type', { required: 'Leave type is required' })}
                  >
                    <option value="">Select leave type</option>
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal Leave</option>
                    <option value="maternity">Maternity Leave</option>
                    <option value="paternity">Paternity Leave</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.type && (
                    <span className="text-error text-sm">{errors.type.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Number of Days</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={numberOfDays > 0 ? `${numberOfDays} days` : ''}
                    disabled
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Start Date *</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered ${errors.startDate ? 'input-error' : ''}`}
                    {...register('startDate', { required: 'Start date is required' })}
                  />
                  {errors.startDate && (
                    <span className="text-error text-sm">{errors.startDate.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">End Date *</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered ${errors.endDate ? 'input-error' : ''}`}
                    {...register('endDate', { 
                      required: 'End date is required',
                      validate: value => {
                        if (watchStartDate && new Date(value) < new Date(watchStartDate)) {
                          return 'End date cannot be before start date';
                        }
                        return true;
                      }
                    })}
                  />
                  {errors.endDate && (
                    <span className="text-error text-sm">{errors.endDate.message}</span>
                  )}
                </div>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Reason (Optional)</span>
                </label>
                <textarea
                  className={`textarea textarea-bordered h-24 ${errors.reason ? 'textarea-error' : ''}`}
                  placeholder="Please provide a reason for your leave (optional)..."
                  {...register('reason')}
                />
                {errors.reason && (
                  <span className="text-error text-sm">{errors.reason.message}</span>
                )}
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Leave Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Leave History</h2>
            
            {leaveRecords.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No leave records found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Start Date</th>
                      <th>End Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th>Applied On</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="capitalize">{record.type}</td>
                        <td>{new Date(record.startDate).toLocaleDateString()}</td>
                        <td>{new Date(record.endDate).toLocaleDateString()}</td>
                        <td>{record.duration || calculateDays(record.startDate, record.endDate)}</td>
                        <td>
                          <span className={`badge ${
                            record.status === 'approved' ? 'badge-success' :
                            record.status === 'rejected' ? 'badge-error' : 'badge-warning'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td>{new Date(record.appliedAt).toLocaleDateString()}</td>
                        <td>{new Date(record.updatedAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}