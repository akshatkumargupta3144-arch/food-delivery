import { Link } from 'react-router-dom'
import { FiFacebook, FiTwitter, FiInstagram, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold mb-4">🍕 Akshat Eats AI</h3>
            <p className="text-gray-400 mb-4">AI-Powered Food Delivery Platform</p>
            <div className="flex gap-4">
              <a href="#" className="text-primary hover:scale-110 transition"><FiFacebook size={20} /></a>
              <a href="#" className="text-primary hover:scale-110 transition"><FiTwitter size={20} /></a>
              <a href="#" className="text-primary hover:scale-110 transition"><FiInstagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link to="/restaurants" className="hover:text-primary transition">Restaurants</Link></li>
              <li><Link to="/about" className="hover:text-primary transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Help Center</a></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-primary transition">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex gap-2 items-start">
                <FiPhone size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-light">6202474463</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <FiMail size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-light">akshatkumargupta3144@gmail.in</p>
                </div>
              </div>
              <div className="flex gap-2 items-start">
                <FiMapPin size={20} className="text-primary mt-1" />
                <div>
                  <p className="font-semibold text-light">India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Akshat Eats AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
