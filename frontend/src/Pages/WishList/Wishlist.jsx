import { useAuth } from "../../Contexts/AuthContext";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { user, wishlist, removeFromWishlist, moveToCart } = useAuth();

  const getFirstImage = (images) => {
    if (!images || images.length === 0) return "/placeholder-product.jpg";
    const img = images[0];
    return img?.image || img?.image_url || "/placeholder-product.jpg";
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
        <motion.img
          src="/Images/error.webp"
          alt="Empty Wishlist Illustration"
          className="w-90 mb-6 mt-8"
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.h2
          className="text-xl font-medium text-gray-700"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          Please log in to view your wishlist
        </motion.h2>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10">
        <motion.img
          src="/Images/error.webp"
          alt="Empty Wishlist Illustration"
          className="w-90 mb-6 mt-8"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.h2
          className="text-3xl font-semibold text-gray-800 mb-2"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        >
          Oops! Your wishlist is empty
        </motion.h2>
        <motion.p
          className="text-gray-500 mb-6 max-w-md"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          It looks like you haven’t added any items yet. Start exploring and save your favorites!
        </motion.p>
        <motion.button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          onClick={() => (window.location.href = "/product")}
        >
          Browse Products
        </motion.button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
      {wishlist.map((item) => {
        const product = item.product;
        return (
          <div
            key={item.id}
            className="border rounded shadow p-4 relative bg-white"
          >
            {getFirstImage(product.images) ? (
              <img
                src={getFirstImage(product.images)}
                alt={product.name}
                className="w-full h-40 object-cover rounded cursor-pointer"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                No image
              </div>
            )}

            <h3 className="text-lg font-semibold mt-2 line-clamp-2">{product.name}</h3>
            <p className="text-green-600 font-medium mt-1">₹{product.price}</p>

            <button
              className="absolute top-2 right-2 bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
              onClick={() => removeFromWishlist(item.id)}
            >
              Remove
            </button>

            <button
              onClick={() => moveToCart(product.id)}
              className="mt-2 w-full bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Move to Cart
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Wishlist;
