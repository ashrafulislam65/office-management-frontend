export default function Services() {
  const services = [
    {
      title: "Employee Management",
      description: "Complete employee database with profiles, attendance tracking, and performance monitoring.",
      icon: "👥"
    },
    {
      title: "Attendance System",
      description: "Digital attendance tracking with check-in/check-out functionality and reporting.",
      icon: "⏰"
    },
    {
      title: "Task Management",
      description: "Assign and track tasks with deadlines, priorities, and progress monitoring.",
      icon: "✅"
    },
    {
      title: "Leave Management",
      description: "Streamlined leave application and approval process with calendar integration.",
      icon: "🏖️"
    },
    {
      title: "Document Management",
      description: "Secure storage and management of company documents and memorandums.",
      icon: "📄"
    },
    {
      title: "Reporting & Analytics",
      description: "Comprehensive reports and analytics for better decision making.",
      icon: "📊"
    }
  ];

  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12">Our Services</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div key={index} className="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body text-center">
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="card-title justify-center">{service.title}</h3>
              <p>{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg mb-6">Join hundreds of companies that trust our office management system</p>
        <div className="flex gap-4 justify-center">
          <a href="/Register" className="btn btn-primary">Sign Up Now</a>
          <a href="/contact" className="btn btn-outline">Request Demo</a>
        </div>
      </div>
    </div>
  );
}