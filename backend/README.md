# Food Delivery Backend

Express.js + MongoDB backend for the Food Delivery AI application.

## Setup

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the following variables:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - A secure secret key for JWT tokens
- `PORT` - Server port (default: 5000)

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (auth required)
- `PUT /api/auth/profile` - Update user profile (auth required)

### Restaurants
- `GET /api/restaurants` - Get all restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `POST /api/restaurants` - Create restaurant (admin only)
- `PUT /api/restaurants/:id` - Update restaurant (admin only)

### Foods
- `GET /api/foods` - Get all foods
- `GET /api/foods/:id` - Get food details
- `POST /api/foods` - Create food (admin only)
- `PUT /api/foods/:id` - Update food (admin only)

### Orders
- `POST /api/orders` - Create order (auth required)
- `GET /api/orders/user/orders` - Get user orders (auth required)
- `GET /api/orders/:id` - Get order details (auth required)
- `PUT /api/orders/:id/status` - Update order status (admin/delivery only)
- `PUT /api/orders/:id/cancel` - Cancel order (auth required)

### Cart
- `GET /api/cart` - Get user cart (auth required)
- `POST /api/cart/add` - Add to cart (auth required)
- `POST /api/cart/remove` - Remove from cart (auth required)
- `PUT /api/cart/update` - Update cart quantity (auth required)
- `DELETE /api/cart/clear` - Clear cart (auth required)

## Project Structure

```
backend/
├── models/          # MongoDB schemas
├── routes/          # API routes
├── middleware/      # Express middleware
├── utils/           # Utility functions
├── server.js        # Main server file
├── package.json     # Dependencies
└── .env.example     # Environment variables template
```
