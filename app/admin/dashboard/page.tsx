// // app/admin/dashboard/page.tsx
// "use client"

// import ProtectedRoute from "@/app/component/ProtectedRoute";

// export default function AdminDashboard() {
//   return (
//     <ProtectedRoute requiredRole="admin">
//       <div className="max-w-7xl mx-auto py-6 px-4">
//         <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Dashboard cards */}
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">Users</h2>
//             <p className="text-gray-600">Manage system users</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">Departments</h2>
//             <p className="text-gray-600">Manage departments</p>
//           </div>
//           <div className="bg-white p-6 rounded-lg shadow">
//             <h2 className="text-lg font-semibold mb-2">Reports</h2>
//             <p className="text-gray-600">View system reports</p>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }


 
 // app/admin/dashboard/page.tsx
"use client";

import Link from "next/link";
import ProtectedRoute from "@/app/component/ProtectedRoute";

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/admin/dashboard/users">
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-2">Users</h2>
              <p className="text-gray-600">Manage system users</p>
            </div>
          </Link>
          <Link href="/admin/dashboard/department">
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-2">Departments</h2>
              <p className="text-gray-600">Manage departments</p>
            </div>
          </Link>
          <Link href="/admin/dashboard/tasks">
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-2">Tasks</h2>
              <p className="text-gray-600">Manage employee tasks</p>
            </div>
          </Link>
          <Link href="/admin/email">
            <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-md transition">
              <h2 className="text-lg font-semibold mb-2">Memorandium</h2>
              <p className="text-gray-600">Send message to users</p>
            </div>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}