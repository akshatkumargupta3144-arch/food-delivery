import { create } from 'zustand'

const cartStore = create((set, get) => ({
  items: JSON.parse(localStorage.getItem('cart')) || [],
  
  addItem: (food) => {
    set((state) => {
      const existingItem = state.items.find(item => item._id === food._id)
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        }
      }
      return { items: [...state.items, { ...food, quantity: 1 }] }
    })
    localStorage.setItem('cart', JSON.stringify(get().items))
  },

  removeItem: (foodId) => {
    set((state) => ({
      items: state.items.filter(item => item._id !== foodId)
    }))
    localStorage.setItem('cart', JSON.stringify(get().items))
  },

  updateQuantity: (foodId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(foodId)
      return
    }
    set((state) => ({
      items: state.items.map(item =>
        item._id === foodId ? { ...item, quantity } : item
      )
    }))
    localStorage.setItem('cart', JSON.stringify(get().items))
  },

  clearCart: () => {
    set({ items: [] })
    localStorage.removeItem('cart')
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0)
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
}))

export default cartStore
