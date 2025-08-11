# ClothingStore

# Clothing Store Backend

This is the backend server for the Clothing Store web application. It provides RESTful APIs for user authentication, product management, cart, orders, and seller features.

## Features

- User authentication (customer & seller)
- Product catalog with variants (size, color, stock)
- Shopping cart (add, update, remove items)
- Order placement and management
- Seller product management
- Stock notification system

## Prerequisites

- Node.js (v16+ recommended)
- MongoDB (local or remote)

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start MongoDB (if running locally):
   ```bash
   mongod
   ```
3. Start the backend server:
   ```bash
   node app.js
   # or for development with auto-reload
   npx nodemon app.js
   ```
4. The server runs on [http://localhost:8000](http://localhost:8000)

## Project Structure

```
backend/
  models/           # Mongoose data models (User, Product, Cart, Order, etc.)
  app.js            # Main Express server
  order.js          # Order routes
  package.json      # Dependencies
```

## API Endpoints (Summary)

- **Products**
  - `GET /products` — List all products
  - `GET /products/:id` — Get product by ID
  - `GET /products/featured` — Get featured products
- **Cart**
  - `POST /cart` — Add item to cart
  - `GET /cart/:userId` — Get user's cart
  - `PUT /cart/:itemId` — Update cart item quantity
  - `DELETE /cart/:itemId` — Remove item from cart
  - `DELETE /cart/user/:userId` — Clear user's cart
- **Orders**
  - `POST /orders` — Place a new order
  - `GET /orders/:userId` — Get orders for a user
  - `GET /orders/seller/:sellerId` — Get orders for a seller
- **User Auth**
  - `POST /signup` — Register
  - `POST /login` — Login
  - `GET /logout` — Logout
- **User Details**
  - `GET /userdetails/:userId` — Get user details
  - `POST /userdetails` — Save/update user details
- **Stock Notification**
  - `POST /notify-stock` — Request notification for out-of-stock variant
  - `GET /notify-stock/:userId` — Get pending notifications for user

## Data Models

- **User**: username, email, password (hashed), role (customer/seller)
- **UserDetails**: phoneNumber, gender, dateOfBirth, location, address, alternateMobile, hintName
- **Product**: name, price, description, category, Gender, imageUrl, variants (size, color, stock), isFeatured, seller
- **Cart**: userId, items (productId, size, color, quantity)
- **Order**: user, customerName, phone, address, status, totalAmount, items (productId, productName, quantity, price, size, color, seller)
- **StockNotification**: userId, productId, size, color, notified

## Configuration

- MongoDB connection string is set in `app.js` (default: `mongodb://127.0.0.1:27017/ClothingStore`)
- Update `sessionOptions.secret` in `app.js` for production

# Clothing Store Frontend

This is the frontend React application for the Clothing Store web app. It provides a modern, responsive UI for customers and sellers to browse, shop, and manage products.

## Features

- Browse products by category, gender, and filters
- Product detail pages with size/color selection and stock status
- Shopping cart with quantity management
- User authentication (login/register)
- Wishlist functionality
- Place orders and view order history
- User profile and details management
- Seller dashboard: add/edit products, view orders
- Stock notifications for out-of-stock variants

## Prerequisites

- Node.js (v16+ recommended)
- Backend server running (see backend/README.md)

## Setup & Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the frontend app:
   ```bash
   npm start
   ```
3. The app runs on [http://localhost:3000](http://localhost:3000)

## Project Structure

```
frontend/
  src/
    pages/         # Main pages/routes (Home, Products, ProductDetail, Cart, Orders, etc.)
    components/    # Reusable UI components (Navbar, ProductCard, CartItem, etc.)
    api/           # API integration (src/api/api.js)
    assets/        # Images and static assets
  public/          # Static files
  tailwind.config.js, postcss.config.js  # Styling
```

## Main Pages

- **Home**: Landing page, featured products, categories
- **Products**: Product listing with filters (category, gender, price, color, size)
- **ProductDetail**: Detailed view, select size/color, add to cart/wishlist
- **Cart**: View and manage cart, checkout
- **Orders**: View past orders
- **Wishlist**: Save favorite products
- **UserDetailsPage**: Manage user profile and address
- **Seller Dashboard**: Add/edit products, view seller orders

## API Integration

- All API calls are defined in `src/api/api.js`
- The frontend expects the backend to run at `http://localhost:8000`
- Update the base URL in `api.js` if your backend runs elsewhere

## Customization

- UI built with React and Tailwind CSS
- Easily customizable via `src/components/` and `src/pages/`
- Add new pages or components as needed

## Build & Deployment

- To build for production:
  ```bash
  npm run build
  ```
- The build output will be in the `build/` directory
