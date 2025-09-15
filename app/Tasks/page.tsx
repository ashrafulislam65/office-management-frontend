'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Task {
  id?: number;
  employeeId: number;
  title: string;
  description: string;
  url?: string;
  dueDate: string;
  status?: 'pending' | 'in-progress' | 'completed' | 'submitted';
  submittedAt?: string;
  submissionUrl?: string;
}

interface Department {
  id: number;
  name: string;
  description?: string;
  joiningDate: string;
  leavingDate?: string;
}

export default function TasksPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Task>();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const userObj = JSON.parse(userData);
        setUser(userObj);
        fetchTasks(userObj.id);
        fetchDepartments(userObj.id);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setError('Invalid user data. Please login again.');
      }
    }
    setIsLoading(false);
  }, []);

  const fetchTasks = async (employeeId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${employeeId}/tasks`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error('Failed to fetch tasks:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setError('Network error. Please check your connection.');
    }
  };

  const fetchDepartments = async (employeeId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/employees/${employeeId}/department`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        console.error('Failed to fetch departments:', response.status);
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const onSubmit = async (data: Task) => {
    if (!user) {
      setError('User not found. Please login again.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${user.id}/tasks`, {
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

      if (response.ok) {
        const result = await response.json();
        alert('Task created successfully!');
        reset();
        fetchTasks(user.id);
      } else {
        let errorMessage = 'Failed to create task';
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
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

  const submitTask = async (taskId: number, submissionUrl: string) => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3000/employees/${user.id}/tasks/${taskId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionUrl }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Task submitted successfully!');
        fetchTasks(user.id);
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to submit task');
      }
    } catch (error: any) {
      alert(error.message || 'Failed to submit task');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      'pending': 'badge-warning',
      'in-progress': 'badge-info',
      'completed': 'badge-success',
      'submitted': 'badge-primary'
    };
    
    return (
      <span className={`badge ${statusClasses[status as keyof typeof statusClasses] || 'badge-neutral'}`}>
        {status}
      </span>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <div className="alert alert-warning">
          Please log in to access task management.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Task Management</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      
      <div className="tabs mb-6">
        <button 
          className={`tab tab-bordered ${activeTab === 'tasks' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
        >
          My Tasks
        </button> 
        <button 
          className={`tab tab-bordered ${activeTab === 'create' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('create')}
        >
          Create Task
        </button>
        <button 
          className={`tab tab-bordered ${activeTab === 'department' ? 'tab-active' : ''}`} 
          onClick={() => setActiveTab('department')}
        >
          Department
        </button>
      </div>

      {activeTab === 'tasks' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">My Tasks</h2>
            
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No tasks assigned.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id}>
                        <td className="font-semibold">{task.title}</td>
                        <td>{task.description}</td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                        <td>{getStatusBadge(task.status || 'pending')}</td>
                        <td>
                          {task.status === 'pending' || task.status === 'in-progress' ? (
                            <div className="flex gap-2">
                              <input
                                type="url"
                                placeholder="Submission URL"
                                className="input input-bordered input-sm"
                                id={`submission-${task.id}`}
                              />
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  const urlInput = document.getElementById(`submission-${task.id}`) as HTMLInputElement;
                                  if (urlInput.value) {
                                    submitTask(task.id!, urlInput.value);
                                  } else {
                                    alert('Please enter a submission URL');
                                  }
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          ) : task.submissionUrl ? (
                            <a
                              href={task.submissionUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-link btn-sm"
                            >
                              View Submission
                            </a>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'create' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Create New Task</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title *</span>
                  </label>
                  <input
                    type="text"
                    className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                    {...register('title', { required: 'Title is required' })}
                  />
                  {errors.title && (
                    <span className="text-error text-sm">{errors.title.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Description *</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                    {...register('description', { required: 'Description is required' })}
                  />
                  {errors.description && (
                    <span className="text-error text-sm">{errors.description.message}</span>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">URL (Optional)</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered"
                    placeholder="https://example.com"
                    {...register('url')}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Due Date *</span>
                  </label>
                  <input
                    type="date"
                    className={`input input-bordered ${errors.dueDate ? 'input-error' : ''}`}
                    {...register('dueDate', { required: 'Due date is required' })}
                  />
                  {errors.dueDate && (
                    <span className="text-error text-sm">{errors.dueDate.message}</span>
                  )}
                </div>
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'department' && (
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h2 className="card-title mb-4">Department Information</h2>
            
            {departments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No department information available.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Department</th>
                      <th>Description</th>
                      <th>Joining Date</th>
                      <th>Leaving Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td className="font-semibold">{dept.name}</td>
                        <td>{dept.description || 'No description'}</td>
                        <td>{new Date(dept.joiningDate).toLocaleDateString()}</td>
                        <td>{dept.leavingDate ? new Date(dept.leavingDate).toLocaleDateString() : 'Current'}</td>
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