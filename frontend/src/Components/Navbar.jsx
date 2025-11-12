import { useState, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Heart, ShoppingCart, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout, cart, wishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (user) {
      const wishlistArray = Array.isArray(wishlist) ? wishlist : [];
      const cartArray = Array.isArray(cart) ? cart : [];

      const wCount = wishlistArray.length;
      const cCount = cartArray.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      );

      setWishlistCount(wCount);
      setCartCount(cCount);
    } else {
      setWishlistCount(0);
      setCartCount(0);
    }
  }, [user, cart, wishlist]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileMenuOpen(false), [location]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = ["Home", "Product", "My Orders", "About"];
  const navBackground = "backdrop-blur-md bg-white/80";
  const navShadow = isScrolled ? "shadow-md" : "shadow-sm";
  const textColor = "text-gray-900";
  const hoverColor = "hover:text-blue-600";

  return (
    <>
      <nav
        className={`${navBackground} ${navShadow} py-2 px-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300`}
      >
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="./logo.png" alt="Logo" className="w-20" />
        </div>

        <ul className="hidden md:flex space-x-6">
          {navItems.map((item) => {
            const path =
              item === "Home"
                ? "/"
                : `/${item.toLowerCase().replace(" ", "-")}`;
            return (
              <li key={item}>
                <Link
                  to={path}
                  className={`${textColor} ${hoverColor} font-medium relative transition-colors duration-200`}
                >
                  {item}
                  {location.pathname === path && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                      layoutId="navbar-underline"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link to="/wishlist" className="flex items-center">
                  <Heart className={textColor} size={24} />
                  {wishlistCount > 0 && (
                    <motion.span
                      animate={{ backgroundPositionX: [0, 100] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 bg-[length:200%_100%] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center z-10"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link to="/cart" className="flex items-center">
                  <ShoppingCart className={textColor} size={24} />
                  {cartCount > 0 && (
                    <motion.span
                      animate={{ backgroundPositionX: [0, 100] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 bg-[length:200%_100%] text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center z-10"
                    >
                      {cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>
            </>
          )}

          <motion.button
            className="md:hidden"
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={textColor} size={24} />
            ) : (
              <Menu className={textColor} size={24} />
            )}
          </motion.button>

          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <span className={`${textColor} font-medium hidden sm:inline`}>
                Welcome, {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-full font-medium shadow transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="hidden md:flex space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="text-gray-800 border border-gray-300 hover:border-blue-600 hover:text-blue-600 px-4 py-1 rounded-full font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-1 rounded-full font-bold shadow transition-colors"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-lg overflow-hidden sticky top-[72px] z-40"
          >
            <div className="p-4 space-y-4">
              {navItems.map((item) => {
                const path =
                  item === "Home"
                    ? "/"
                    : `/${item.toLowerCase().replace(" ", "-")}`;
                return (
                  <Link
                    key={item}
                    to={path}
                    className="block py-2 text-gray-800 font-medium hover:text-blue-600 transition-colors"
                  >
                    {item}
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <div className="text-gray-800 font-medium">
                      Welcome, {user.username}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full text-gray-800 font-medium px-4 py-2 border border-gray-300 rounded-full hover:border-blue-600 hover:text-blue-600 transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full bg-blue-600 text-white px-4 py-2 rounded-full font-bold hover:bg-blue-700 transition-colors"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
