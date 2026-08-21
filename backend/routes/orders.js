const express = require('express')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Create order
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, tax, discount, deliveryCharge, address, city, zipCode, phone, paymentMethod } =
      req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' })
    }

    const order = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      tax,
      discount,
      deliveryCharge,
      address,
      city,
      zipCode,
      phone,
      paymentMethod,
    })

    await order.save()

    // Clear cart
    await Cart.findOneAndDelete({ userId: req.user.id })

    res.status(201).json({
      message: 'Order created successfully',
      order,
    })
  } catch (err) {
    console.error('Error creating order:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get user orders
router.get('/user/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('items.foodId')
      .sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (err) {
    console.error('Error fetching orders:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.foodId').populate('userId')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user is authorized
    if (order.userId._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.status(200).json(order)
  } catch (err) {
    console.error('Error fetching order:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Update order status (admin/delivery only)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (!['admin', 'delivery'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.status(200).json({
      message: 'Order status updated',
      order,
    })
  } catch (err) {
    console.error('Error updating order:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Cancel order
router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    // Check if user is authorized
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' })
    }

    order.status = 'cancelled'
    await order.save()

    res.status(200).json({
      message: 'Order cancelled successfully',
      order,
    })
  } catch (err) {
    console.error('Error cancelling order:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
