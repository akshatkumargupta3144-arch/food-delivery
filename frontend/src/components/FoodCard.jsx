import { motion } from 'framer-motion'
import cartStore from '../store/cartStore'
import toast from 'react-hot-toast'

const FoodCard = ({ food, onAddToCart }) => {
  const { addItem } = cartStore()

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(food)
    toast.success(`${food.name} added to cart!`)
    onAddToCart && onAddToCart()
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-lg overflow-hidden shadow-lg"
    >
      <div className="relative h-40 overflow-hidden bg-gray-200">
        <img
          src={food.image || 'https://via.placeholder.com/200x160'}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {food.isVeg ? (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            🥗 VEG
          </div>
        ) : (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            🍖 NON-VEG
          </div>
        )}
      </div>
      <div className="p-4">
        <h4 className="font-bold text-lg mb-1">{food.name}</h4>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{food.description}</p>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="font-semibold">{food.rating}</span>
          </div>
          <span className="font-bold text-primary">₹{food.price}</span>
        </div>
        <button
          onClick={handleAddToCart}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

export default FoodCard
