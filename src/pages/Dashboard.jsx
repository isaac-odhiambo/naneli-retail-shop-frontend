/** @jsxImportSource react */
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import Sidebar from '../components/SideBar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  Package,
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// DashboardCard component definition (now included within this file)
function DashboardCard({ title, value, icon, trend, link }) {
  const isPositive = trend.startsWith('+');
  return (
    <Link
      to={link}
      className={`block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        link === '#' ? 'pointer-events-none opacity-50' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        {icon}
      </div>
      <p
        className={`mt-4 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {trend}
      </p>
    </Link>
  );
}

// Main Dashboard component
export default function Dashboard() {
  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [totalDailyProducts, setTotalDailyProducts] = useState(0);
  const [weeklySales, setWeeklySales] = useState({
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        borderColor: '#4F46E5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  });

  // Fetching user role from Redux
  const userRole = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const salesResponse = await fetch('http://naneli-backend.onrender.com/sales');
      const sales = await salesResponse.json();

      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];

      // Filter sales for today only
      const dailySales = sales.filter(
        (sale) => new Date(sale.timestamp).toISOString().split('T')[0] === today
      );

      // Calculate total sales for today
      const todaysSalesTotal = dailySales.reduce((sum, sale) => sum + sale.total, 0);

      // Calculate the total daily products sold
      const dailyProducts = dailySales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
      }, 0);

      // Set state values
      setTotalSales(todaysSalesTotal); // Today's sales total
      setTotalOrders(dailySales.length); // Today's orders
      setTotalDailyProducts(dailyProducts); // Products sold today

      // Fetch low stock items
      const productsResponse = await fetch('http://naneli-backend.onrender.com/products');
      const products = await productsResponse.json();
      const lowStock = products.filter(
        (product) => product.quantity < product.reorder_point
      );
      setLowStockItems(lowStock);

      // Calculate weekly sales for the chart
      const weekly = Array(7).fill(0);
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      sales.forEach((sale) => {
        const day = new Date(sale.timestamp).getDay();
        weekly[day] += sale.total;
      });

      setWeeklySales({
        labels: daysOfWeek,
        datasets: [
          {
            label: 'Sales',
            data: weekly,
            borderColor: '#4F46E5',
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role={userRole} />

      <div className="flex-1 flex flex-col">
        {/* No Navbar here, it is handled globally */}
        <div className="flex-1 p-6 space-y-8 overflow-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Updated Today's Sales Card */}
            <DashboardCard
              title="Today's Sales"
              value={`Kshs  ${totalSales.toLocaleString()}`} // Updated to reflect today's sales with currency format
              icon={<DollarSign className="h-8 w-8 text-green-500" />}
              trend="+12.5%" // Trend could be dynamic if you wish to show positive/negative change
              link="/sales/today" // Link to the detailed sales page for today
            />
            <DashboardCard
              title="Total Orders"
              value={totalOrders}
              icon={<ShoppingCart className="h-8 w-8 text-blue-500" />}
              trend="+8.2%"
              link="/pos"
            />
            {/* Admin and Manager have access to Low Stock Items */}
            {userRole !== 'cashier' && (
              <DashboardCard
                title="Low Stock Items"
                value={lowStockItems.length}
                icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
                trend="-2"
                link={userRole !== 'cashier' ? '/inventory' : '#'}
              />
            )}
            <DashboardCard
              title="Products Sold Today"
              value={totalDailyProducts}
              icon={<Package className="h-8 w-8 text-purple-500" />}
              trend="+5"
              link="/products/sold-today" // Link to the detailed page for products sold today
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Weekly Sales Overview
              </h2>
              {weeklySales.labels.length > 0 ? (
                <Line data={weeklySales} />
              ) : (
                <p className="text-sm text-gray-500">Loading chart data...</p>
              )}
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Low Stock Alerts
              </h2>
              <div className="space-y-4">
                {lowStockItems.map((item) => (
                  <LowStockItem key={item.id} {...item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white text-center py-4 shadow-inner text-sm text-gray-600">
          © {new Date().getFullYear()} Retail System. All rights reserved.
        </footer>
      </div>
    </div>
  );
}

// LowStockItem component
function LowStockItem({ name, quantity, reorder_point }) {
  return (
    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
      <div>
        <h3 className="font-medium text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">Reorder Point: {reorder_point}</p>
      </div>
      <div>
        <p className="text-lg font-bold text-orange-600">{quantity}</p>
        <p className="text-sm text-gray-500">In Stock</p>
      </div>
    </div>
  );
}

