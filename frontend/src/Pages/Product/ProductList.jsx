import { useState, useEffect, useMemo } from "react";
import api from "../../api";
import ProductCart from "./ProductCart";
import Footer from "../Footer";
import Toast from "../../Components/Toast";
import { useAuth } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";

function ProductList() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState([0, 99999]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get("products/");
      const list = Array.isArray(res.data) ? res.data : [];

      const normalized = list
        .filter(p => p.is_active !== false)
        .map(p => {
          let firstImage = "";
          if (p.images?.length > 0) {
            const img = p.images[0];
            firstImage = img.image || img.image_url || "";
          }

          return {
            id: p.id,
            name: p.name,
            brand: p.brand,
            price: p.price,
            original_price: p.original_price,
            image: firstImage,
            stock: p.stock,
            category: p.category?.name || "",
            images: p.images || [],
            review_count: p.reviews?.length || 0,
          };
        });

      setProducts(normalized);

      const uniqueCategories = ["All", ...new Set(normalized.map(p => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch Product", error);
      showToast("Failed to load products", "error");
    }
  };

  const processedProducts = useMemo(() => {
    let result = [...products];

    if (searchTerm) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        p =>
          (p.name?.toLowerCase()?.includes(term)) ||
          (p.brand?.toLowerCase()?.includes(term)) ||
          (p.category?.toLowerCase()?.includes(term))
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    result = result.filter(
      p => Number(p.price) >= priceRange[0] && Number(p.price) <= priceRange[1]
    );

    if (sortOption === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "most_reviewed") {
      result.sort((a, b) => b.review_count - a.review_count);
    }

    return result;
  }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

  useEffect(() => {
    setFilteredProducts(processedProducts);
  }, [processedProducts]);

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!products.length)
    return <p className="text-center py-20 text-gray-500">Loading products...</p>;

  return (
    <div className="relative">
      {toast.show && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ show: false, message: "", type: "" })}
          />
        </div>
      )}

      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Shop Products</h1>
          <p className="text-gray-600">Discover our premium collection</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-semibold mb-2">Search Products</h3>
              <input
                type="text"
                placeholder="Search by name, brand, or category"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Category</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        selectedCategory === category
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">
                  Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-blue-600"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>₹0</span>
                  <span>₹100000</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="default">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="most_reviewed">Most Reviewed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCart
                key={product.id}
                product={product}
                user={user}
                onShowToast={showToast}
                navigate={navigate}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-gray-500">No products found.</h3>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductList;
