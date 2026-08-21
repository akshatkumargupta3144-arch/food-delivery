const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid or expired token' })
      }
      req.user = decoded
      next()
    })
  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = authMiddleware
