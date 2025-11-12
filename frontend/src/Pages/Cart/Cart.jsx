import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useAuth } from "../../Contexts/AuthContext";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useAuth();
  const [updatingItem, setUpdatingItem] = useState(null);

  const getFirstImage = (images) => {
    if (!images || images.length === 0) return "/Images/default-product.png";
    const img = images[0];
    return img?.image || img?.image_url || "/Images/default-product.png";
  };

  const cartDetails = useMemo(
    () =>
      cart.map((item) => ({
        id: item.id,
        name: item.product?.name || "Unnamed Product",
        price: item.product?.price || 0,
        quantity: item.quantity,
        image: getFirstImage(item.product?.images),
        stock: item.product?.stock || 0,
      })),
    [cart]
  );

  const total = useMemo(
    () => cartDetails.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [cartDetails]
  );

  const handleRemove = async (cartItemId) => {
    setUpdatingItem(cartItemId);
    await removeFromCart(cartItemId);
    setUpdatingItem(null);
  };

  const handleUpdateQuantity = async (cartItemId, qty, stock) => {
    if (qty < 1 || qty > stock) return;
    setUpdatingItem(cartItemId);
    await updateQuantity(cartItemId, qty);
    setUpdatingItem(null);
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } },
  };

  if (!cartDetails.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-22">
        <motion.img
          src="/Images/emptycart.png"
          alt="Empty Cart"
          className="w-40 mb-6"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">Add items to your cart to get started.</p>
        <Link
          to="/product"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <motion.div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-3 mb-8">
        <FiShoppingCart className="text-3xl text-green-600" />
        <h1 className="text-3xl font-bold text-gray-800">Your Shopping Cart</h1>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {cartDetails.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/4 h-48 md:h-auto">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h2>
                    <p className="text-green-600 font-medium text-lg mb-4">
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.stock)}
                        disabled={item.quantity <= 1 || updatingItem === item.id}
                        className={`p-2 rounded-full ${
                          item.quantity <= 1
                            ? "bg-gray-200 text-gray-400"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        <FiMinus size={16} />
                      </button>
                      <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.stock)}
                        disabled={updatingItem === item.id || item.quantity >= item.stock}
                        className={`p-2 rounded-full ${
                          item.quantity >= item.stock
                            ? "bg-gray-200 text-gray-400"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                        }`}
                      >
                        <FiPlus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updatingItem === item.id}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors"
                      title="Remove item"
                    >
                      <FiTrash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
            <span className="text-gray-500">{cartDetails.length} {cartDetails.length === 1 ? "item" : "items"}</span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">₹{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <span className="text-lg font-semibold">Total</span>
              <span className="text-xl font-bold text-green-600">₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/product"
              className="flex-1 text-center px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/checkout"
              className="flex-1 text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            >
              Proceed to Checkout
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Cart;
