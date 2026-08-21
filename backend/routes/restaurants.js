const express = require('express')
const Restaurant = require('../models/Restaurant')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Get all restaurants
router.get('/', async (req, res) => {
  try {
    const { cuisine, minRating, sortBy } = req.query
    let filter = {}

    if (cuisine) {
      filter.cuisine = { $in: [cuisine] }
    }
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating) }
    }

    let query = Restaurant.find(filter)

    if (sortBy === 'rating') {
      query = query.sort({ rating: -1 })
    } else if (sortBy === 'delivery_time') {
      query = query.sort({ deliveryTime: 1 })
    } else if (sortBy === 'price') {
      query = query.sort({ averagePrice: 1 })
    }

    const restaurants = await query.limit(50)
    res.status(200).json(restaurants)
  } catch (err) {
    console.error('Error fetching restaurants:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get restaurant by ID
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    res.status(200).json(restaurant)
  } catch (err) {
    console.error('Error fetching restaurant:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create restaurant (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const restaurant = new Restaurant(req.body)
    await restaurant.save()
    res.status(201).json(restaurant)
  } catch (err) {
    console.error('Error creating restaurant:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update restaurant
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' })
    }
    res.status(200).json(restaurant)
  } catch (err) {
    console.error('Error updating restaurant:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
