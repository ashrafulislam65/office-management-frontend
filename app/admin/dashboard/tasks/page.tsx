// // "use client";

// // import { useState, useEffect } from "react";
// // import axios from "axios";
// // import ProtectedRoute from "@/app/component/ProtectedRoute";

// // interface EmployeeTask {
// //   id: string;
// //   title: string;
// //   description: string;
// //   dueDate: string;
// //   status: string;
// //   assignedTo: {
// //     id: number;
// //     fullName: string;
// //   };
// //   submissionUrl?: string;
// //   submittedAt?: string;
// // }

// // interface Employee {
// //   id: number;
// //   fullName: string;
// // }

// // export default function TasksPage() {
// //   const [tasks, setTasks] = useState<EmployeeTask[]>([]);
// //   const [employees, setEmployees] = useState<Employee[]>([]);
// //   const [showForm, setShowForm] = useState(false);
// //   const [formData, setFormData] = useState({
// //     title: "",
// //     description: "",
// //     dueDate: new Date().toISOString().split("T")[0],
// //     employeeId: 0,
// //   });
// //   const [adminId, setAdminId] = useState("");

// //   useEffect(() => {
// //     fetchAdminId();
// //     fetchTasks();
// //     fetchEmployees();
// //   }, []);

// //   const fetchAdminId = async () => {
// //     try {
// //       const response = await axios.get("localhost:9001/admin/users/session", { withCredentials: true });
// //       setAdminId(response.data.id);
// //     } catch (error) {
// //       console.error("Failed to fetch admin ID:", error);
// //     }
// //   };

// //   const fetchTasks = async () => {
// //     try {
// //       const response = await axios.get("localhost:9001/admin/users/:adminId/employee-tasks", {
// //         withCredentials: true,
// //       });
// //       setTasks(response.data);
// //     } catch (error) {
// //       console.error("Failed to fetch tasks:", error);
// //     }
// //   };

// //   const fetchEmployees = async () => {
// //     try {
// //       const response = await axios.get("Localhost:9001/admin/users/employee-tasks/:employeeId", { withCredentials: true });
// //       setEmployees(response.data);
// //     } catch (error) {
// //       console.error("Failed to fetch employees:", error);
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(
// //         "localhost:9001/admin/users/:adminId/employee-tasks",
// //         formData,
// //         { withCredentials: true }
// //       );
// //       setShowForm(false);
// //       setFormData({
// //         title: "",
// //         description: "",
// //         dueDate: new Date().toISOString().split("T")[0],
// //         employeeId: 0,
// //       });
// //       fetchTasks();
// //     } catch (error) {
// //       console.error("Failed to create task:", error);
// //     }
// //   };

// //   const handleStatusUpdate = async (taskId: string, status: string) => {
// //     try {
// //       await axios.patch(
// //         "localhost:9001/admin/users/employee-tasks/submit/:taskId",
// //         { status },
// //         { withCredentials: true }
// //       );
// //       fetchTasks();
// //     } catch (error) {
// //       console.error("Failed to update task status:", error);
// //     }
// //   };

// //   return (
// //     <ProtectedRoute requiredRole="admin">
// //       <div className="max-w-7xl mx-auto py-6 px-4">
// //         <div className="flex justify-between items-center mb-6">
// //           <h1 className="text-2xl font-bold">Task Management</h1>
// //           <button
// //             onClick={() => setShowForm(true)}
// //             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
// //           >
// //             Assign Task
// //           </button>
// //         </div>

// //         {showForm && (
// //           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
// //             <div className="bg-white p-6 rounded-lg w-full max-w-md">
// //               <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
// //               <form onSubmit={handleSubmit}>
// //                 <div className="mb-4">
// //                   <label className="block text-sm font-medium mb-1">Title</label>
// //                   <input
// //                     type="text"
// //                     value={formData.title}
// //                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
// //                     className="w-full p-2 border rounded"
// //                     required
// //                   />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-sm font-medium mb-1">Description</label>
// //                   <textarea
// //                     value={formData.description}
// //                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
// //                     className="w-full p-2 border rounded"
// //                     rows={3}
// //                     required
// //                   ></textarea>
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-sm font-medium mb-1">Due Date</label>
// //                   <input
// //                     type="date"
// //                     value={formData.dueDate}
// //                     onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
// //                     className="w-full p-2 border rounded"
// //                     required
// //                   />
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block text-sm font-medium mb-1">Assign To</label>
// //                   <select
// //                     value={formData.employeeId}
// //                     onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
// //                     className="w-full p-2 border rounded"
// //                     required
// //                   >
// //                     <option value={0}>Select Employee</option>
// //                     {employees.map((emp) => (
// //                       <option key={emp.id} value={emp.id}>
// //                         {emp.fullName}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //                 <div className="flex justify-end space-x-2">
// //                   <button
// //                     type="button"
// //                     onClick={() => setShowForm(false)}
// //                     className="px-4 py-2 border rounded"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //                   >
// //                     Assign
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}

// //         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
// //           {tasks.map((task) => (
// //             <div key={task.id} className="bg-white p-4 rounded-lg shadow">
// //               <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
// //               <p className="text-gray-600 mb-3">{task.description}</p>
// //               <div className="mb-2">
// //                 <span className="font-medium">Assigned to:</span> {task.assignedTo.fullName}
// //               </div>
// //               <div className="mb-2">
// //                 <span className="font-medium">Due:</span>{" "}
// //                 {new Date(task.dueDate).toLocaleDateString()}
// //               </div>
// //               <div className="mb-3">
// //                 <span className="font-medium">Status:</span>{" "}
// //                 <span
// //                   className={`px-2 py-1 rounded text-xs ${
// //                     task.status === "submitted"
// //                       ? "bg-green-100 text-green-800"
// //                       : "bg-yellow-100 text-yellow-800"
// //                   }`}
// //                 >
// //                   {task.status}
// //                 </span>
// //               </div>
// //               {task.submissionUrl && (
// //                 <div className="mb-3">
// //                   <span className="font-medium">Submission:</span>{" "}
// //                   <a
// //                     href={task.submissionUrl}
// //                     target="_blank"
// //                     rel="noopener noreferrer"
// //                     className="text-blue-500 hover:underline"
// //                   >
// //                     View Submission
// //                   </a>
// //                 </div>
// //               )}
// //               <div className="flex space-x-2">
// //                 <select
// //                   value={task.status}
// //                   onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
// //                   className="border rounded p-1 text-sm"
// //                 >
// //                   <option value="pending">Pending</option>
// //                   <option value="submitted">Submitted</option>
// //                 </select>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </ProtectedRoute>
// //   );
// // }



// // app/admin/dashboard/tasks/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import ProtectedRoute from "@/app/component/ProtectedRoute";

// interface EmployeeTask {
//   id: string;
//   title: string;
//   description: string;
//   dueDate: string;
//   status: string;
//   assignedTo: {
//     id: number;
//     fullName: string;
//   };
//   submissionUrl?: string;
//   submittedAt?: string;
// }

// interface Employee {
//   id: number;
//   fullName: string;
// }

// export default function TasksPage() {
//   const [tasks, setTasks] = useState<EmployeeTask[]>([]);
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     dueDate: new Date().toISOString().split("T")[0],
//     employeeId: 0,
//   });
//   const [adminId, setAdminId] = useState("");

//   useEffect(() => {
//     fetchAdminId();
//     fetchEmployees();
//   }, []);

//   useEffect(() => {
//     if (adminId) {
//       fetchTasks();
//     }
//   }, [adminId]);

//   const fetchAdminId = async () => {
//     try {
//         const response = await api.get("/session");
//       setAdminId(response.data.id);
//     } catch (error) {
//       console.error("Failed to fetch admin ID:", error);
//     }
//   };

//   const fetchTasks = async () => {
//     try {
//       const response = await api.get(`/${adminId}/employee-tasks`);
//       setTasks(response.data);
//     } catch (error) {
//       console.error("Failed to fetch tasks:", error);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const response = await api.get("/employees");
//       setEmployees(response.data);
//     } catch (error) {
//       console.error("Failed to fetch employees:", error);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await api.post(
//         `/${adminId}/employee-tasks`,
//         formData
//       );
//       setShowForm(false);
//       setFormData({
//         title: "",
//         description: "",
//         dueDate: new Date().toISOString().split("T")[0],
//         employeeId: 0,
//       });
//       fetchTasks();
//     } catch (error) {
//       console.error("Failed to create task:", error);
//     }
//   };

//   const handleStatusUpdate = async (taskId: string, status: string) => {
//     try {
//       await api.patch(
//         `/employee-tasks/${taskId}`,
//         { status }
//       );
//       fetchTasks();
//     } catch (error) {
//       console.error("Failed to update task status:", error);
//     }
//   };

//   return (
//     <ProtectedRoute requiredRole="admin">
//       <div className="max-w-7xl mx-auto py-6 px-4">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-bold">Task Management</h1>
//           <button
//             onClick={() => setShowForm(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Assign Task
//           </button>
//         </div>

//         {showForm && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white p-6 rounded-lg w-full max-w-md">
//               <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
//               <form onSubmit={handleSubmit}>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Title</label>
//                   <input
//                     type="text"
//                     value={formData.title}
//                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Description</label>
//                   <textarea
//                     value={formData.description}
//                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     rows={3}
//                     required
//                   ></textarea>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Due Date</label>
//                   <input
//                     type="date"
//                     value={formData.dueDate}
//                     onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
//                     className="w-full p-2 border rounded"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium mb-1">Assign To</label>
//                   <select
//                     value={formData.employeeId}
//                     onChange={(e) => setFormData({ ...formData, employeeId: parseInt(e.target.value) })}
//                     className="w-full p-2 border rounded"
//                     required
//                   >
//                     <option value={0}>Select Employee</option>
//                     {employees.map((emp) => (
//                       <option key={emp.id} value={emp.id}>
//                         {emp.fullName}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="flex justify-end space-x-2">
//                   <button
//                     type="button"
//                     onClick={() => setShowForm(false)}
//                     className="px-4 py-2 border rounded"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                   >
//                     Assign
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {tasks.map((task) => (
//             <div key={task.id} className="bg-white p-4 rounded-lg shadow">
//               <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
//               <p className="text-gray-600 mb-3">{task.description}</p>
//               <div className="mb-2">
//                 <span className="font-medium">Assigned to:</span> {task.assignedTo.fullName}
//               </div>
//               <div className="mb-2">
//                 <span className="font-medium">Due:</span>{" "}
//                 {new Date(task.dueDate).toLocaleDateString()}
//               </div>
//               <div className="mb-3">
//                 <span className="font-medium">Status:</span>{" "}
//                 <span
//                   className={`px-2 py-1 rounded text-xs ${
//                     task.status === "submitted"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {task.status}
//                 </span>
//               </div>
//               {task.submissionUrl && (
//                 <div className="mb-3">
//                   <span className="font-medium">Submission:</span>{" "}
//                   <a
//                     href={task.submissionUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline"
//                   >
//                     View Submission
//                   </a>
//                 </div>
//               )}
//               <div className="flex space-x-2">
//                 <select
//                   value={task.status}
//                   onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
//                   className="border rounded p-1 text-sm"
//                 >
//                   <option value="pending">Pending</option>
//                   <option value="submitted">Submitted</option>
//                 </select>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }  




"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ProtectedRoute from "@/app/component/ProtectedRoute";

interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  assignedTo: {
    id: number;
    fullName: string;
  };
  submissionUrl?: string;
  submittedAt?: string;
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
  });
  const [adminId, setAdminId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminId();
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchTasks();
    }
  }, [adminId]);

  const fetchAdminId = async () => {
    try {
      const response = await api.get("/session");
      // Assuming your session endpoint returns an object with id property
      setAdminId(response.data.id || response.data.adminId);
    } catch (error) {
      console.error("Failed to fetch admin ID:", error);
      setError("Failed to authenticate. Please try again.");
    }
  };

  const fetchTasks = async () => {
    try {
      // Using the correct endpoint from your backend
      const response = await api.get(`/employee-tasks`);
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
      await api.post("/employee-tasks", {
        ...formData,
        adminId: adminId // Include adminId in the request body
      });
      
      setShowForm(false);
      setFormData({
        title: "",
        description: "",
        dueDate: new Date().toISOString().split("T")[0],
        employeeId: 0,
      });
      fetchTasks();
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to create task. Please try again.");
    }
  };

  const handleStatusUpdate = async (taskId: string, status: string) => {
    try {
      await api.patch(`/employee-tasks/${taskId}`, { status });
      fetchTasks();
    } catch (error) {
      console.error("Failed to update task status:", error);
      setError("Failed to update task status. Please try again.");
    }
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading tasks...</div>
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
          <h1 className="text-2xl font-bold">Task Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Assign Task
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Assign New Task</h2>
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
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                <p className="text-gray-600 mb-3">{task.description}</p>
                <div className="mb-2">
                  <span className="font-medium">Assigned to:</span> {task.assignedTo.fullName}
                </div>
                <div className="mb-2">
                  <span className="font-medium">Due:</span>{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
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
                <div className="flex space-x-2">
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
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              No tasks assigned yet. Click "Assign Task" to create one.
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}