import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiLogOut, FiEdit2, FiMapPin, FiShoppingBag } from 'react-icons/fi'
import authStore from '../store/authStore'
import orderStore from '../store/orderStore'
import { formatPrice, formatDate } from '../utils/validation'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const { user, logout, updateProfile } = authStore()
  const { orders, fetchOrders } = orderStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    const success = await updateProfile(formData)
    if (success) {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } else {
      toast.error('Failed to update profile')
    }
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-12">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mx-auto mb-4">
                <span className="text-3xl">👤</span>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">{user?.name}</h2>
              <p className="text-gray-600 text-center mb-6">{user?.email}</p>

              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition mb-3"
                  >
                    <FiEdit2 /> Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                  >
                    <FiLogOut /> Logout
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    onClick={handleSave}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="w-full bg-gray-400 text-white py-2 rounded-lg font-semibold hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Order History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FiShoppingBag /> Order History
              </h3>

              {orders.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {orders.map((order) => (
                    <motion.div
                      key={order._id}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">{order.items?.length} items</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <FiMapPin size={14} /> {order.city}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-primary">{formatPrice(order.totalAmount)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 mb-4">No orders yet</p>
                  <a href="/restaurants" className="text-primary font-semibold hover:underline">
                    Start ordering now
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
