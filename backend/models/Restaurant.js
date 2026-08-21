const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide restaurant name'],
      trim: true,
    },
    description: String,
    image: String,
    cuisine: [String],
    address: String,
    city: String,
    phone: String,
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    deliveryTime: {
      type: Number,
      default: 30,
    },
    deliveryCharges: {
      type: Number,
      default: 30,
    },
    discount: {
      type: Number,
      default: 0,
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    openingTime: String,
    closingTime: String,
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Restaurant', restaurantSchema)
