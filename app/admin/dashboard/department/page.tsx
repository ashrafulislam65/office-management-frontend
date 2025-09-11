 "use client";

import axios from "axios";
import ProtectedRoute from "@/app/component/ProtectedRoute";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface Department {
  id: string;
  departmentType: string;
  role: string;
  employee: {
    id: string;
    fullName: string;
  };
  admin: {
    adminId: string;
    Email: string;
  };
  joiningDate: string;
  isActive: boolean;
}

interface Employee {
  id: string;
  fullName: string;
  email: string;
}

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    departmentType: "",
    role: "",
    employeeId: 0,
    joiningDate: new Date().toISOString().split("T")[0],
    isActive: true,
    adminEmail: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminEmail();
  }, []);

  useEffect(() => {
    if (adminEmail) {
      fetchDepartments();
      fetchEmployees();
    }
  }, [adminEmail]);

  const fetchAdminEmail = async () => {
    try {
      setLoading(true);
      const response = await api.get("/session");
      setAdminEmail(response.data.email);
      setFormData(prev => ({ ...prev, adminEmail: response.data.email }));
    } catch (error: any) {
      console.error("Error fetching admin email:", error);
      setError("Failed to fetch admin information. Please check your authentication.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/departments/by-email/${adminEmail}`);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
      setError("Failed to load employees.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/departments/by-email/${adminEmail}/${editingId}`, formData);
      } else {
        await api.post("/departments/by-email", formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        departmentType: "",
        role: "",
        employeeId: 0,
        joiningDate: new Date().toISOString().split("T")[0],
        isActive: true,
        adminEmail: adminEmail,
      });
      fetchDepartments();
    } catch (error) {
      console.error("Failed to save department:", error);
      setError("Failed to save department. Please try again.");
    }
  };

  const handleEdit = (dept: Department) => {
    setFormData({
      departmentType: dept.departmentType,
      role: dept.role,
      employeeId: Number(dept.employee.id),
      joiningDate: dept.joiningDate.split("T")[0],
      isActive: dept.isActive,
      adminEmail: adminEmail,
    });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this department?")) return;
    
    try {
      await api.delete(`/departments/by-email/${adminEmail}/${id}`);
      fetchDepartments();
    } catch (error) {
      console.error("Failed to delete department:", error);
      setError("Failed to delete department. Please try again.");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading department data...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 px-4">
        {error && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
            <p className="font-bold">Notice</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Department Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Department
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? "Edit Department" : "Add New Department"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Department Type</label>
                  <select
                    value={formData.departmentType}
                    onChange={(e) => setFormData({ ...formData, departmentType: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Select Type</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Technical Supporter">Technical Supporter</option>
                    <option value="Network Engineer">Network Engineer</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Employee</label>
                  <select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value={0}>Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                    id="isActive"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium">
                    Active
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {editingId ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joining Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {departments.map((dept) => (
                <tr key={dept.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.departmentType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{dept.employee.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(dept.joiningDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        dept.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {dept.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(dept)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dept.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}