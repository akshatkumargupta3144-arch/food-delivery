import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const orderStore = create((set) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  createOrder: async (orderData) => {
    set({ isLoading: true })
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const response = await axios.post(`${API_URL}/orders`, orderData, config)
      set({ currentOrder: response.data, isLoading: false })
      return response.data
    } catch (err) {
      set({ error: err.response?.data?.message || 'Order creation failed', isLoading: false })
      throw err
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true })
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const response = await axios.get(`${API_URL}/orders`, config)
      set({ orders: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchOrderById: async (orderId) => {
    set({ isLoading: true })
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const response = await axios.get(`${API_URL}/orders/${orderId}`, config)
      set({ currentOrder: response.data, isLoading: false })
      return response.data
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  trackOrder: async (orderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const response = await axios.get(`${API_URL}/orders/${orderId}/track`, config)
      return response.data
    } catch (err) {
      set({ error: err.message })
    }
  },
}))

export default orderStore
