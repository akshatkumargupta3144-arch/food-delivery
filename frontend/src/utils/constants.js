export const DELIVERY_CHARGES = 50
export const MIN_ORDER_VALUE = 200
export const TAX_RATE = 0.18

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
}

export const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📦' },
  { key: 'confirmed', label: 'Confirmed', icon: '✓' },
  { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵' },
  { key: 'delivered', label: 'Delivered', icon: '✅' },
]

export const CUISINES = [
  'Indian',
  'Chinese',
  'Italian',
  'Continental',
  'Fast Food',
  'Cafe',
  'Desserts',
  'Beverages',
]
