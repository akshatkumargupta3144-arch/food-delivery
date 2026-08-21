import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const restaurantStore = create((set) => ({
  restaurants: [],
  selectedRestaurant: null,
  isLoading: false,
  error: null,

  fetchRestaurants: async (filters = {}) => {
    set({ isLoading: true })
    try {
      const params = new URLSearchParams(filters).toString()
      const response = await axios.get(`${API_URL}/restaurants?${params}`)
      set({ restaurants: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchRestaurantById: async (id) => {
    set({ isLoading: true })
    try {
      const response = await axios.get(`${API_URL}/restaurants/${id}`)
      set({ selectedRestaurant: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  searchRestaurants: async (query) => {
    set({ isLoading: true })
    try {
      const response = await axios.get(`${API_URL}/restaurants/search?q=${query}`)
      set({ restaurants: response.data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default restaurantStore
