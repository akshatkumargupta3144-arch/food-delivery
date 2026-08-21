const express = require('express')
const Food = require('../models/Food')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Get all foods
router.get('/', async (req, res) => {
  try {
    const { restaurant, category, isVeg } = req.query
    let filter = {}

    if (restaurant) {
      filter.restaurant = restaurant
    }
    if (category) {
      filter.category = category
    }
    if (isVeg === 'true') {
      filter.isVeg = true
    }

    const foods = await Food.find(filter).populate('restaurant').limit(100)
    res.status(200).json(foods)
  } catch (err) {
    console.error('Error fetching foods:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant')
    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }
    res.status(200).json(food)
  } catch (err) {
    console.error('Error fetching food:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Create food (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const food = new Food(req.body)
    await food.save()
    await food.populate('restaurant')
    res.status(201).json(food)
  } catch (err) {
    console.error('Error creating food:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update food
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('restaurant')

    if (!food) {
      return res.status(404).json({ message: 'Food not found' })
    }
    res.status(200).json(food)
  } catch (err) {
    console.error('Error updating food:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
