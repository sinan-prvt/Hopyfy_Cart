import { useState, useEffect } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import api from "../../api";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ShoppingBag,
  Loader,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
} from "lucide-react";

const MyOrders = () => {
  const { user } = useAuth();
  const [previousOrders, setPreviousOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getImageUrl = (product) => {
    if (!product) return "/placeholder-product.jpg";
    const images = product.images || [];
    if (images.length === 0) return "/placeholder-product.jpg";
    const first = images[0];
    return first.image_url || first.images || "/placeholder-product.jpg";
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get("orders/");
        setPreviousOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch previous orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const StatusBadge = ({ status }) => {
    const map = {
      pending: {
        icon: <Clock size={16} />,
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
      },
      processing: {
        icon: <Loader size={16} className="animate-spin" />,
        color: "bg-blue-100 text-blue-800",
        label: "Processing",
      },
      shipped: {
        icon: <CheckCircle size={16} />,
        color: "bg-indigo-100 text-indigo-800",
        label: "Shipped",
      },
      delivered: {
        icon: <CheckCircle size={16} />,
        color: "bg-green-100 text-green-800",
        label: "Delivered",
      },
      cancelled: {
        icon: <XCircle size={16} />,
        color: "bg-red-100 text-red-800",
        label: "Cancelled",
      },
      refunded: {
        icon: <CheckCircle size={16} />,
        color: "bg-gray-100 text-gray-700",
        label: "Refunded",
      },
    };
    const config = map[status?.toLowerCase()] || map.pending;
    return (
      <span
        className={`${config.color} px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
      >
        {config.icon} {config.label}
      </span>
    );
  };

  const PaymentBadge = ({ method, status }) => {
    const isPaid =
      method === "RAZORPAY" ||
      method === "UPI" ||
      status?.toLowerCase() === "paid" ||
      status?.toLowerCase() === "delivered";

    return isPaid ? (
      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <CheckCircle size={14} /> Paid
      </span>
    ) : (
      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
        <XCircle size={14} /> Unpaid
      </span>
    );
  };

  const cancelOrder = async (orderId) => {
    toast.custom(
      (t) => (
        <div
          className={`bg-white shadow-lg rounded-lg p-4 flex flex-col sm:flex-row items-center gap-3 border ${
            t.visible ? "animate-enter" : "animate-leave"
          }`}
        >
          <p className="text-gray-800 font-medium">
            Are you sure you want to cancel this order?
          </p>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const { data } = await api.post(`orders/${orderId}/cancel/`);
                  setPreviousOrders((prev) =>
                    prev.map((o) =>
                      o.id === orderId ? { ...o, status: "cancelled" } : o
                    )
                  );
                  toast.success(data.detail || "Order cancelled successfully!");
                } catch (err) {
                  console.error("Failed to cancel order:", err);
                  toast.error(
                    err.response?.data?.detail ||
                      "Failed to cancel order. Try again."
                  );
                }
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Yes
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
      }
    );
  };

  const canCancelOrder = (order) => {
    const status = order.status?.toLowerCase();
    return status === "pending" || status === "processing";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:px-6">
      <Toaster position="top-right" />
      <div className="flex items-center gap-3 mb-10">
        <ShoppingBag size={32} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          My Orders
        </h1>
      </div>

      {previousOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10">
          <img
            src="/Images/noorder.png"
            alt="No Orders"
            className="w-40 mb-6"
          />
          <h2 className="text-lg font-medium text-gray-600">
            You haven’t placed any orders yet
          </h2>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {previousOrders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((order, idx) => {
                const items = order.items || [];
                const orderTotal =
                  order.total_amount ??
                  items.reduce((sum, item) => {
                    const price = Number(
                      item.product?.price ?? item.price ?? 0
                    );
                    const qty = Number(item.quantity ?? 1);
                    return sum + price * qty;
                  }, 0);

                return (
                  <motion.div
                    key={order.id || idx}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow ${
                      order.status === "cancelled" ? "bg-red-50" : "bg-white"
                    }`}
                  >
                    <div className="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
                      <div>
                        <p
                          className={`font-semibold text-gray-900 ${
                            order.status === "cancelled"
                              ? "line-through text-red-600"
                              : ""
                          }`}
                        >
                          Order #{order.id || idx + 1}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <IndianRupee size={14} /> Payment:{" "}
                          {order.payment_method}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <PaymentBadge
                          method={order.payment_method}
                          status={order.status}
                        />
                        <StatusBadge status={order.status} />

                        {canCancelOrder(order) && (
                          <button
                            onClick={() => cancelOrder(order.id)}
                            className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 hover:bg-red-200"
                          >
                            <XCircle size={14} /> Cancel Order
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-6">
                      <ul className="space-y-6 mb-4">
                        {items.map((item, i) => {
                          const product = item.product || {};
                          const name = product.name || "Unnamed Product";
                          const price = Number(
                            product.price ?? item.price ?? 0
                          );
                          const qty = Number(item.quantity ?? 1);
                          const category =
                            product.category?.name || "Uncategorized";

                          return (
                            <li
                              key={i}
                              className="flex flex-col sm:flex-row justify-between gap-4 border-b pb-5"
                            >
                              <div className="flex items-start gap-4 flex-1">
                                <div className="relative group">
                                  <img
                                    src={getImageUrl(product)}
                                    alt={name}
                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border group-hover:scale-105 transition-transform duration-300"
                                  />
                                </div>

                                <div className="flex-1">
                                  <p className="text-gray-900 font-medium text-lg">
                                    {name}
                                  </p>
                                  <p className="text-sm text-gray-500 mb-1">
                                    Category: {category}
                                  </p>
                                  <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="text-blue-600 text-sm font-medium hover:underline mt-2"
                                  >
                                    View Details
                                  </button>
                                </div>
                              </div>

                              <div className="flex items-center justify-between sm:justify-end sm:flex-col gap-2">
                                <span className="text-gray-900 font-semibold text-lg">
                                  ₹{(price * qty).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Qty: {qty}
                                </span>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="flex justify-between border-t pt-4">
                        <div className="text-gray-700 font-medium">
                          Order Total
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{Number(orderTotal).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </div>
      )}

      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedProduct(null)
          }
        >
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-2xl relative shadow-lg">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 text-lg"
            >
              ✕
            </button>

            <div className="flex flex-col sm:flex-row gap-5">
              <img
                src={getImageUrl(selectedProduct)}
                alt={selectedProduct.name || "Product"}
                className="w-40 h-40 object-cover rounded-lg border"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedProduct.name || "Unnamed Product"}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Category: {selectedProduct.category?.name || "Uncategorized"}
                </p>
                <p className="text-gray-600 mt-3">
                  {selectedProduct.description || "No description available"}
                </p>
                <p className="mt-3 text-lg font-semibold text-gray-900">
                  ₹{selectedProduct.price?.toLocaleString() || 0}
                </p>
                <div className="text-sm text-gray-500 mt-2 space-y-1">
                  <p>Brand: {selectedProduct.brand || "N/A"}</p>
                  <p>Material: {selectedProduct.material || "N/A"}</p>
                  <p>Color: {selectedProduct.color || "N/A"}</p>
                  <p>Sizes: {selectedProduct.sizes?.join(", ") || "N/A"}</p>
                </div>
              </div>
            </div>

            {selectedProduct.images && selectedProduct.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {selectedProduct.images.slice(1).map((img, idx) => (
                  <img
                    key={idx}
                    src={
                      img.image_url || img.images || "/placeholder-product.jpg"
                    }
                    alt={`Extra ${idx + 1}`}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
