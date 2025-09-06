// app/unauthorized/page.tsx
export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600 mb-4">You don't have permission to access this page.</p>
        <a href="/dashboard" className="text-indigo-600 hover:text-indigo-800">
          Go back to dashboard
        </a>
      </div>
    </div>
  );
}