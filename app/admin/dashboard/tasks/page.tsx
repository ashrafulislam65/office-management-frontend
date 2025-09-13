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
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<EmployeeTask | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
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
      await api.post(`/${adminId}/employee-tasks`, formData);
      showNotification("Task assigned successfully!", "success");
      
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

  const handleSubmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    
    try {
      // Ensure we're sending the submissionUrl as a string in the correct format
      const submissionData = {
        submissionUrl: submissionUrl
      };
      
      await api.patch(`/employee-tasks/submit/${selectedTask.id}`, submissionData);
      showNotification("Submission URL updated successfully!", "success");
      setShowSubmissionForm(false);
      setSelectedTask(null);
      setSubmissionUrl("");
      fetchTasks();
    } catch (error) {
      console.error("Failed to update submission URL:", error);
      setError("Failed to update submission URL. Please try again.");
    }
  };

  const openSubmissionForm = (task: EmployeeTask) => {
    setSelectedTask(task);
    setSubmissionUrl(task.submissionUrl || "");
    setShowSubmissionForm(true);
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

      {showSubmissionForm && selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Update Submission URL</h2>
            <form onSubmit={handleSubmissionSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Task Title</label>
                <p className="font-medium">{selectedTask.title}</p>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Submission URL</label>
                <input
                  type="text"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter submission URL"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter any valid URL string</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSubmissionForm(false);
                    setSelectedTask(null);
                    setSubmissionUrl("");
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Update Submission
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
                      className="text-blue-500 hover:underline break-all"
                    >
                      {task.submissionUrl}
                    </a>
                  </div>
                )}
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2 items-center">
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(task.id, e.target.value)}
                      className="border rounded p-1 text-sm flex-grow"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="submitted">Submitted</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <button
                    onClick={() => openSubmissionForm(task)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    {task.submissionUrl ? "Update Submission" : "Add Submission"}
                  </button>
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