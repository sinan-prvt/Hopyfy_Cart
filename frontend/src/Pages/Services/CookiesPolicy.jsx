import React from "react";

const CookiesPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
          Cookies Policy
        </h1>
        <p className="text-gray-500 text-center mb-10">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">
          Welcome to <strong>Hopyfy Cart</strong>! This Cookies Policy explains how we use cookies and similar technologies on our website to enhance your browsing experience. By using our platform, you consent to the use of cookies as described below. Please read this policy carefully.
        </p>

        <Section title="1. What Are Cookies?">
          Cookies are small text files stored on your device when you visit our website. They help us improve functionality, analyze usage, and provide personalized content.
        </Section>

        <Section title="2. Types of Cookies We Use">
          We use the following types of cookies: <br />
          - <strong>Essential Cookies:</strong> Necessary for the website to function, such as maintaining your session or cart contents. <br />
          - <strong>Analytics Cookies:</strong> Collect data on how you use our site to improve performance. <br />
          - <strong>Marketing Cookies:</strong> Used to deliver relevant advertisements based on your interests. <br />
          - <strong>Preference Cookies:</strong> Remember your settings, such as language or region preferences.
        </Section>

        <Section title="3. How We Use Cookies">
          Cookies help us: <br />
          - Ensure smooth navigation and functionality. <br />
          - Analyze site traffic and user behavior to enhance our services. <br />
          - Personalize your experience, such as recommending products. <br />
          - Measure the effectiveness of our marketing campaigns.
        </Section>

        <Section title="4. Third-Party Cookies">
          We may use third-party services (e.g., Google Analytics, advertising partners) that set cookies to track usage or deliver targeted ads. These cookies are governed by the respective third-party privacy policies.
        </Section>

        <Section title="5. Managing Cookies">
          You can control cookies through your browser settings. Disabling cookies may affect the functionality of our website. For guidance, visit your browser’s help section.
        </Section>

        <Section title="6. Consent to Cookies">
          By continuing to use our website, you consent to our use of cookies as outlined in this policy. You can withdraw consent by adjusting your browser settings.
        </Section>

        <Section title="7. Updates to This Policy">
          We may update this Cookies Policy periodically to reflect changes in technology or legal requirements. The latest version will always be available on our website.
        </Section>

        <Section title="8. Contact Us">
          Email: support@hopyfycart.com <br />
          Phone: +1-800-555-1234
        </Section>
      </div>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="mb-8 border-b border-gray-200 pb-6">
    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">{title}</h2>
    <p className="text-gray-600 leading-relaxed">{children}</p>
  </div>
);

export default CookiesPolicy;