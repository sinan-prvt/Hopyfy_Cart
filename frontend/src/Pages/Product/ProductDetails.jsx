import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api"; 
import { useAuth } from "../../Contexts/AuthContext";
import ReviewForm from "../../Components/ReviewForm";
import {
  Heart,
  HeartOff,
  ShoppingCart,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className={i < full ? "text-yellow-400" : "text-gray-300"}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const MessageToast = ({ type, text }) => {
  if (!text) return null;
  const bgClass =
    type === "error"
      ? "bg-red-100 text-red-700 border-red-300"
      : "bg-green-100 text-green-700 border-green-300";
  return (
    <div
      className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg border shadow-lg ${bgClass}`}
    >
      {text}
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    user,
    addToCart,
    wishlist,
    addToWishlist,
    removeFromWishlist,
  } = useAuth();

  const [product, setProduct] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [productError, setProductError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [reviewSort, setReviewSort] = useState("recent");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMessage, setShowMessage] = useState({ type: "", text: "" });
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoadingProduct(true);
      const res = await api.get(`products/${id}/`);
      setProduct(res.data);
      setProductError(null);
    } catch (err) {
      console.error("Error fetching product:", err);
      setProductError("Product not found");
    } finally {
      setLoadingProduct(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await api.get(`reviews/?product=${id}`);
      const fetchedReviews = res.data || [];
      setReviews(fetchedReviews);
      const avg = fetchedReviews.length
        ? (
            fetchedReviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
            fetchedReviews.length
          ).toFixed(1)
        : 0;
      setAverageRating(avg);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
      setAverageRating(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const isInWishlist = wishlist?.some((item) => item.product.id === product?.id);

  const showTempMessage = (type, text, duration = 3000) => {
    setShowMessage({ type, text });
    setTimeout(() => setShowMessage({ type: "", text: "" }), duration);
  };

  const handleAddToCart = async () => {
    if (!user) return showTempMessage("error", "Please log in first!");
    if (product?.sizes?.length && !selectedSize) {
      setSizeError(true);
      return showTempMessage("error", "Please select a size first!");
    }

    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      console.error("Cart error:", err);
      showTempMessage("error", "Failed to add to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.warn("Please login first!");
      return;
    }

    try {
      const wishItem = wishlist?.find((w) => w.product?.id === product.id);

      if (wishItem) {
        await removeFromWishlist(wishItem.id);
        toast.info("Removed from wishlist");
      } else {
        await addToWishlist(product.id);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update wishlist");
    }
  };

  const addReview = async (newReview) => {
    if (!user) return showTempMessage("error", "Please log in to submit a review");

    const reviewData = {
      product: product.id,
      user: user.id,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {
      const res = await api.post("reviews/", reviewData);
      const createdReview = {
        ...res.data,
        username: user.name || user.username,
        date: new Date().toLocaleDateString(),
      };

      const updated = [createdReview, ...reviews];
      setReviews(updated);

      const avg = (
        updated.reduce((acc, r) => acc + (r.rating || 0), 0) / updated.length
      ).toFixed(1);
      setAverageRating(avg);

      showTempMessage("success", "Review submitted successfully!");
    } catch (err) {
      console.error("Review submission error:", err);
      showTempMessage("error", "Failed to submit review");
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };
  const nextImage = () =>
    setCurrentImageIndex((prev) =>
      prev === product.images?.length - 1 ? 0 : prev + 1
    );
  const prevImage = () =>
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images?.length - 1 : prev - 1
    );
  const toggleReviews = () => setShowAllReviews((prev) => !prev);

  const handleSortChange = (e) => setReviewSort(e.target.value);

  const sortedReviews = [...reviews];
  if (reviewSort === "most_reviewed") {
    sortedReviews.sort((a, b) => b.rating - a.rating);
  } else {
    sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  if (loadingProduct)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (productError)
    return (
      <div className="text-center py-20 text-red-600 text-xl">
        {productError}
      </div>
    );

  if (!product)
    return (
      <div className="text-center py-20 text-gray-600 text-xl">
        No product found.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <MessageToast type={showMessage.type} text={showMessage.text} />

      <div className="text-sm text-gray-500 mb-6">
        Home / {product.category?.name || product.category} /{" "}
        {product.brand?.name || product.brand} /{" "}
        <span className="text-gray-900 font-medium">{product.name}</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
            <div className="relative group">
              <img
                src={
                  product.images[currentImageIndex].images
                    ? `http://13.204.186.114${product.images[currentImageIndex].images}`
                    : product.images[currentImageIndex].image_url
                }
                alt={product.name}
                className="w-full h-[500px] object-contain bg-gray-50 p-8"
              />
              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 rounded-full p-3 shadow-lg transition-all ${
                  isInWishlist
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {isInWishlist ? (
                  <HeartOff className="fill-current" size={24} />
                ) : (
                  <Heart className="fill-current" size={24} />
                )}
              </button>

              {product.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight size={28} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:w-1/2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-gray-500 mb-3">
              {product.brand?.name || product.brand}
            </p>

            {product.description && (
              <p className="text-gray-700 mb-4 whitespace-pre-line">
                {product.description}
              </p>
            )}

            <div className="flex items-center mb-4">
              <Stars rating={averageRating} />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                {averageRating}
              </span>
              <span className="mx-3 text-gray-300">|</span>
              <span className="text-gray-600">{reviews.length} reviews</span>
            </div>

            <div className="mb-8">
              <p className="text-3xl font-bold text-gray-900">
                ₹{product.price.toLocaleString()}
              </p>
              {product.original_price && (
                <p className="text-gray-500 line-through">
                  ₹{product.original_price.toLocaleString()}
                </p>
              )}
            </div>

            {product.sizes?.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-800 text-lg mb-3">
                  Select Size
                </h3>
                {sizeError && (
                  <p className="text-red-500 text-sm mb-3">
                    Please select a size
                  </p>
                )}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`py-3 border-2 rounded-lg transition-all ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-600 font-medium shadow-sm"
                          : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  -
                </button>
                <span className="px-4 py-3 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>
          </div>

          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg text-gray-800">
                Customer Reviews
              </h3>
              <div>
                <label className="mr-2 text-gray-600 text-sm">Sort By:</label>
                <select
                  value={reviewSort}
                  onChange={handleSortChange}
                  className="border border-gray-300 rounded-md p-1 text-sm"
                >
                  <option value="recent">Most Recent</option>
                  <option value="most_reviewed">Most Reviewed</option>
                </select>
              </div>
            </div>

            {loadingReviews ? (
              <p className="text-gray-500">Loading reviews...</p>
            ) : (
              <>
                <ReviewForm productId={product.id} onReviewSubmit={addReview} />

                {reviews.length === 0 && (
                  <p className="text-gray-500 mt-4">No reviews yet.</p>
                )}

                <div className="mt-4 space-y-4">
                  {(showAllReviews ? sortedReviews : sortedReviews.slice(0, 3)).map((r) => (
                    <div key={r.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{r.username}</span>
                        <span className="text-gray-400 text-sm">{r.date}</span>
                      </div>
                      <Stars rating={r.rating} />
                      <p className="text-gray-700 mt-1">{r.comment}</p>
                    </div>
                  ))}
                </div>

                {reviews.length > 3 && (
                  <button
                    onClick={toggleReviews}
                    className="mt-4 text-blue-600 hover:underline font-medium"
                  >
                    {showAllReviews ? "Show Less" : "Show More"}
                  </button>
                )}
              </>
            )}

            {!user && (
              <div className="mt-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-blue-600 hover:underline font-medium"
                >
                  Sign in to write a review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
