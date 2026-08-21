const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    zipCode: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'delivery'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    preferences: {
      notifications: { type: Boolean, default: true },
      newsletter: { type: Boolean, default: false },
      cuisinePreferences: [String],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
