import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, X, ArrowRight, Star } from "lucide-react";
import { useEffect, useState } from "react";

const WishlistPage = () => {
  const { user, wishlist, removeFromWishlist, moveToCart } = useAuth();
  const navigate = useNavigate();

  const [removingItems, setRemovingItems] = useState({});
  const [movingItems, setMovingItems] = useState({});
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);

  useEffect(() => {
    if (!wishlist.length) {
      const timer = setTimeout(() => setShowEmptyMessage(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowEmptyMessage(false);
    }
  }, [wishlist]);

  const getFirstImage = (images) => {
    if (!images || images.length === 0) return "/placeholder-product.jpg";
    const img = images[0];
    return img?.image || img?.image_url || "/placeholder-product.jpg";
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center p-8 bg-white rounded-xl shadow-sm border max-w-md"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">
            Please sign in to view your wishlist
          </h2>
          <p className="text-gray-500 mb-6 text-sm">
            Sign in to save and manage your favorite items easily.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
          >
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  const handleRemove = async (wishlistId) => {
    setRemovingItems((prev) => ({ ...prev, [wishlistId]: true }));
    await removeFromWishlist(wishlistId);
    setRemovingItems((prev) => ({ ...prev, [wishlistId]: false }));
  };

  const handleMoveToCart = async (item) => {
    setMovingItems((prev) => ({ ...prev, [item.id]: true }));
    await moveToCart(item.product.id, 1);
    setMovingItems((prev) => ({ ...prev, [item.id]: false }));
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          ❤️ Your Wishlist
        </h1>
        <p className="text-gray-500 text-sm">
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"} saved
        </p>
      </motion.div>

      <AnimatePresence>
        {wishlist.length === 0 && showEmptyMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl shadow-inner"
          >
            <div className="bg-pink-100 p-6 rounded-full mb-6 shadow-sm">
              <Heart className="w-12 h-12 text-pink-500" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-6 max-w-md text-center">
              Save your favorite products to easily find them later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              Continue Shopping <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {wishlist.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100 relative group transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={getFirstImage(item.product.images)}
                  alt={item.product.name}
                  className="w-full h-56 object-cover cursor-pointer"
                  onClick={() => navigate(`/product/${item.product.id}`)}
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  disabled={removingItems[item.id]}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-sm hover:bg-gray-100 transition disabled:opacity-50"
                >
                  {removingItems[item.id] ? (
                    <span className="inline-block h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <X size={16} className="text-gray-600" />
                  )}
                </button>

                {item.product.discountPercentage && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    {item.product.discountPercentage}% OFF
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3
                  onClick={() => navigate(`/product/${item.product.id}`)}
                  className="font-semibold text-lg mb-2 cursor-pointer hover:text-blue-600 line-clamp-1"
                >
                  {item.product.name}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < (item.product.rating || 0)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">
                    ({item.product.reviewCount || 0})
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{item.product.price.toLocaleString()}
                  </span>
                  {item.product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={movingItems[item.id]}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  {movingItems[item.id] ? (
                    <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Move to Cart
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {wishlist.length > 0 && (
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition flex items-center gap-2 mx-auto"
          >
            Continue Shopping <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
