import React from "react";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md p-8 md:p-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-6">
          Terms of Service
        </h1>
        <p className="text-gray-500 text-center mb-10">
          <strong>Last Updated:</strong> October 10, 2025
        </p>

        <p className="text-gray-700 leading-relaxed mb-8">
          Welcome to <strong>Hopyfy Cart</strong>! By accessing or purchasing from our
          website, you agree to the following Terms of Service. Please read them
          carefully before using our platform.
        </p>

        <Section title="1. General Information">
          Hopyfy Cart (“we”, “us”, “our”) is an online store selling premium
          products. By using our services, you confirm that you are at least 18
          years old or have parental permission to shop.
        </Section>

        <Section title="2. Orders & Payments">
          All prices are displayed in USD. We reserve the right to cancel
          any order due to stock unavailability or payment failure.
        </Section>

        <Section title="3. Shipping & Delivery">
          We deliver to most regions within the United States. Delivery timelines may
          vary. Customers must provide accurate shipping information.
        </Section>

        <Section title="4. Returns & Refunds">
          Returns are accepted within 30 days of delivery for unused, undamaged
          items. Refunds will be processed after inspection.
        </Section>

        <Section title="5. Product Warranty">
          Manufacturing defects are covered for 6 months. Damage from misuse
          is not covered.
        </Section>

        <Section title="6. Account Responsibility">
          You are responsible for maintaining your account’s security.
        </Section>

        <Section title="7. Intellectual Property">
          All content on Hopyfy Cart is protected. Unauthorized usage is
          prohibited.
        </Section>

        <Section title="8. Limitation of Liability">
          We are not liable for indirect damages caused by delays, misuse, or
          technical issues.
        </Section>

        <Section title="9. Changes to Terms">
          We may update these terms at any time.
        </Section>

        <Section title="10. Contact Us">
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

export default TermsOfService;