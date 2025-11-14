import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Contexts/AuthContext";
import Footer from "./Footer";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { user, addToCart, wishlist, addToWishlist } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [addingToCart, setAddingToCart] = useState({});
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      toast.info("Please login to add products to your cart!");
      navigate("/login");
      return;
    }

    if (addingToCart[product.id]) return;

    setAddingToCart((prev) => ({ ...prev, [product.id]: true }));

    try {
      const res = await addToCart(product.id, 1);
      if (res.success) {
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product.id]: false }));
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!user) {
      toast.info("Please login to add products to your wishlist!");
      navigate("/login");
      return;
    }

    const exists = wishlist.find((w) => w.product.id === product.id);
    if (exists) {
      toast.info("Already in wishlist!");
      return;
    }

    await addToWishlist(product.id);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      navigate(`/subscribe-page`);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://13.204.186.114/api/products/");
        const data = await res.json();
        const normalized = (data || []).map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.original_price,
          discountPercentage: p.discount_percentage,
          image:
            p.images?.[0]?.image ||
            p.images?.[0]?.image_url ||
            p.images?.[0]?.images
              ? `http://13.204.186.114${p.images[0].image || p.images[0].image_url || p.images[0].images}`
              : "https://via.placeholder.com/300",
          isActive: p.is_active !== false,
          rating: p.reviews?.[0]?.rating || 4.5,
        }));
        const filtered = normalized.filter((p) => p.isActive !== false);
        setProducts(filtered.slice(0, 8));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const brands = [
    { id: 1, name: "Nike", logo: "/Icons/nike.png" },
    { id: 2, name: "Adidas", logo: "/Icons/adidas.png" },
    { id: 3, name: "Puma", logo: "/Icons/puma.png" },
    { id: 4, name: "Reebok", logo: "/Icons/reebok.png" },
    { id: 5, name: "New Balance", logo: "/Icons/newbalance.png" },
    { id: 6, name: "Jordan", logo: "/Icons/jordan.png" },
  ];

  const testimonials = [
    {
      id: 1,
      name: "I.M. Vijayan",
      role: "Indian Football Legend",
      content:
        "The quality and craftsmanship of products at Hopyfy Cart truly stand out. From apparel to accessories, everything reflects excellence and passion for the game.",
      rating: 5,
    },
    {
      id: 2,
      name: "B. Ravi Pillai",
      role: "Business Leader",
      content:
        "Hopyfy Cart combines quality with reliability. Their attention to detail and commitment to customer satisfaction make every purchase a pleasant experience.",
      rating: 4,
    },
    {
      id: 3,
      name: "Jordan Geller",
      role: "Sneaker Collector",
      content:
        "Hopyfy Cart brings real energy to the sneaker scene. The quality, packaging, and vibe are on point — feels like unboxing a grail every time!",
      rating: 5,
    },
  ];

  const features = [
    {
      icon: Truck,
      title: "Fast & Free Delivery",
      description: "Get your products within 2-4 days with our express shipping.",
      color: "blue",
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "100% encrypted & trusted payment options with SSL protection.",
      color: "green",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Chat, Email, and Phone support available anytime you need help.",
      color: "purple",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "No-hassle returns within 30 days with our satisfaction guarantee.",
      color: "red",
    },
  ];

  return (
    <div className="overflow-hidden bg-white">
      <div className="relative h-[90vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/Videos/shoe.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/70 z-10"></div>
        </div>
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight text-white drop-shadow-lg font-serif">
              Hello Your <span className="text-blue-400">Style</span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto font-light tracking-wide drop-shadow-md">
              Premium footwear crafted for elegance and comfort in every step
            </p>
            <Link to="/product">
              <button className="group relative px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto">
                Shop Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 tracking-wide">
          Brands We Carry
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 flex items-center justify-center mb-3 transition-transform group-hover:scale-110 duration-300">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-16 max-w-16 object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-gray-700">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-wide mb-2">
                Recent Drops
              </h2>
              <p className="text-gray-600">Discover our latest premium footwear collection</p>
            </div>
            <Link
              to="/product"
              className="group text-blue-600 hover:text-blue-700 flex items-center gap-2 font-semibold transition-all bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-xl"
            >
              View All 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 animate-pulse"
                >
                  <div className="h-72 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-12 bg-gray-200 rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-gray-50 rounded-2xl">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No products available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Check back soon for new arrivals!</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
                >
                  {product.discountPercentage > 0 && (
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-1.5 px-3 rounded-full z-10 shadow-lg">
                      {product.discountPercentage}% OFF
                    </div>
                  )}

                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 transition-all duration-300"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        wishlist.find((w) => w.product.id === product.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }`}
                    />
                  </button>

                  <Link to={`/product/${product.id}`} className="block relative overflow-hidden">
                    <div className="h-72 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>

                  <div className="p-6">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </Link>

                    {product.category && (
                      <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">
                        {product.category}
                      </span>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating}
                      </span>
                      <span className="text-xs text-gray-400">(128)</span>
                    </div>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-gray-900">
                        ₹{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product.id]}
                      className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 ${
                        addingToCart[product.id]
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:scale-95"
                      }`}
                    >
                      {addingToCart[product.id] ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Added!
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative h-[400px] md:h-[500px]">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 z-10"></div>
            <img
              src="/Images/air.jpg"
              alt="Nike promotion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center px-6 md:px-12">
              <div className="max-w-lg text-white">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-wider">
                  AIR
                </h2>
                <p className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  GRAVITY WILL NEVER
                  <br />
                  BE THE SAME
                </p>
                <Link to="/product?brand=nike">
                  <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl hover:bg-gray-100 font-semibold group transition-all shadow-lg">
                    Shop Nike Collection
                    <ArrowRight
                      className="transition-transform group-hover:translate-x-1"
                      size={18}
                    />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
            Why Choose Hopyfy Cart
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're committed to providing the best shopping experience with
            premium products and exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center"
            >
              <div
                className={`w-16 h-16 bg-${feature.color}-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className={`w-8 h-8 text-${feature.color}-600`} />
              </div>
              <h4 className="font-bold text-lg mb-3 text-gray-800">
                {feature.title}
              </h4>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">
                "{testimonial.content}"
              </p>
              <div>
                <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the Hopyfy Community
          </h2>
          <p className="mb-8 text-blue-100 max-w-2xl mx-auto text-lg">
            Subscribe to get updates on new arrivals, exclusive discounts, and
            special promotions.
          </p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row justify-center gap-3 max-w-xl mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-4 rounded-xl w-full text-gray-900 bg-white border-2 border-transparent focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200 placeholder:text-gray-500 shadow-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 whitespace-nowrap transition-all shadow-lg hover:shadow-xl"
            >
              Subscribe
            </button>
          </form>
          <p className="text-blue-100 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy and consent to
            receive updates.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;