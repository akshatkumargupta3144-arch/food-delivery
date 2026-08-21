import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import RestaurantCard from '../components/RestaurantCard'
import LoadingSkeleton from '../components/LoadingSkeleton'
import restaurantStore from '../store/restaurantStore'
import authStore from '../store/authStore'

const Home = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { restaurants, isLoading, fetchRestaurants } = restaurantStore()
  const { user } = authStore()

  useEffect(() => {
    fetchRestaurants()
  }, [])

  const filteredRestaurants = selectedCategory === 'all'
    ? restaurants
    : restaurants.filter(r => r.cuisine.includes(selectedCategory))

  const searchedRestaurants = filteredRestaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const categories = ['all', 'Indian', 'Chinese', 'Italian', 'Fast Food', 'Cafe']

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-900">
              🍕 Order Your Favorite Food
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Powered by AI recommendations - Get the best food delivered to your doorstep
            </p>
            
            {/* Search Bar */}
            <div className="flex gap-2 max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search restaurants or food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-6 py-3 rounded-lg border-2 border-primary focus:outline-none focus:border-primary/80"
              />
              <button className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition">
                Search
              </button>
            </div>
          </motion.div>

          {/* Welcome Message */}
          {user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg p-6 mb-8 shadow-lg glass"
            >
              <p className="text-lg font-semibold text-gray-800">
                Welcome back, <span className="text-primary">{user.name}</span>! 👋
              </p>
              <p className="text-gray-600 mt-2">Let's find something delicious for you today</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 px-4 bg-white">
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

      {/* Restaurants Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Featured Restaurants</h2>
          
          {isLoading ? (
            <LoadingSkeleton count={6} />
          ) : searchedRestaurants.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedRestaurants.map((restaurant) => (
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
              <p className="text-xl text-gray-600">No restaurants found</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white mt-12">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Akshat Eats AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🤖', title: 'AI Recommendations', desc: 'Get personalized food suggestions powered by AI' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Quick delivery with real-time tracking' },
              { icon: '🏆', title: 'Top Restaurants', desc: 'Partner with the best restaurants in your city' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center p-8 rounded-lg bg-gray-50 hover:shadow-lg transition"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
