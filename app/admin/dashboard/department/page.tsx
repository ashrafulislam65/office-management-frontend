//  "use client";

// import axios from "axios";
// import ProtectedRoute from "@/app/component/ProtectedRoute";
// import { useEffect, useState } from "react";
// import api from "@/lib/api";

// interface Department {
//   id: string;
//   departmentType: string;
//   role: string;
//   employee: {
//     id: string;
//     fullName: string;
//   };
//   admin: {
//     adminId: string;
//     Email: string;
//   };
//   joiningDate: string;
//   isActive: boolean;
// }

// interface Employee {
//   id: string;
//   fullName: string;
//   email: string;
// }

// export default function DepartmentPage() {
//   const [departments, setDepartments] = useState<Department[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     departmentType: "",
//     role: "",
//     employeeId: 0,
//     joiningDate: new Date().toISOString().split("T")[0],
//     isActive: true,
//     adminEmail: "",
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [adminEmail, setAdminEmail] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchAdminEmail();
//   }, []);

//   useEffect(() => {
//     if (adminEmail) {
//       fetchDepartments();
//       fetchEmployees();
//     }
//   }, [adminEmail]);

//   const fetchAdminEmail = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get("/session");
//       setAdminEmail(response.data.email);
//       setFormData(prev => ({ ...prev, adminEmail: response.data.email }));
//     } catch (error: any) {
//       console.error("Error fetching admin email:", error);
//       setError("Failed to fetch admin information. Please check your authentication.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`/departments/by-email/${adminEmail}`);
//       setDepartments(response.data);
//     } catch (error) {
//       console.error("Error fetching departments:", error);
//       setError("Failed to load departments.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const response = await api.get("/employees");
//       setEmployees(response.data);
//     } catch (error) {
//       console.error("Error fetching employees:", error);
//       setError("Failed to load employees.");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await api.put(`/departments/by-email/${adminEmail}/${editingId}`, formData);
//       } else {
//         await api.post("/departments/by-email", formData);
//       }
//       setShowForm(false);
//       setEditingId(null);
//       setFormData({
//         departmentType: "",
//         role: "",
//         employeeId: 0,
//         joiningDate: new Date().toISOString().split("T")[0],
//         isActive: true,
//         adminEmail: adminEmail,
//       });
//       fetchDepartments();
//     } catch (error) {
//       console.error("Failed to save department:", error);
//       setError("Failed to save department. Please try again.");
//     }
//   };

//   const handleEdit = (dept: Department) => {
//     setFormData({
//       departmentType: dept.departmentType,
//       role: dept.role,
//       employeeId: Number(dept.employee.id),
//       joiningDate: dept.joiningDate.split("T")[0],
//       isActive: dept.isActive,
//       adminEmail: adminEmail,
//     });
//     setEditingId(dept.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm("Are you sure you want to delete this department?")) return;
    
//     try {
//       await api.delete(`/departments/by-email/${adminEmail}/${id}`);
//       fetchDepartments();
//     } catch (error) {
//       console.error("Failed to delete department:", error);
//       setError("Failed to delete department. Please try again.");
//     }
//   };

//   if (loading) {
//     return (
//       <ProtectedRoute requiredRole="admin">
//         <div className="max-w-7xl mx-auto py-6 px-4">
//           <div className="flex justify-center items-center h-64">
//             <div className="text-xl">Loading department data...</div>
//           </div>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   return (
//     <ProtectedRoute requiredRole="admin">
//       <div className="max-w-7xl mx-auto py-6 px-4">
//         {error && (
//           <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
//             <p className="font-bold">Notice</p>
//             <p>{error}</p>
//           </div>
//         )}
        
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Department Management</h1>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Add Department
//           </button>
//         </div>

//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white p-6 rounded-lg w-full max-w-md">
//               <h2 className="text-xl font-semibold mb-4">
//                 {editingId ? "Edit Department" : "Add New Department"}
//               </h2>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Department Type</label>
//                   <select
//                     value={formData.departmentType}
//                     onChange={(e) => setFormData({ ...formData, departmentType: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value="">Select Type</option>
//                     <option value="Software Engineer">Software Engineer</option>
//                     <option value="Technical Supporter">Technical Supporter</option>
//                     <option value="Network Engineer">Network Engineer</option>
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Role</label>
//                   <input
//                     type="text"
//                     value={formData.role}
//                     onChange={(e) => setFormData({ ...formData, role: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Employee</label>
//                   <select
//                     value={formData.employeeId}
//                     onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value={0}>Select Employee</option>
//                     {employees.map((emp) => (
//                       <option key={emp.id} value={emp.id}>
//                         {emp.fullName} ({emp.email})
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Joining Date</label>
//                   <input
//                     type="date"
//                     value={formData.joiningDate}
//                     onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4 flex items-center">
//                   <input
//                     type="checkbox"
//                     checked={formData.isActive}
//                     onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
//                     className="mr-2"
//                     id="isActive"
//                   />
//                   <label htmlFor="isActive" className="text-sm font-medium">
//                     Active
//                   </label>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowForm(false);
//                       setEditingId(null);
//                     }}
//                     className="px-4 py-2 border rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     {editingId ? "Update" : "Create"}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className="bg-white shadow rounded-lg overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Department
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Role
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Employee
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Joining Date
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {departments.map((dept) => (
//                 <tr key={dept.id}>
//                   <td className="px-6 py-4 whitespace-nowrap">{dept.departmentType}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{dept.role}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">{dept.employee.fullName}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     {new Date(dept.joiningDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         dept.isActive
//                           ? "bg-green-100 text-green-800"
//                           : "bg-red-100 text-red-800"
//                       }`}
//                     >
//                       {dept.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                     <button
//                       onClick={() => handleEdit(dept)}
//                       className="text-indigo-600 hover:text-indigo-900 mr-3"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(dept.id)}
//                       className="text-red-600 hover:text-red-900"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }


// app/admin/dashboard/tasks/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  assignedTo: {
    id: number;
    fullName: string;
  };
  submissionUrl?: string;
  submittedAt?: string;
  assignedBy: string;
}

interface Employee {
  id: number;
  fullName: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<EmployeeTask[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    employeeId: 0,
    priority: "medium",
  });
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [editingTask, setEditingTask] = useState<EmployeeTask | null>(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const router = useRouter();

  useEffect(() => {
    fetchAdminId();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchTasks();
    }
  }, [adminId]);

  const showNotification = (message: string, type: string) => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000);
  };

  const fetchAdminId = async () => {
    try {
      const response = await api.get("/session");
      setAdminId(response.data.id || response.data.adminId);
    } catch (error) {
      console.error("Failed to fetch admin ID:", error);
      setError("Failed to authenticate. Please try again.");
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await api.get(`/${adminId}/employee-tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to load employees. Please try again later.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await api.patch(`/employee-tasks/${editingTask.id}`, {
          title: formData.title,
          description: formData.description,
          dueDate: formData.dueDate,
          priority: formData.priority,
        });
        showNotification("Task updated successfully!", "success");
        setEditingTask(null);
      } else {
        await api.post(`/${adminId}/employee-tasks`, formData);
        showNotification("Task assigned successfully!", "success");
      }
      
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        employeeId: 0,
        priority: "medium",
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to create task. Please try again.");
    }
  };

  const handleEdit = (task: EmployeeTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate.split('T')[0],
      employeeId: task.assignedTo.id,
      priority: task.priority || "medium",
    });
    setShowForm(true);
  };

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      await api.patch(`/employee-tasks/${taskId}`, { status });
      showNotification("Task status updated!", "success");
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await api.delete(`/employee-tasks/${taskId}`);
      showNotification("Task deleted successfully!", "success");
      fetchTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      setError("Failed to delete task. Please try again.");
    }
  };

  const filteredTasks = tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-xl">Loading tasks...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 ${
          notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {notification.message}
        </div>
      )}
      
      {error && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Notice</p>
          <p>{error}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Assign Task
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Search</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Search tasks..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingTask ? "Edit Task" : "Assign New Task"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Assign To</label>
                <select
                  value={formData.employeeId}
                  onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value={0}>Select Employee</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTask(null);
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {editingTask ? "Update" : "Assign"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow relative">
              <div className={`absolute top-0 left-0 w-2 h-full ${
                task.priority === "high" ? "bg-red-500" : 
                task.priority === "medium" ? "bg-yellow-500" : "bg-green-500"
              }`}></div>
              <div className="ml-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{task.title}</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleEdit(task)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="mb-2">
                  <span className="font-medium">Assigned to:</span> {task.assignedTo.fullName}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Priority:</span>{" "}
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === "high" ? "bg-red-100 text-red-800" : 
                    task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="mb-3">
                  <span className="font-medium">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      task.status === "submitted"
                        ? "bg-green-100 text-green-800"
                        : task.status === "in-progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
                {task.submissionUrl && (
                  <div className="mb-3">
                    <span className="font-medium">Submission:</span>{" "}
                    <a
                      href={task.submissionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Submission
                    </a>
                  </div>
                )}
                <div className="flex space-x-2 items-center">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                    className="border rounded p-1 text-sm"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="submitted">Submitted</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No tasks found. {searchTerm || filterStatus !== "all" || filterPriority !== "all" ? "Try changing your filters." : "Click 'Assign Task' to create one."}
          </div>
        )}
      </div>
    </div>
  );
}