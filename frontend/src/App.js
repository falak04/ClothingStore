import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Products from './pages/Products';
import CartPage from './pages/CartPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetail from './pages/ProductDetail';
import UserDetailsPage from './pages/UserDetailsPage';
import Wishlist from './pages/Wishlist';
import Orders from './pages/Orders';
import SellerDashboard from './pages/SellerDashboard';
import SellerProducts from './pages/SellerProducts';
import AddSellerProduct from './pages/AddSellerProduct';
import SellerOrders from './pages/SellerOrders';
import SellerEditProduct from './pages/SellerEditProduct';
import Navbar from './components/Navbar';
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/user/details" element={<UserDetailsPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/orders" element={<Orders />} />
        {/* Seller routes */}
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/products" element={<SellerProducts />} />
        <Route path="/seller/products/add" element={<AddSellerProduct />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/products/edit/:id" element={<SellerEditProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
