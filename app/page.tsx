export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Employee Management System</h1>
          <p className="py-6">
            Welcome to our employee management portal. Register new employees, manage profiles, and keep your team organized.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/Register" className="btn btn-primary">Get Started</a>
            <a href="/Login" className="btn btn-outline">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}