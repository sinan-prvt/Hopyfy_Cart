import React, { useEffect, useState, useCallback, useMemo } from "react";
import api from "../../api";
import { Clock, Loader, ShoppingCart, CheckCircle, XCircle, Search, ChevronDown, ChevronUp, Filter } from "lucide-react";

const AdminAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "created_at", direction: "desc" });
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [validStatuses, setValidStatuses] = useState([]);

  const statusConfig = {
    pending: { text: "Pending", icon: <Clock size={16} />, color: "bg-yellow-100 text-yellow-800", badgeColor: "bg-yellow-500" },
    processing: { text: "Processing", icon: <Loader size={16} className="animate-spin" />, color: "bg-blue-100 text-blue-800", badgeColor: "bg-blue-500" },
    shipped: { text: "Shipped", icon: <ShoppingCart size={16} />, color: "bg-indigo-100 text-indigo-800", badgeColor: "bg-indigo-500" },
    delivered: { text: "Delivered", icon: <CheckCircle size={16} />, color: "bg-green-100 text-green-800", badgeColor: "bg-green-500" },
    cancelled: { text: "Cancelled", icon: <XCircle size={16} />, color: "bg-red-100 text-red-800", badgeColor: "bg-red-500" },
    refunded: { text: "Refunded", icon: <CheckCircle size={16} className="text-green-500" />, color: "bg-gray-100 text-gray-700", badgeColor: "bg-gray-500" }
  };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("admin/orders/");
      const mapped = (data || []).map(o => ({
        id: o.id,
        created_at: o.created_at,
        totalAmount: Number(o.total_amount) || 0,
        status: (o.status || "pending").toLowerCase(),
        userName: o.user_username || "",
        userEmail: o.user_email || "",
        shippingAddress: o.shipping_address || "",
        paymentMode: o.payment_method || "",
        items: (o.items || []).map((i, idx) => ({
          id: i.id || idx,
          name: i.product?.name || "",
          quantity: i.quantity,
          price: Number(i.price) || 0,
          size: i.size || "",
        })),
      }));
      setOrders(mapped);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setError("Failed to fetch orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStatuses = useCallback(async () => {
    try {
      const { data } = await api.get("admin/orders/statuses/");
      setValidStatuses(data.map(s => s.toLowerCase()));
    } catch (err) {
      console.error("Failed to fetch order statuses", err);
      setValidStatuses(['pending','processing','shipped','delivered','cancelled','refunded']);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, [fetchOrders, fetchStatuses]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`admin/orders/${orderId}/`, { status: newStatus });
      setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
    } catch (err) {
      console.error("Failed to update order status", err.response?.data || err.message);
      alert(err.response?.data?.detail || "Failed to update order status.");
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch =
        order.id.toString().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  const sortedOrders = useMemo(() => {
    return [...filteredOrders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredOrders, sortConfig]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader className="animate-spin text-blue-500" size={48} /></div>;
  if (error) return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
        <button onClick={fetchOrders} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">Retry</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400" size={18} />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="text-gray-400" size={18} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            >
              <option value="all">All Statuses</option>
              {validStatuses.map(status => {
                const sInfo = statusConfig[status] || { text: status.charAt(0).toUpperCase() + status.slice(1) };
                return <option key={status} value={status}>{sInfo.text}</option>;
              })}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th onClick={() => handleSort("id")} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Order ID {sortConfig.key === "id" && (sortConfig.direction === "asc" ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />)}</div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th onClick={() => handleSort("totalAmount")} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Total {sortConfig.key === "totalAmount" && (sortConfig.direction === "asc" ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />)}</div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th onClick={() => handleSort("created_at")} className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">Date {sortConfig.key === "created_at" && (sortConfig.direction === "asc" ? <ChevronUp className="ml-1" size={16} /> : <ChevronDown className="ml-1" size={16} />)}</div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {sortedOrders.length === 0 ? (
                <tr><td colSpan="7" className="py-6 text-center text-gray-500">No orders found</td></tr>
              ) : (
                sortedOrders.map(order => {
                  const statusInfo = statusConfig[order.status] || statusConfig.pending;
                  const isExpanded = expandedOrderId === order.id;

                  return (
                    <React.Fragment key={order.id}>
                      <tr className={`hover:bg-gray-50 ${isExpanded ? 'bg-blue-50' : ''}`}>
                        <td className="py-4 px-4 font-medium text-gray-900">#{order.id}</td>
                        <td className="py-4 px-4">
                          <div className="font-medium">{order.userName}</div>
                          <div className="text-gray-500 text-sm">{order.userEmail}</div>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          {order.items.slice(0,2).map(item => (
                            <div key={item.id} className="flex items-center gap-1">
                              <span className="font-medium">{item.name}</span>
                              <span>×</span>
                              <span>{item.quantity}</span>
                              {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                            </div>
                          ))}
                          {order.items.length>2 && <div className="text-blue-600 text-xs mt-1">+{order.items.length - 2} more items</div>}
                        </td>
                        <td className="py-4 px-4 font-semibold">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full ${statusInfo.badgeColor} mr-2`}></span>
                            <span className="text-sm font-medium">{statusInfo.text}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600 text-sm">{formatDate(order.created_at)}</td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`border rounded px-2 py-1 text-sm ${statusInfo.color}`}
                            >
                              {validStatuses.map(status => {
                                const sInfo = statusConfig[status] || { text: status.charAt(0).toUpperCase() + status.slice(1) };
                                return <option key={status} value={status}>{sInfo.text}</option>;
                              })}
                            </select>
                            <button onClick={()=>toggleOrderDetails(order.id)} className="text-blue-600 hover:text-blue-800">{isExpanded ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr className="bg-blue-50">
                          <td colSpan="7" className="px-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white rounded-lg border">
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Order Details</h3>
                                <div className="space-y-2">
                                  {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                      <div>
                                        <span className="font-medium">{item.name}</span> 
                                        <span className="text-gray-500 ml-2">× {item.quantity}</span>
                                        {item.size && <span className="text-gray-400 ml-1">({item.size})</span>}
                                      </div>
                                      <div>₹{(item.price*item.quantity).toFixed(2)}</div>
                                    </div>
                                  ))}
                                  <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                                    <span>Total:</span><span>₹{order.totalAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-900 mb-2">Customer Information</h3>
                                <div className="space-y-2 text-sm">
                                  <div><span className="text-gray-500">Name:</span> {order.userName}</div>
                                  <div><span className="text-gray-500">Email:</span> {order.userEmail}</div>
                                  <div><span className="text-gray-500">Shipping Address:</span> {order.shippingAddress || "Not provided"}</div>
                                  <div><span className="text-gray-500">Payment Method:</span> {order.paymentMode || "Unknown"}</div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">Showing {sortedOrders.length} of {orders.length} orders</div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded text-sm">Previous</button>
          <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border rounded text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminAllOrders;
