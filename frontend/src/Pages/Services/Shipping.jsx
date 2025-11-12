import { Truck, Timer, CreditCard, MapPin, Phone } from "lucide-react";

const Shipping = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-10">📦 Shipping & Delivery</h1>

      <div className="space-y-10">
        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <Truck className="text-blue-600" />
            <h2 className="text-2xl font-semibold">Shipping Methods</h2>
          </div>
          <p className="text-lg">
            We provide both <strong>Standard</strong> and <strong>Express</strong> shipping
            options across India. Orders are shipped within <strong>1–2 business days</strong> after
            confirmation. You’ll receive tracking details via email and SMS.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <Timer className="text-green-600" />
            <h2 className="text-2xl font-semibold">Delivery Timelines</h2>
          </div>
          <ul className="list-disc ml-6 text-lg space-y-1">
            <li><strong>Standard:</strong> 4–6 business days</li>
            <li><strong>Express:</strong> 1–3 business days</li>
            <li><strong>Remote Areas:</strong> May take 7–10 business days</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <CreditCard className="text-purple-600" />
            <h2 className="text-2xl font-semibold">Shipping Charges</h2>
          </div>
          <ul className="list-disc ml-6 text-lg space-y-1">
            <li><strong>Free</strong> shipping on orders above ₹999</li>
            <li>₹49 shipping for orders below ₹999</li>
            <li>₹99 for Express Shipping (optional)</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="text-orange-600" />
            <h2 className="text-2xl font-semibold">Tracking Orders</h2>
          </div>
          <p className="text-lg">
            Once shipped, you will receive a tracking number via email/SMS. You can also check
            order status in the <strong>My Orders</strong> section on your profile.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-3 mb-3">
            <Phone className="text-red-600" />
            <h2 className="text-2xl font-semibold">Need Help?</h2>
          </div>
          <p className="text-lg">
            Reach out to us at{" "}
            <a href="mailto:hopyfycart@gmail.com" className="text-blue-600 underline">
              hopyfycart@gmail.com
            </a>{" "}
            or call us on{" "}
            <span className="font-medium">+91-9400850450</span>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Shipping;
