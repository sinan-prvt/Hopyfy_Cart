import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";

const ProductCart = ({ product, onShowToast, navigate }) => {
  const { user, wishlist, addToCart, moveToCart, addToWishlist, removeFromWishlist } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (user && wishlist?.length > 0) {
      setIsWishlisted(wishlist.some((w) => w.product?.id === product.id));
    } else {
      setIsWishlisted(false);
    }
  }, [user, wishlist, product.id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/reviews/?product=${product.id}`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);

        const avg = data.length
          ? (data.reduce((acc, r) => acc + (r.rating || 0), 0) / data.length).toFixed(1)
          : 0;
        setAverageRating(avg);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
        setReviews([]);
        setAverageRating(0);
      }
    };
    fetchReviews();
  }, [product.id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) {
      onShowToast("Please login to add products to cart", "error");
      navigate("/login");
      return;
    }

    try {
      const wishItem = wishlist?.find((w) => w.product?.id === product.id);

      if (wishItem) {
        await moveToCart(wishItem.product.id, 1);
      } else {
        await addToCart(product.id, 1);
      }
      onShowToast(`${product.name} added to cart`, "success");
    } catch (err) {
      console.error(err);
      onShowToast("Failed to add to cart", "error");
    }
  };

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!user) {
      onShowToast("Please login to add products to wishlist", "error");
      navigate("/login");
      return;
    }

    try {
      const wishItem = wishlist?.find((w) => w.product?.id === product.id);

      if (wishItem) {
        await removeFromWishlist(wishItem.id);
        onShowToast("Removed from wishlist", "info");
      } else {
        await addToWishlist(product.id);
        onShowToast("Added to wishlist", "success");
      }
    } catch (err) {
      console.error(err);
      onShowToast("Failed to update wishlist", "error");
    }
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return null;
    const first = images[0];
    return first?.image || first?.image_url || first;
  };

  const imageUrl = getImageUrl(product.images);

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col relative"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition-colors"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart
          size={18}
          className={isWishlisted ? "text-red-500 fill-current" : "text-gray-500"}
        />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="flex-grow relative block">
        {imageUrl ? (
          <motion.img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onError={(e) => {
              e.target.classList.add("hidden");
              e.target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div className="w-4/5">
            <Link to={`/product/${product.id}`}>
              <h3 className="font-semibold text-gray-800 hover:text-blue-600 line-clamp-2 text-sm mb-1">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-gray-500 truncate">{product.brand}</p>
          </div>

          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 py-1 rounded text-xs">
            <Star size={12} fill="currentColor" />
            <span>{averageRating}</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-base font-bold text-gray-900">
                ₹{Number(product.price).toLocaleString()}
              </p>
              {product.original_price && product.original_price > product.price && (
                <p className="text-xs text-gray-500 line-through">
                  ₹{Number(product.original_price).toLocaleString()}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs ${
                product.stock === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              <ShoppingCart size={14} />
              <span>Add</span>
            </motion.button>
          </div>

          {reviews.length > 0 && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2 italic">
              “{reviews[0].comment || "No review comment"}”
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCart;
