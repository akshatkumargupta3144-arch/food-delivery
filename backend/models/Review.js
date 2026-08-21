const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
    },
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Food',
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: String,
    images: [String],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Review', reviewSchema)
