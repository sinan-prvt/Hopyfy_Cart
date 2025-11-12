import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { motion } from "framer-motion";
import { Truck, CheckCircle, DollarSign } from "lucide-react";

const Checkout = () => {
  const { cart, checkout, user, api } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    const detailedCart = (cart || []).map((item) => {
      const price = Number(item.product?.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return {
        id: item.product?.id,
        name: item.product?.name,
        image: item.product?.images?.[0]?.image_url || "/placeholder-product.jpg",
        price,
        quantity,
        subtotal: price * quantity,
      };
    });
    setCartItems(detailedCart);
    setTotalAmount(detailedCart.reduce((sum, i) => sum + i.subtotal, 0));
  }, [cart]);

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const validateFields = () => {
    if (!name || !address || !phone || !paymentMode) {
      alert("Please fill all required fields.");
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be 10 digits.");
      return false;
    }
    return true;
  };

  const handleRazorpayPayment = async () => {
    if (!validateFields()) return;
    setIsPlacingOrder(true);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      setIsPlacingOrder(false);
      return;
    }

    try {
      const { data } = await api.post("razorpay/order/", { amount: totalAmount });

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Hopyfy Cart",
        description: "Order Payment",
        order_id: data.razorpay_order_id,
        prefill: { name, email: user?.email, contact: phone },
        theme: { color: "#3399cc" },
        handler: async function (response) {
          try {
            const verify = await api.post("razorpay/verify-payment/", {
              order_id: data.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              shipping_address: address,
              name,
              phone,
              payment_method: "RAZORPAY",
              total_amount: totalAmount,
              items: cartItems,
            });

            if (verify.data.success) {
              alert("Payment Successful!");
              window.location.href = "/my-orders";
            } else {
              alert("Payment verification failed!");
            }
          } catch (err) {
            console.error("Razorpay verify error:", err);
            alert("Payment verification failed!");
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay Initialization Failed:", err);
      alert("Failed to initiate Razorpay payment.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;
    if (!validateFields()) return;

    if (paymentMode === "razorpay") {
      await handleRazorpayPayment();
    } else if (paymentMode === "cod") {
      setIsPlacingOrder(true);
      const result = await checkout("COD", { name, address, phone });
      setIsPlacingOrder(false);
      if (result?.success) window.location.href = "/order-success";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle size={32} className="text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
            {cartItems.length === 0 ? (
              <div className="text-center py-10">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <p className="text-gray-600">Your cart is empty</p>
                <button
                  onClick={() => (window.location.href = "/products")}
                  className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      ) : (
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-medium text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Shipping Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
                <textarea
                  placeholder="Enter complete address"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter 10-digit phone number"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={10}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
            <div className="space-y-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                  paymentMode === "cod"
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMode("cod")}
              >
                <Truck size={20} className="text-green-600" />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-gray-500">Pay when you receive</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-all ${
                  paymentMode === "razorpay"
                    ? "border-yellow-600 bg-yellow-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setPaymentMode("razorpay")}
              >
                <DollarSign size={20} className="text-yellow-600" />
                <div>
                  <p className="font-medium">Razorpay</p>
                  <p className="text-sm text-gray-500">Pay securely online</p>
                </div>
              </motion.button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder || cartItems.length === 0 || !paymentMode}
                className={`w-full mt-4 py-3 rounded-lg text-white font-semibold transition-colors ${
                  isPlacingOrder || !paymentMode
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isPlacingOrder ? "Processing..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
