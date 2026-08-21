const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide food name'],
      trim: true,
    },
    description: String,
    price: {
      type: Number,
      required: [true, 'Please provide price'],
    },
    image: String,
    category: String,
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 4.0,
      min: 0,
      max: 5,
    },
    preparationTime: {
      type: Number,
      default: 15,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Food', foodSchema)
