import { Undo2, Wallet, Clock, Phone } from "lucide-react";

const Returns = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10">🔁 Returns & Refunds</h1>

      <div className="space-y-10">
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Undo2 className="text-red-600" />
            <h2 className="text-2xl font-semibold">Return Policy</h2>
          </div>
          <p className="text-lg">
            We offer hassle-free returns within <strong>7 days</strong> of delivery for most products.
            Items must be unused, in original packaging, and with all tags intact.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="text-green-600" />
            <h2 className="text-2xl font-semibold">Refund Process</h2>
          </div>
          <p className="text-lg">
            Once we receive and verify the returned item, your refund will be processed within{" "}
            <strong>5–7 business days</strong> to the original payment method.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="text-yellow-600" />
            <h2 className="text-2xl font-semibold">Items Not Eligible for Return</h2>
          </div>
          <ul className="list-disc ml-6 text-lg space-y-1">
            <li>Personal care items</li>
            <li>Used or damaged products</li>
            <li>Items without original packaging</li>
            <li>Gift cards or vouchers</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="text-blue-600" />
            <h2 className="text-2xl font-semibold">Need Assistance?</h2>
          </div>
          <p className="text-lg">
            Email us at{" "}
            <a href="mailto:hopyfycart@gmail.com" className="text-blue-600 underline">
              hopyfycart@gmail.com
            </a>{" "}
            or call our support team at{" "}
            <span className="font-semibold">+91-9400850450</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Returns;
