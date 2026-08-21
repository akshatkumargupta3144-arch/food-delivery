import { create } = require('zustand')

const cartStore = create((set, get) => ({
  items: [],
  total: 0,
  tax: 0,
  discount: 0,
  deliveryCharge: 30,

  addToCart: async (food) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          foodId: food._id,
          quantity: 1,
          price: food.price,
        }),
      })

      if (!response.ok) throw new Error('Failed to add to cart')
      const data = await response.json()
      get().updateCartFromAPI(data.cart)
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  removeFromCart: async (foodId) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId }),
      })

      if (!response.ok) throw new Error('Failed to remove from cart')
      const data = await response.json()
      get().updateCartFromAPI(data.cart)
    } catch (err) {
      console.error('Error removing from cart:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  updateQuantity: async (foodId, quantity) => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ foodId, quantity }),
      })

      if (!response.ok) throw new Error('Failed to update quantity')
      const data = await response.json()
      get().updateCartFromAPI(data.cart)
    } catch (err) {
      console.error('Error updating quantity:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  fetchCart: async () => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) throw new Error('Failed to fetch cart')
      const data = await response.json()
      get().updateCartFromAPI(data)
    } catch (err) {
      console.error('Error fetching cart:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  updateCartFromAPI: (cartData) => {
    const subtotal = cartData.totalPrice || 0
    const tax = Math.round(subtotal * 0.05) // 5% tax
    const deliveryCharge = subtotal > 500 ? 0 : 30
    const total = subtotal + tax + deliveryCharge

    set({
      items: cartData.items || [],
      total,
      tax,
      deliveryCharge,
    })
  },

  clearCart: async () => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('token')
      await fetch(`${import.meta.env.VITE_API_URL}/cart/clear`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      set({ items: [], total: 0, tax: 0, discount: 0 })
    } catch (err) {
      console.error('Error clearing cart:', err)
    } finally {
      set({ isLoading: false })
    }
  },

  applyDiscount: (amount) => {
    set((state) => ({
      discount: amount,
      total: state.total - amount,
    }))
  },
}))

export default cartStore
