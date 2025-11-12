import { useState } from "react";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by visiting the 'My Orders' section after logging into your account."
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, Credit/Debit cards, Net Banking, and Cash on Delivery."
  },
  {
    question: "How do I cancel or change my order?",
    answer:
      "To cancel or change your order, please go to the 'My Orders' page and select the relevant option, or contact our support team."
  },
  {
    question: "Is there a return policy?",
    answer:
      "Yes, we offer a 7-day return policy on most products. Please visit the Returns section for more info."
  },
  {
    question: "Do you offer customer support?",
    answer:
      "Yes! You can reach us via the Contact Us page or email us at support@yourecom.com."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border rounded-md p-4">
            <button
              className="w-full flex justify-between items-center font-semibold text-left"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>
            {openIndex === index && (
              <p className="mt-2 text-gray-700">{faq.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
