const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Food',
        },
        quantity: Number,
        price: Number,
        name: String,
        image: String,
      },
    ],
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    subtotal: Number,
    tax: Number,
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: Number,
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'],
      default: 'pending',
    },
    address: String,
    city: String,
    zipCode: String,
    phone: String,
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'wallet', 'cod'],
      default: 'card',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    notes: String,
    couponCode: String,
  },
  { timestamps: true }
)

module.exports = mongoose.model('Order', orderSchema)
