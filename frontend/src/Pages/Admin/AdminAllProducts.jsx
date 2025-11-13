import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminAllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const navigate = useNavigate();

  const normalizeImage = (img) => {
    if (!img) return "https://via.placeholder.com/100?text=No+Image";

    if (typeof img === "string") {
      if (img.startsWith("http")) return img;
      if (img.startsWith("/media")) return `http://13.204.186.114/api${img}`;
      return `http://13.204.186.114/api/media/${img.replace(/^\/+/, "")}`;
    }

    if (typeof img === "object") {
      if (img.image) return img.image.startsWith("http") ? img.image : `http://13.204.186.114/api${img.image}`;
      if (img.image_url) return img.image_url;
    }

    return "https://via.placeholder.com/100?text=No+Image";
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("products/");
      const list = Array.isArray(res.data) ? res.data : [];

      const normalized = list.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price) || 0,
        stock: Number(p.stock) || 0,
        images: Array.isArray(p.images)
          ? p.images.map((img) => normalizeImage(img))
          : [],
        category: p.category?.name || "",
        isActive: p.is_active !== false,
      }));

      setProducts(normalized);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch products", err);
      setError("Failed to load products. Please try again later.");
      toast.error("Failed to load products. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    toast.info(
      <div className="p-4">
        <div className="text-lg font-medium mb-3">Confirm Deletion</div>
        <p className="mb-4">Are you sure you want to delete this product?</p>
        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-green-200 text-gray-800 rounded hover:bg-gray-300"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              toast.dismiss();
              try {
                await api.delete(`products/${id}/`);
                setProducts(products.filter((product) => product.id !== id));
                toast.success("Product deleted successfully!", {
                  position: "top-right",
                  autoClose: 2000,
                });
              } catch (err) {
                console.error("Failed to delete product", err);
                toast.error("Failed to delete product. Please try again.", {
                  position: "top-right",
                  autoClose: 3000,
                });
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeButton: false,
        draggable: false,
        closeOnClick: false,
        className: "w-full max-w-md",
        bodyClassName: "p-0",
      }
    );
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.patch(`products/${id}/`, {
        is_active: !currentStatus,
      });
      const updatedActive = res.data?.is_active ?? !currentStatus;
      setProducts(
        products.map((product) =>
          product.id === id ? { ...product, isActive: updatedActive } : product
        )
      );
      toast.success(
        `Product marked as ${!currentStatus ? "Active" : "Inactive"}!`,
        { position: "top-right", autoClose: 2000 }
      );
    } catch (err) {
      console.error("Failed to update product status", err);
      toast.error("Failed to update status. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && product.isActive) ||
      (statusFilter === "inactive" && !product.isActive);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Products Management
          </h1>
          <p className="text-gray-600 mt-2">
            {products.length} products • {filteredProducts.length} filtered
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/products/add")}
          className="mt-4 md:mt-0 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 flex items-center shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                toast.info("Filters cleared", { position: "top-right", autoClose: 1500 });
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 bg-gray-200 border rounded-lg overflow-hidden">
                          <img
                            src={p.images?.[0]}
                            alt={p.name}
                            className="h-full w-full object-cover"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/100?text=No+Image")}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{p.name}</div>
                          <div className="text-sm text-gray-500">ID: {p.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4"><div className="text-sm text-gray-900 capitalize">{p.category}</div></td>
                    <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">₹{p.price.toLocaleString()}</div></td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-medium ${p.stock < 10 ? "text-red-600" : "text-gray-900"}`}>
                        {p.stock} {p.stock < 10 && <span className="text-xs text-red-500">(Low stock)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(p.id, p.isActive)}
                        className={`relative inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          p.isActive ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        <button onClick={() => navigate(`/admin/products/edit/${p.id}`)} className="text-blue-600 hover:text-blue-900 flex items-center" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900 flex items-center" title="Delete">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-24 text-center">
                    <div className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" />
                      </svg>
                      <h3 className="mt-4 text-lg font-medium">No products found</h3>
                      <p className="mt-2">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="bg-white px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filteredProducts.length)}</span> of <span className="font-medium">{filteredProducts.length}</span> results
            </div>
            <div className="flex space-x-2">
              <button onClick={() => { if (currentPage > 1) paginate(currentPage - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === 1} className={`px-3 py-1 rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button key={number} onClick={() => { paginate(number); window.scrollTo({ top: 0, behavior: "smooth" }); }} className={`px-3 py-1 rounded-md ${currentPage === number ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>{number}</button>
              ))}
              <button onClick={() => { if (currentPage < totalPages) paginate(currentPage + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} disabled={currentPage === totalPages} className={`px-3 py-1 rounded-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAllProducts;
