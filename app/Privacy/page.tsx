export default function Privacy() {
  return (
    <div className="container mx-auto p-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <div className="bg-base-200 rounded-lg p-6 mb-6">
          <p className="text-lg font-semibold">
            Last Updated: December 15, 2023
          </p>
        </div>

        <h2>1. Information We Collect</h2>
        <p>
          We collect information that you provide directly to us, including when you create an account, 
          use our services, or communicate with us. This may include:
        </p>
        <ul>
          <li>Personal identification information (name, email address, phone number)</li>
          <li>Professional information (job title, department, company details)</li>
          <li>Usage data and analytics</li>
          <li>Communication preferences</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send technical notices, updates, and security alerts</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
        </ul>

        <h2>3. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information against 
          unauthorized access, alteration, disclosure, or destruction.
        </p>

        <h2>4. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and receive a copy of your personal data</li>
          <li>Rectify or update your personal data</li>
          <li>Request deletion of your personal data</li>
          <li>Object to processing of your personal data</li>
          <li>Data portability</li>
        </ul>

        <h2>5. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          Email: privacy@officemanagement.com
          <br />
          Address: 123 Office Street, Business District, City, State 12345
        </p>
      </div>
    </div>
  );
}