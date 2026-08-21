import { create } from 'zustand'

const restaurantStore = create((set, get) => ({
  restaurants: [],
  currentRestaurant: null,
  isLoading: false,
  error: null,

  fetchRestaurants: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      if (filters.cuisine) queryParams.append('cuisine', filters.cuisine)
      if (filters.minRating) queryParams.append('minRating', filters.minRating)
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/restaurants?${queryParams.toString()}`
      )

      if (!response.ok) throw new Error('Failed to fetch restaurants')
      const data = await response.json()
      set({ restaurants: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchRestaurantById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/restaurants/${id}`)

      if (!response.ok) throw new Error('Failed to fetch restaurant')
      const data = await response.json()
      set({ currentRestaurant: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  searchRestaurants: async (query) => {
    set({ isLoading: true })
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/restaurants?search=${query}`
      )
      const data = await response.json()
      set({ restaurants: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default restaurantStore
