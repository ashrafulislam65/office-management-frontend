export default function About() {
  return (
    <div className="container mx-auto p-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">About Our Office Management System</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-lg mb-4">
            We provide comprehensive office management solutions that help businesses streamline their operations, 
            improve efficiency, and enhance employee productivity.
          </p>
          <p className="text-lg">
            Our system is designed to handle all aspects of office management from employee tracking to task management, 
            making your workplace more organized and efficient.
          </p>
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
          <ul className="list-disc list-inside space-y-2 text-lg">
            <li>User-friendly interface</li>
            <li>Secure and reliable</li>
            <li>Customizable features</li>
            <li>24/7 customer support</li>
            <li>Regular updates and improvements</li>
          </ul>
        </div>
      </div>

      <div className="bg-base-200 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Company Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="stat-value text-primary">500+</div>
            <div className="stat-desc">Active Users</div>
          </div>
          <div>
            <div className="stat-value text-secondary">50+</div>
            <div className="stat-desc">Companies</div>
          </div>
          <div>
            <div className="stat-value text-accent">99.9%</div>
            <div className="stat-desc">Uptime</div>
          </div>
          <div>
            <div className="stat-value text-info">24/7</div>
            <div className="stat-desc">Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}