const express = require('express')
const Cart = require('../models/Cart')
const Food = require('../models/Food')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Get user cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id }).populate('items.foodId').populate('restaurant')

    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] })
      await cart.save()
    }

    res.status(200).json(cart)
  } catch (err) {
    console.error('Error fetching cart:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { foodId, quantity, price } = req.body

    if (!foodId || !quantity) {
      return res.status(400).json({ message: 'Food ID and quantity are required' })
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId: req.user.id })
    if (!cart) {
      cart = new Cart({ userId: req.user.id, items: [] })
    }

    // Check if item already in cart
    const existingItem = cart.items.find(item => item.foodId.toString() === foodId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.items.push({ foodId, quantity, price })
    }

    // Update total price
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    await cart.save()
    await cart.populate('items.foodId')

    res.status(200).json({
      message: 'Item added to cart',
      cart,
    })
  } catch (err) {
    console.error('Error adding to cart:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Remove from cart
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { foodId } = req.body

    const cart = await Cart.findOne({ userId: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId)
    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

    await cart.save()
    await cart.populate('items.foodId')

    res.status(200).json({
      message: 'Item removed from cart',
      cart,
    })
  } catch (err) {
    console.error('Error removing from cart:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update quantity
router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { foodId, quantity } = req.body

    if (!foodId || !quantity) {
      return res.status(400).json({ message: 'Food ID and quantity are required' })
    }

    const cart = await Cart.findOne({ userId: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    const item = cart.items.find(item => item.foodId.toString() === foodId)
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' })
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.foodId.toString() !== foodId)
    } else {
      item.quantity = quantity
    }

    cart.totalPrice = cart.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)
    await cart.save()
    await cart.populate('items.foodId')

    res.status(200).json({
      message: 'Cart updated',
      cart,
    })
  } catch (err) {
    console.error('Error updating cart:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Clear cart
router.delete('/clear', authMiddleware, async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.user.id })
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' })
    }

    res.status(200).json({ message: 'Cart cleared' })
  } catch (err) {
    console.error('Error clearing cart:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
