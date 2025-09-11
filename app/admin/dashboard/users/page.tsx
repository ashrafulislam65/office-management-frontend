// app/admin/dashboard/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/app/component/ProtectedRoute";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  status: string;
  gender: string;
  phoneNumber: string;
}

interface Hr {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  isWorking: boolean;
}

export default function UsersPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [hrs, setHrs] = useState<Hr[]>([]);
  const [activeTab, setActiveTab] = useState<"employees" | "hr">("employees");

  useEffect(() => {
    fetchEmployees();
    fetchHrs();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchHrs = async () => {
    try {
      const response = await api.get("/hr-management");
      setHrs(response.data);
    } catch (error) {
      console.error("Failed to fetch HRs:", error);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("employees")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "employees"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Employees ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab("hr")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hr"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              HR Managers ({hrs.length})
            </button>
          </nav>
        </div>

        {activeTab === "employees" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{employee.gender}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          employee.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {employee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "hr" && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hrs.map((hr) => (
                  <tr key={hr.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{hr.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hr.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hr.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hr.isWorking
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {hr.isWorking ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}