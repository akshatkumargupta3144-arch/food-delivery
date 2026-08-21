import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPlus, FiMinus, FiTrash2 } from 'react-icons/fi'
import cartStore from '../store/cartStore'
import { formatPrice, DELIVERY_CHARGES, MIN_ORDER_VALUE, TAX_RATE } from '../utils/validation'
import authStore from '../store/authStore'

const Cart = () => {
  const navigate = useNavigate()
  const { user } = authStore()
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = cartStore()
  const [couponCode, setCouponCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)

  const subtotal = getTotalPrice()
  const discount = (subtotal * discountPercent) / 100
  const deliveryCharge = subtotal >= MIN_ORDER_VALUE ? 0 : DELIVERY_CHARGES
  const tax = (subtotal - discount) * TAX_RATE
  const total = subtotal - discount + deliveryCharge + tax

  const handleApplyCoupon = () => {
    // Mock coupon validation
    if (couponCode === 'SAVE20') setDiscountPercent(20)
    else if (couponCode === 'SAVE10') setDiscountPercent(10)
    else setDiscountPercent(0)
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout', { state: { items, total, tax, discount, deliveryCharge } })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-2xl text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">Add some delicious food to get started!</p>
          <button
            onClick={() => navigate('/restaurants')}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-lg shadow-lg flex gap-4"
              >
                <img
                  src={item.image || 'https://via.placeholder.com/100'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <FiMinus />
                  </button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FiTrash2 size={20} />
                </button>
              </motion.div>
            ))}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg h-fit sticky top-20"
          >
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Coupon */}
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary"
                />
                <button
                  onClick={handleApplyCoupon}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Apply
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">Try: SAVE10, SAVE20</p>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{deliveryCharge === 0 ? 'Free' : formatPrice(deliveryCharge)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-3">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {subtotal < MIN_ORDER_VALUE && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                Add ₹{MIN_ORDER_VALUE - subtotal} more to get free delivery!
              </div>
            )}

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition mt-6"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
            >
              Clear Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Cart
