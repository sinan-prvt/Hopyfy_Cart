import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp } from "react-icons/fi";
import { format, subDays, isAfter } from "date-fns";
import api from "../../api";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const AdminDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newCustomers: 0,
    avgOrderValue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState(Array(12).fill(0));
  const [productDistribution, setProductDistribution] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [usersRes, productsRes, ordersRes] = await Promise.all([
          api.get("/admin/users/"),
          api.get("/admin/products/"),
          api.get("/admin/orders/")
        ]);

        const users = usersRes.data || [];
        const products = productsRes.data || [];
        const orders = ordersRes.data || [];

        const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
        const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;
        const newCustomers = users.filter(u => u.created_at && isAfter(new Date(u.created_at), subDays(new Date(), 30))).length;

        setMetrics({
          totalUsers: users.length,
          totalProducts: products.length,
          totalOrders: orders.length,
          totalRevenue: Number(totalRevenue.toFixed(2)),
          newCustomers,
          avgOrderValue: Number(avgOrderValue.toFixed(2))
        });

        setRecentOrders([...orders]
          .sort((a,b)=> new Date(b.created_at) - new Date(a.created_at))
          .slice(0,5)
          .map(o=>({
            ...o,
            totalAmount: o.total_amount || 0,
            customerName: o.user?.username || "Unknown",
            customerEmail: o.user?.email || "Unknown",
            createdAt: o.created_at ? format(new Date(o.created_at),"MMM dd, yyyy") : 'N/A'
          }))
        );

        const revenueArr = Array(12).fill(0);
        orders.forEach(o => {
          if(o.created_at && o.total_amount) {
            const month = new Date(o.created_at).getMonth();
            revenueArr[month] += Number(o.total_amount);
          }
        });
        setMonthlyRevenue(revenueArr);

        const productSales = {};
        orders.forEach(order => {
          order.items?.forEach(item => {
            const product = products.find(p => p.id === item.product?.id);
            if(product){
              productSales[product.id] = productSales[product.id] || { name: product.name, count: 0 };
              productSales[product.id].count += item.quantity || 0;
            }
          });
        });
        setProductDistribution(Object.values(productSales).sort((a,b)=>b.count-a.count).slice(0,5));

        const statusCount = {};
        orders.forEach(o => {
          const st = o.status || 'pending';
          statusCount[st] = (statusCount[st]||0)+1;
        });
        setOrderStatusData(Object.entries(statusCount));

        const userActivityData = users
        .filter(u => u.role !== 'admin')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) 
        .slice(0, 5) 
        .map(u => ({ id: u.id, name: u.username || "Unknown", email: u.email || "Unknown" }));

      setUserActivity(userActivityData);
        setLoading(false);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
        setError("Failed to load dashboard data.");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getColorClasses = (color) => {
    const map = {
      blue:{gradient:'bg-gradient-to-br from-blue-50 to-white',border:'border-blue-100',bg:'bg-blue-100',text:'text-blue-600'},
      green:{gradient:'bg-gradient-to-br from-green-50 to-white',border:'border-green-100',bg:'bg-green-100',text:'text-green-600'},
      purple:{gradient:'bg-gradient-to-br from-purple-50 to-white',border:'border-purple-100',bg:'bg-purple-100',text:'text-purple-600'},
      amber:{gradient:'bg-gradient-to-br from-amber-50 to-white',border:'border-amber-100',bg:'bg-amber-100',text:'text-amber-600'},
      teal:{gradient:'bg-gradient-to-br from-teal-50 to-white',border:'border-teal-100',bg:'bg-teal-100',text:'text-teal-600'},
      default:{gradient:'bg-gradient-to-br from-gray-50 to-white',border:'border-gray-100',bg:'bg-gray-100',text:'text-gray-600'}
    };
    return map[color] || map.default;
  };

  const formatStatus = (status)=>{
    const map={pending:"Pending",processing:"Processing",shipped:"Shipped",delivered:"Delivered",cancelled:"Cancelled",refunded:"Refunded"};
    return map[status?.toLowerCase()] || status?.charAt(0).toUpperCase()+status?.slice(1) || "Unknown";
  }

  const revenueData = useMemo(() => ({
    labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    datasets:[{
      label:"Revenue (₹)",
      data:monthlyRevenue.map(r => r || 0),
      backgroundColor:"rgba(99,102,241,0.1)",
      borderColor:"rgba(99,102,241,1)",
      borderWidth:2,
      tension:0.3,
      fill:true,
      pointBackgroundColor:"rgba(99,102,241,1)",
      pointBorderColor:"#fff",
      pointHoverBackgroundColor:"#fff",
      pointHoverBorderColor:"rgba(99,102,241,1)",
      pointRadius:4,
      pointHoverRadius:6
    }]
  }), [monthlyRevenue]);

  const productData = useMemo(() => ({
    labels: productDistribution.map(p => p.name || "Unknown"),
    datasets:[{
      label:"Units Sold",
      data:productDistribution.map(p => p.count || 0),
      backgroundColor:["rgba(239,68,68,0.7)","rgba(16,185,129,0.7)","rgba(139,92,246,0.7)","rgba(245,158,11,0.7)","rgba(59,130,246,0.7)"],
      borderWidth:1,
      borderRadius:4
    }]
  }), [productDistribution]);

  const statusData = useMemo(() => ({
    labels: orderStatusData.map(s => s[0]?.toUpperCase()||"Unknown"),
    datasets:[{
      data: orderStatusData.map(s => s[1]||0),
      backgroundColor:["rgba(245,158,11,0.7)","rgba(59,130,246,0.7)","rgba(16,185,129,0.7)","rgba(239,68,68,0.7)","rgba(153,102,255,0.7)","rgba(201,203,207,0.7)"],
      hoverOffset:4
    }]
  }), [orderStatusData]);

  const baseOptions = { responsive:true, maintainAspectRatio:false, plugins:{ legend:{ position:"top", labels:{ font:{ size:12 } } } } };
  const revenueOptions = { ...baseOptions, plugins:{ ...baseOptions.plugins, tooltip:{ callbacks:{ label:ctx=>`₹${ctx.parsed.y?.toLocaleString()||0}` }, backgroundColor:'rgba(30,41,59,0.9)', displayColors:false } }, interaction:{ intersect:false, mode:'index' } };
  const barOptions = { ...baseOptions, scales:{ y:{ beginAtZero:true }, x:{ ticks:{ font:{ size:10 } } } }, plugins:{ ...baseOptions.plugins, tooltip:{ callbacks:{ label:ctx=>`${ctx.parsed.y||0} units sold` } } } };
  const pieOptions = { ...baseOptions, plugins:{ ...baseOptions.plugins, tooltip:{ callbacks:{ label:ctx=>`${ctx.label||'Unknown'}: ${ctx.raw||0} orders` } } } };

  const MetricCard = ({title,value,icon,color,subtext})=>{
    const c = getColorClasses(color);
    return(
      <div className={`p-5 rounded-xl shadow-sm border ${c.gradient} ${c.border} transition-all hover:shadow-md`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-sm text-gray-500 font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            {subtext && <div className="mt-1 text-xs text-gray-500">{subtext}</div>}
          </div>
          <div className={`p-2.5 rounded-lg ${c.bg} ${c.text}`}>{icon}</div>
        </div>
      </div>
    )
  }

  if(loading) return <div className="max-w-7xl mx-auto p-6 min-h-screen">Loading...</div>;
  if(error) return <div className="max-w-7xl mx-auto p-6 min-h-screen text-red-500">{error}</div>;

  return(
    <div className="max-w-7xl mx-auto p-4 sm:p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        <MetricCard title="Total Users" value={metrics.totalUsers} icon={<FiUsers size={20}/>} color="blue" subtext={`${metrics.newCustomers} new this month`} />
        <MetricCard title="Total Products" value={metrics.totalProducts} icon={<FiPackage size={20}/>} color="green" />
        <MetricCard title="Total Orders" value={metrics.totalOrders} icon={<FiShoppingBag size={17}/>} color="purple" subtext="All time orders" />
        <MetricCard title="Total Revenue" value={`₹${metrics.totalRevenue.toLocaleString()}`} icon={<FiDollarSign size={12}/>} color="amber" />
        <MetricCard title="Avg Order Value" value={`₹${metrics.avgOrderValue.toLocaleString()}`} icon={<FiTrendingUp size={15}/>} color="teal" subtext="Per order average" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Monthly Revenue</h3>
          <div className="h-72"><Line data={revenueData} options={revenueOptions} /></div>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Order Status Distribution</h3>
          <div className="h-72"><Pie data={statusData} options={pieOptions} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Top Selling Products</h3>
          <div className="h-72"><Bar data={productData} options={barOptions} /></div>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent User Activity</h3>
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left px-2 py-1">User</th>
                <th className="text-left px-2 py-1">Email</th>
              </tr>
            </thead>
            <tbody>
              {userActivity.map(u => (
                <tr key={u.id}>
                  <td className="px-2 py-1">{u.name}</td>
                  <td className="px-2 py-1">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border overflow-x-auto">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Recent Orders</h3>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-left px-2 py-1">Order ID</th>
              <th className="text-left px-2 py-1">Customer</th>
              <th className="text-left px-2 py-1">Amount</th>
              <th className="text-left px-2 py-1">Status</th>
              <th className="text-left px-2 py-1">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 py-1">#{order.id?.toString()?.slice(0,8)}</td>
                <td className="px-2 py-1">{order.customerName}<div className="text-xs text-gray-500">{order.customerEmail}</div></td>
                <td className="px-2 py-1">₹{(order.totalAmount||0).toLocaleString()}</td>
                <td className="px-2 py-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status==='pending'?'bg-yellow-100 text-yellow-800':
                    order.status==='processing'?'bg-blue-100 text-blue-800':
                    order.status==='shipped'?'bg-purple-100 text-purple-800':
                    order.status==='delivered'?'bg-green-100 text-green-800':
                    order.status==='cancelled'?'bg-red-100 text-red-800':'bg-gray-100 text-gray-800'
                  }`}>{formatStatus(order.status)}</span>
                </td>
                <td className="px-2 py-1">{order.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard;
