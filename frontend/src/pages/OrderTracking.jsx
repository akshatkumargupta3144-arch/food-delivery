import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import OrderTimeline from '../components/OrderTimeline'
import orderStore from '../store/orderStore'
import { formatPrice, formatDate } from '../utils/validation'

const OrderTracking = () => {
  const { orderId } = useParams()
  const [refreshInterval, setRefreshInterval] = useState(null)
  const { currentOrder, isLoading, fetchOrderById, trackOrder } = orderStore()

  useEffect(() => {
    fetchOrderById(orderId)
    
    const interval = setInterval(() => {
      trackOrder(orderId)
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Order not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">Order Tracking</h1>
          <p className="text-gray-600">Order ID: {currentOrder._id}</p>
        </motion.div>

        {/* Status Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-2xl font-bold mb-8">Delivery Status</h2>
          <OrderTimeline currentStatus={currentOrder.status} />
        </motion.div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Items */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Order Items</h3>
            <div className="space-y-4">
              {(currentOrder.items || []).map((item) => (
                <div key={item._id} className="flex justify-between border-b pb-4">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Delivery Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6">Delivery Address</h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-semibold">{currentOrder.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">City</p>
                <p className="font-semibold">{currentOrder.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Zip Code</p>
                <p className="font-semibold">{currentOrder.zipCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{currentOrder.phone}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Price Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg mt-8"
        >
          <h3 className="text-2xl font-bold mb-6">Price Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-xl font-bold">{formatPrice(currentOrder.subtotal || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Delivery</p>
              <p className="text-xl font-bold">{formatPrice(currentOrder.deliveryCharge || 0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tax</p>
              <p className="text-xl font-bold">{formatPrice(currentOrder.tax || 0)}</p>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-primary">{formatPrice(currentOrder.totalAmount || 0)}</p>
            </div>
          </div>
        </motion.div>

        {/* Order Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-lg mt-8"
        >
          <h3 className="text-2xl font-bold mb-6">Order Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="font-semibold">{formatDate(currentOrder.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Method</p>
              <p className="font-semibold capitalize">{currentOrder.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-semibold capitalize">{currentOrder.status}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default OrderTracking
