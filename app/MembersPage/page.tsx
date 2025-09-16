'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Define the employee interface
interface Employee {
  id?: string;
  fullName: string;
  age: number;
  email: string;
  gender: string;
  phoneNumber: string;
  department: string;
  photoUrl?: string;
}

export default function MembersPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch all employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3000/employees', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch employees');
        }
        
        const data = await response.json();
        setEmployees(data);
        setFilteredEmployees(data);
      } catch (err) {
        setError('Error loading employees. Please try again later.');
        console.error('Error fetching employees:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees by department
  useEffect(() => {
    if (selectedDepartment === 'all') {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => 
        emp.department.toLowerCase() === selectedDepartment.toLowerCase()
      );
      setFilteredEmployees(filtered);
    }
  }, [selectedDepartment, employees]);

  // Handle department filter change
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
  };

  // Handle view details button click
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    // @ts-ignore
    document.getElementById('employee_modal').showModal();
  };

  // Get unique departments for filter dropdown
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Team Members</h1>
      
      {/* Department Filter */}
      <div className="flex justify-center mb-8">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Filter by Department</span>
          </label>
          <select 
            className="select select-bordered"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(employee => (
            <div key={employee.id} className="card bg-base-100 shadow-xl">
              <figure className="px-6 pt-6">
                <div className="avatar">
                  <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img 
                      src={employee.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                      alt={employee.fullName}
                    />
                  </div>
                </div>
              </figure>
              <div className="card-body items-center text-center">
                <h2 className="card-title">{employee.fullName}</h2>
                <p><span className="font-semibold">Department:</span> {employee.department}</p>
                <p><span className="font-semibold">Email:</span> {employee.email}</p>
                <div className="card-actions mt-4">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewDetails(employee)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-lg">No employees found in this department.</p>
          </div>
        )}
      </div>

      {/* Employee Details Modal */}
      <dialog id="employee_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          {selectedEmployee && (
            <>
              <h3 className="font-bold text-lg mb-4">{selectedEmployee.fullName}'s Details</h3>
              <div className="flex flex-col items-center mb-4">
                <div className="avatar mb-4">
                  <div className="w-32 rounded-full">
                    <img 
                      src={selectedEmployee.photoUrl || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                      alt={selectedEmployee.fullName}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="text-right font-semibold">Full Name:</div>
                  <div>{selectedEmployee.fullName}</div>
                  
                  <div className="text-right font-semibold">Age:</div>
                  <div>{selectedEmployee.age}</div>
                  
                  <div className="text-right font-semibold">Email:</div>
                  <div>{selectedEmployee.email}</div>
                  
                  <div className="text-right font-semibold">Gender:</div>
                  <div>{selectedEmployee.gender}</div>
                  
                  <div className="text-right font-semibold">Phone:</div>
                  <div>{selectedEmployee.phoneNumber}</div>
                  
                  <div className="text-right font-semibold">Department:</div>
                  <div>{selectedEmployee.department}</div>
                </div>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}