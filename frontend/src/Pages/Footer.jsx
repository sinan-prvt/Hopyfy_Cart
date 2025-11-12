import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Please enter your email address!");
      return;
    }
    localStorage.setItem("subscribedEmail", email);
    setEmail("");
    navigate("/subscribe-page");
  };

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-9 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="space-y-5">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-200 to-purple-300 w-10 h-10 rounded-lg flex items-center justify-center mr-3">
              <img src={"./logo.png"} alt="Hopyfy Logo" />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Hopyfy Cart
            </h2>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your go-to shop for trending products and best prices. We deliver
            happiness right to your doorstep with fast shipping and excellent
            customer service.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">
            Support
          </h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link
                to="/faq"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                FAQ
              </Link>
            </li>
            <li>
              <Link
                to="/shipping"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link
                to="/returns"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link
                to="/privacypolicy"
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 group"
              >
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:animate-pulse"></span>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-5 pb-2 border-b border-gray-700 inline-block">
            Stay Updated
          </h3>
          <div className="space-y-5">
            <div>
              <p className="flex items-center text-sm text-gray-300 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                hopyfycart@gmail.com
              </p>
              <p className="flex items-center text-sm text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                +91-9400850450
              </p>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-300 mb-3">
                Subscribe to our newsletter for the latest updates and offers
              </p>
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg text-sm font-medium transition-all duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Hopyfy Cart. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a
              href="/terms-of-services"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Terms of Service
            </a>
            <a
              href="/privacypolicy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="/cookies-policy"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
