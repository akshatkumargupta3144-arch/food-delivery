import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import RestaurantCard from '../components/RestaurantCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import restaurantStore from '../store/restaurantStore'
import { CUISINES } from '../utils/constants'

const Restaurants = () => {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    cuisine: '',
    minRating: 0,
    sortBy: 'rating',
  })
  const { restaurants, isLoading, fetchRestaurants } = restaurantStore()

  useEffect(() => {
    fetchRestaurants(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-8"
        >
          All Restaurants
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-lg shadow-lg h-fit"
          >
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            
            {/* Cuisine Filter */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">Cuisine</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">All Cuisines</option>
                {CUISINES.map(cuisine => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">Min Rating</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-sm text-gray-600 mt-2">{filters.minRating}+ ⭐</p>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="rating">Rating (High to Low)</option>
                <option value="delivery_time">Delivery Time</option>
                <option value="price">Price (Low to High)</option>
              </select>
            </div>
          </motion.div>

          {/* Restaurants Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <LoadingSkeleton count={9} />
            ) : restaurants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restaurants.map((restaurant) => (
                  <motion.div
                    key={restaurant._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <RestaurantCard
                      restaurant={restaurant}
                      onClick={() => navigate(`/restaurants/${restaurant._id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No restaurants found matching your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Restaurants
