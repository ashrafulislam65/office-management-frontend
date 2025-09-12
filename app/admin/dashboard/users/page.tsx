// // app/admin/dashboard/users/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import ProtectedRoute from "@/app/component/ProtectedRoute";

// interface Employee {
//   id: number;
//   fullName: string;
//   email: string;
//   status: string;
//   gender: string;
//   phoneNumber: string;
// }

// interface Hr {
//   id: number;
//   fullName: string;
//   email: string;
//   phone: string;
//   isWorking: boolean;
// }

// export default function UsersPage() {
//   const [employees, setEmployees] = useState<Employee[]>([]);
//   const [hrs, setHrs] = useState<Hr[]>([]);
//   const [activeTab, setActiveTab] = useState<"employees" | "hr">("employees");

//   useEffect(() => {
//     fetchEmployees();
//     fetchHrs();
//   }, []);

//   const fetchEmployees = async () => {
//     try {
//       const response = await api.get("/employees");
//       setEmployees(response.data);
//     } catch (error) {
//       console.error("Failed to fetch employees:", error);
//     }
//   };

//   const fetchHrs = async () => {
//     try {
//       const response = await api.get("/hr-management");
//       setHrs(response.data);
//     } catch (error) {
//       console.error("Failed to fetch HRs:", error);
//     }
//   };

//   return (
//     <ProtectedRoute requiredRole="admin">
//       <div className="max-w-7xl mx-auto py-6 px-4">
//         <h1 className="text-2xl font-bold mb-6">User Management</h1>

//         <div className="border-b border-gray-200 mb-6">
//           <nav className="-mb-px flex space-x-8">
//             <button
//               onClick={() => setActiveTab("employees")}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === "employees"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               Employees ({employees.length})
//             </button>
//             <button
//               onClick={() => setActiveTab("hr")}
//               className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                 activeTab === "hr"
//                   ? "border-blue-500 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               HR Managers ({hrs.length})
//             </button>
//           </nav>
//         </div>

//         {activeTab === "employees" && (
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Gender
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {employees.map((employee) => (
//                   <tr key={employee.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">{employee.fullName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{employee.phoneNumber}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{employee.gender}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           employee.status === "active"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {employee.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {activeTab === "hr" && (
//           <div className="bg-white shadow rounded-lg overflow-hidden">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Phone
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {hrs.map((hr) => (
//                   <tr key={hr.id}>
//                     <td className="px-6 py-4 whitespace-nowrap">{hr.fullName}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{hr.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">{hr.phone}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                           hr.isWorking
//                             ? "bg-green-100 text-green-800"
//                             : "bg-red-100 text-red-800"
//                         }`}
//                       >
//                         {hr.isWorking ? "Active" : "Inactive"}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </ProtectedRoute>
//   );
// }  


// app/admin/dashboard/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/app/component/ProtectedRoute";

interface Employee {
  id: number;
  fullName: string;
  email: string;
  status: string;
  gender: string;
  phoneNumber: string;
  department?: string;
  position?: string;
  hireDate?: string;
  address?: string;
}

interface Hr {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  isWorking: boolean;
  department?: string;
  hireDate?: string;
}

export default function UsersPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [hrs, setHrs] = useState<Hr[]>([]);
  const [activeTab, setActiveTab] = useState<"employees" | "hr">("employees");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Employee | Hr | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  
  const router = useRouter();

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
    } finally {
      setLoading(false);
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

  const handleUserClick = (user: Employee | Hr) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredHrs = hrs.filter(hr => {
    const matchesSearch = hr.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hr.department?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || (hr.isWorking ? "active" : "inactive") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-xl">Loading users...</div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">User Management</h1>

        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Search users..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

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
              Employees ({filteredEmployees.length})
            </button>
            <button
              onClick={() => setActiveTab("hr")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "hr"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              HR Managers ({filteredHrs.length})
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
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(employee)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            {employee.fullName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                          <div className="text-sm text-gray-500">{employee.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.department || "N/A"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{employee.position || "N/A"}</td>
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
            {filteredEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No employees found. {searchTerm || statusFilter !== "all" ? "Try changing your filters." : ""}
              </div>
            )}
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
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHrs.map((hr) => (
                  <tr 
                    key={hr.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleUserClick(hr)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                            {hr.fullName.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{hr.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hr.department || "N/A"}</td>
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
            {filteredHrs.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No HR managers found. {searchTerm || statusFilter !== "all" ? "Try changing your filters." : ""}
              </div>
            )}
          </div>
        )}

        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">User Details</h2>
                <button
                  onClick={() => setShowUserModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-2xl">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium">{selectedUser.fullName}</h3>
                  <p className="text-gray-500">{'email' in selectedUser ? selectedUser.email : ''}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {'phoneNumber' in selectedUser ? (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedUser.phoneNumber}</span>
                  </div>
                ) : (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{selectedUser.phone}</span>
                  </div>
                )}
                
                {'department' in selectedUser && selectedUser.department && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span>{selectedUser.department}</span>
                  </div>
                )}
                
                {'position' in selectedUser && selectedUser.position && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position:</span>
                    <span>{selectedUser.position}</span>
                  </div>
                )}
                
                {'gender' in selectedUser && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span>{selectedUser.gender}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ('status' in selectedUser && selectedUser.status === "active") || 
                      ('isWorking' in selectedUser && selectedUser.isWorking)
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {'status' in selectedUser ? selectedUser.status : (selectedUser.isWorking ? "Active" : "Inactive")}
                  </span>
                </div>
                
                {'hireDate' in selectedUser && selectedUser.hireDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hire Date:</span>
                    <span>{new Date(selectedUser.hireDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                {'address' in selectedUser && selectedUser.address && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="text-right">{selectedUser.address}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    router.push(`/admin/dashboard/users/${'status' in selectedUser ? 'employee' : 'hr'}/${selectedUser.id}`);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}