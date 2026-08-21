import { create } from 'zustand'

const foodStore = create((set, get) => ({
  foods: [],
  currentFood: null,
  isLoading: false,
  error: null,

  fetchFoods: async (filters = {}) => {
    set({ isLoading: true, error: null })
    try {
      const queryParams = new URLSearchParams()
      if (filters.restaurant) queryParams.append('restaurant', filters.restaurant)
      if (filters.category) queryParams.append('category', filters.category)
      if (filters.isVeg) queryParams.append('isVeg', 'true')

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/foods?${queryParams.toString()}`
      )

      if (!response.ok) throw new Error('Failed to fetch foods')
      const data = await response.json()
      set({ foods: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  fetchFoodById: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/foods/${id}`)

      if (!response.ok) throw new Error('Failed to fetch food')
      const data = await response.json()
      set({ currentFood: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },

  searchFoods: async (query) => {
    set({ isLoading: true })
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/foods?search=${query}`
      )
      const data = await response.json()
      set({ foods: data, isLoading: false })
    } catch (err) {
      set({ error: err.message, isLoading: false })
    }
  },
}))

export default foodStore
