import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'
import api from '../utils/api'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalRestaurants: 0,
  })
  const [orders, setOrders] = useState([])
  const [restaurants, setRestaurants] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const [ordersRes, statsRes, restaurantsRes] = await Promise.all([
        api.get('/admin/orders', config),
        api.get('/admin/stats', config),
        api.get('/admin/restaurants', config),
      ])
      setOrders(ordersRes.data)
      setStats(statsRes.data)
      setRestaurants(restaurantsRes.data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
    }
  }

  const pieData = {
    labels: ['Delivered', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: [
          orders.filter(o => o.status === 'delivered').length,
          orders.filter(o => o.status === 'pending').length,
          orders.filter(o => o.status === 'cancelled').length,
        ],
        backgroundColor: ['#00C853', '#FF9100', '#F44336'],
      },
    ],
  }

  const barData = {
    labels: restaurants.map(r => r.name).slice(0, 5),
    datasets: [
      {
        label: 'Orders',
        data: restaurants.map(r => r.orderCount || 0).slice(0, 5),
        backgroundColor: '#FF6B35',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-12"
        >
          Admin Dashboard
        </motion.h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '📦', color: 'blue' },
            { label: 'Revenue', value: `₹${stats.totalRevenue}`, icon: '💰', color: 'green' },
            { label: 'Customers', value: stats.totalCustomers, icon: '👥', color: 'purple' },
            { label: 'Restaurants', value: stats.totalRestaurants, icon: '🍽️', color: 'orange' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Order Status Distribution</h2>
            <div className="flex justify-center">
              <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: true }} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">Top Restaurants</h2>
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: true }} />
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Order ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Customer</th>
                  <th className="px-4 py-3 text-left font-semibold">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 10).map(order => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{order._id.slice(-6)}</td>
                    <td className="px-4 py-3">{order.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 font-bold">₹{order.totalAmount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AdminDashboard
