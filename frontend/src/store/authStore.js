import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const authStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ user, token, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Login failed', isLoading: false })
      return false
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ user, token, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Registration failed', isLoading: false })
      return false
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },

  updateProfile: async (userData) => {
    set({ isLoading: true })
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      const response = await axios.put(`${API_URL}/auth/profile`, userData, config)
      set({ user: response.data.user, isLoading: false })
      return true
    } catch (err) {
      set({ error: err.response?.data?.message || 'Update failed', isLoading: false })
      return false
    }
  },
}))

export default authStore
