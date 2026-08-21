import { motion } from 'framer-motion'

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-lg cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={restaurant.image || 'https://via.placeholder.com/300x200'}
          alt={restaurant.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {restaurant.discount && (
          <div className="absolute top-2 right-2 bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            {restaurant.discount}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{restaurant.cuisine}</p>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span className="font-semibold">{restaurant.rating}</span>
          </div>
          <span className="text-gray-600">{restaurant.deliveryTime} mins</span>
        </div>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-primary font-bold">₹{restaurant.deliveryCharges} Delivery</span>
          <span className="text-green-600 font-semibold">Free above ₹500</span>
        </div>
      </div>
    </motion.div>
  )
}

export default RestaurantCard
