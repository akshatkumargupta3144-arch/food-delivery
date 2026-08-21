const validateEmail = (email) => {
  const re = /^\S+@\S+\.\S+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password && password.length >= 6
}

const validatePhone = (phone) => {
  const re = /^[0-9]{10}$/
  return re.test(phone)
}

const validateAddress = (address) => {
  return address && address.trim().length >= 5
}

const formatPrice = (price) => {
  return `₹${parseFloat(price).toFixed(2)}`
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateAddress,
  formatPrice,
  formatDate,
}
