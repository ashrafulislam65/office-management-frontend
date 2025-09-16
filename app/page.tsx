export default function Home() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold">Welcome to Office Management System</h1>
            <p className="py-6 text-lg">
              Streamline your office operations with our comprehensive management solution. 
              Manage employees, track attendance, handle tasks, and improve workplace efficiency.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="/Login" className="btn btn-primary">Employee Login</a>
              <a href="/Register" className="btn btn-secondary">New Registration</a>
              <a href="/about" className="btn btn-outline">Learn More</a>
              <a href="/Contact" className="btn btn-ghost">Contact Us</a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="card-title">Employee Management</h3>
                <p>Comprehensive employee profiles, attendance tracking, and performance monitoring</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="card-title">Task Management</h3>
                <p>Assign, track, and manage tasks with deadlines and progress monitoring</p>
              </div>
            </div>
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title">Reporting</h3>
                <p>Generate detailed reports on attendance, performance, and productivity</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}