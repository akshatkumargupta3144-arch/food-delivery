import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiShoppingCart, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi'
import authStore from '../store/authStore'
import cartStore from '../store/cartStore'
import './Navbar.css'

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, logout } = authStore()
  const { getTotalItems } = cartStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar glass">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="text-3xl font-bold text-primary">🍕 Akshat Eats AI</div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 items-center">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/restaurants" className="hover:text-primary transition">Restaurants</Link>
          <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
        </div>

        {/* Right Icons */}
        <div className="flex gap-4 items-center">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="text-xl">
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative">
            <FiShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {user ? (
            <div className="hidden md:flex gap-2 items-center">
              <span className="text-sm">{user.name}</span>
              <button onClick={handleLogout} className="text-primary hover:text-primary/80">
                <FiLogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex gap-2">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-secondary">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-white dark:bg-gray-900 p-4 space-y-4"
        >
          <Link to="/" className="block hover:text-primary">Home</Link>
          <Link to="/restaurants" className="block hover:text-primary">Restaurants</Link>
          <Link to="/dashboard" className="block hover:text-primary">Dashboard</Link>
          {user ? (
            <>
              <div className="text-sm">{user.name}</div>
              <button onClick={handleLogout} className="w-full text-left text-primary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block btn-primary">Login</Link>
              <Link to="/register" className="block btn-secondary">Sign Up</Link>
            </>
          )}
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
