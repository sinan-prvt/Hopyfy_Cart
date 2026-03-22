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
        toast.success("Added to cart!");
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
        const mockProducts = [
          {
            id: 1,
            name: "Nike Air Max 270 React",
            price: 12999,
            originalPrice: 15999,
            discountPercentage: 19,
            image: "/Images/mock_shoe_1.png",
            category: "Running",
            isActive: true,
            rating: 4.8,
          },
          {
            id: 2,
            name: "Nike Air Force 1 Premium",
            price: 8999,
            originalPrice: 10999,
            discountPercentage: 18,
            image: "/Images/mock_shoe_2.png",
            category: "Lifestyle",
            isActive: true,
            rating: 4.9,
          },
          {
            id: 3,
            name: "Nike Dunk High Retro",
            price: 15499,
            originalPrice: 16999,
            discountPercentage: 8,
            image: "/Images/mock_shoe_3.png",
            category: "Streetwear",
            isActive: true,
            rating: 4.9,
          },
          {
            id: 4,
            name: "Nike Air Jordan 1 Low",
            price: 9999,
            originalPrice: null,
            discountPercentage: 0,
            image: "/Images/mock_shoe_4.png",
            category: "Basketball",
            isActive: true,
            rating: 4.7,
          },
          {
            id: 5,
            name: "Nike Air Max 97",
            price: 16999,
            originalPrice: 18999,
            discountPercentage: 10,
            image: "/Images/mock_shoe_5.png",
            category: "Lifestyle",
            isActive: true,
            rating: 4.6,
          },
          {
            id: 6,
            name: "Adidas Ultraboost 22",
            price: 15999,
            originalPrice: 17999,
            discountPercentage: 11,
            image: "/Images/mock_shoe_6.png",
            category: "Running",
            isActive: true,
            rating: 4.7,
          },
          {
            id: 7,
            name: "Puma RS-X Clean",
            price: 7999,
            originalPrice: 9999,
            discountPercentage: 20,
            image: "/Images/mock_shoe_7.png",
            category: "Casual",
            isActive: true,
            rating: 4.5,
          },
          {
            id: 8,
            name: "Vans Old Skool Classic",
            price: 4999,
            originalPrice: null,
            discountPercentage: 0,
            image: "/Images/mock_shoe_8.png",
            category: "Skate",
            isActive: true,
            rating: 4.8,
          },
        ];

        setProducts(mockProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        // Simulate a noticeable network delay for skeleton loading reveal
        setTimeout(() => setLoading(false), 2000);
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
              Elevate Your <span className="text-blue-400">Style</span>
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
                  className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100"
                >
                  <div className="h-72 bg-gray-200 animate-pulse"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4"></div>
                    <div className="flex gap-2 mb-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
                    </div>
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

                  <div
                    onClick={() => navigate("/product")}
                    className="block relative overflow-hidden cursor-pointer"
                  >
                    <div className="h-72 bg-gray-50 flex items-center justify-center p-6 mix-blend-multiply">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-2 mix-blend-multiply drop-shadow-lg"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  <div
                    onClick={() => navigate("/product")}
                    className="p-6 cursor-pointer"
                  >
                    <div className="block">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                      </h3>
                    </div>

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
