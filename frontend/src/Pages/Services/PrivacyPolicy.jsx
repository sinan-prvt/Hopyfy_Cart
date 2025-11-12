const PrivacyPolicy = () => {
  return (
    <div className="bg-white text-gray-800 px-6 py-12 max-w-6xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-lg text-gray-600">Last updated: July 15, 2025</p>
      </div>

      <div className="space-y-10 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold mb-2">1. Introduction</h2>
          <p>
            We value your trust and are committed to protecting your personal information. This Privacy Policy describes how we collect, use, and handle your data when you use our website or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">2. What Information We Collect</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Personal details: name, email, phone number, shipping address</li>
            <li>Account login credentials (securely stored)</li>
            <li>Payment and transaction details</li>
            <li>Browsing and device information (cookies, IP address, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">3. How We Use Your Information</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>To process your orders and deliver products</li>
            <li>To send notifications, updates, and promotions</li>
            <li>To enhance user experience and customer support</li>
            <li>To improve our services, website, and security</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">4. Sharing Your Information</h2>
          <p>
            We never sell your personal data. Information may be shared only with trusted third parties like payment gateways and shipping partners — solely to fulfill your orders or improve service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">5. Data Protection & Security</h2>
          <p>
            We use industry-standard encryption and secure servers to protect your data. However, no system is entirely immune to risk. We advise you to protect your login credentials.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">6. Your Rights</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Access and update your account information</li>
            <li>Request deletion of your personal data</li>
            <li>Unsubscribe from marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">7. Cookies</h2>
          <p>
            We use cookies to remember preferences and track activity. You can disable cookies in your browser settings, but this may affect functionality.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">8. Changes to This Policy</h2>
          <p>
            We may update this policy occasionally. All changes will be reflected on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">9. Contact Us</h2>
          <p>
            If you have questions or concerns, feel free to contact us at:
            <br />
            📧 <a href="mailto:hopyfycart@gmail.com" className="text-blue-600 underline">hopyfycart@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
