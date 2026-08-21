import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import FoodCard from '../components/FoodCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import restaurantStore from '../store/restaurantStore'
import api from '../utils/api'

const RestaurantDetail = () => {
  const { id } = useParams()
  const [foods, setFoods] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoadingFoods, setIsLoadingFoods] = useState(false)
  const { selectedRestaurant, isLoading, fetchRestaurantById } = restaurantStore()

  useEffect(() => {
    fetchRestaurantById(id)
  }, [id])

  useEffect(() => {
    const fetchFoods = async () => {
      setIsLoadingFoods(true)
      try {
        const response = await api.get(`/foods?restaurant=${id}`)
        setFoods(response.data)
      } catch (err) {
        console.error('Error fetching foods:', err)
      }
      setIsLoadingFoods(false)
    }
    if (id) fetchFoods()
  }, [id])

  if (isLoading) return <LoadingSkeleton count={6} />

  if (!selectedRestaurant) return <div className="text-center py-12">Restaurant not found</div>

  const categories = ['all', ...new Set(foods.map(f => f.category))]
  const filteredFoods = selectedCategory === 'all'
    ? foods
    : foods.filter(f => f.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="relative h-80 bg-gray-300">
        <img
          src={selectedRestaurant.image || 'https://via.placeholder.com/1200x300'}
          alt={selectedRestaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container mx-auto max-w-6xl w-full px-4 pb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{selectedRestaurant.name}</h1>
            <p className="text-white text-lg mb-2">{selectedRestaurant.cuisine}</p>
            <div className="flex gap-4 text-white">
              <span>⭐ {selectedRestaurant.rating}</span>
              <span>🚚 {selectedRestaurant.deliveryTime} mins</span>
              <span>💰 ₹{selectedRestaurant.deliveryCharges} Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white border-b">
        <div className="container mx-auto max-w-6xl">
          <div className="flex gap-4 overflow-x-auto pb-4">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Foods Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Menu</h2>
          
          {isLoadingFoods ? (
            <LoadingSkeleton count={6} />
          ) : filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFoods.map((food) => (
                <motion.div
                  key={food._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <FoodCard food={food} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No items found</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RestaurantDetail
