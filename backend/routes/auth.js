const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { validateEmail, validatePassword } = require('../utils/validation')

const router = express.Router()

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address' })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    })

    await user.save()

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' })
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    res.status(200).json(user)
  } catch (err) {
    console.error('Error fetching user:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, phone, address, city, zipCode } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city, zipCode },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      message: 'Profile updated successfully',
      user,
    })
  } catch (err) {
    console.error('Error updating profile:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    req.user = decoded
    next()
  })
}

module.exports = router
