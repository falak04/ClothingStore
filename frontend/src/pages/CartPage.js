import { useEffect, useState } from 'react';
import CartItem from '../components/CartItem';
import { fetchCart, updateCartItem, removeCartItem, placeOrder, fetchUserDetails, clearCart } from '../api/api';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

export default function CartPage() {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user && user._id;
    if (userId) {
      fetchCart(userId)
        .then(res => {
          setCart(res.data);
          setLoading(false);
        })
        .catch(err => {
          // If cart not found (404), show empty cart
          setCart({ items: [] });
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleUpdate = (itemId, quantity) => {
    updateCartItem(itemId, quantity).then(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item._id === itemId ? { ...item, quantity } : item
        )
      }));
    });
  };

  const handleRemove = (itemId) => {
    removeCartItem(itemId).then(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
      window.dispatchEvent(new Event('cart-updated'));
    });
  };

  // Calculate summary
  const orderValue = cart.items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  const discount = cart.items.length > 0 ? 300 : 0; // Example discount
  const deliveryFee = 0;
  const total = orderValue - discount + deliveryFee;

  const user = JSON.parse(sessionStorage.getItem('user'));

  // Place order and redirect to /orders
  const handleCheckout = async () => {
    if (!user || !user._id) {
      alert('Please log in to place an order.');
      return;
    }
    if (!cart.items || cart.items.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    try {
      setPlacingOrder(true);
      // Fetch user details
      const res = await fetchUserDetails(user._id);
      const userDetails = res.data || {};
      console.log('User details:', userDetails); // Debug log
      // If no details at all
      if (!userDetails || Object.keys(userDetails).length === 0) {
        alert('Please fill in all your details before placing an order.');
        setPlacingOrder(false);
        navigate('/user/details');
        return;
      }
      // List required fields
      const requiredFields = ['phoneNumber', 'address', 'gender', 'dateOfBirth', 'location'];
      const fieldLabels = {
        phoneNumber: 'Phone Number',
        address: 'Address',
        gender: 'Gender',
        dateOfBirth: 'Date of Birth',
        location: 'Location',
      };
      const missingFields = requiredFields.filter(field => !userDetails[field] || (typeof userDetails[field] === 'string' && userDetails[field].trim() === ''));
      if (missingFields.length > 0) {
        const missingList = missingFields.map(field => `- ${fieldLabels[field] || field}`).join('\n');
        alert(`Please fill in the following details before placing an order:\n${missingList}`);
        setPlacingOrder(false);
        navigate('/user/details');
        return;
      }
      const orderData = {
        user: user._id,
        customerName: user.username,
        phone: userDetails.phoneNumber,
        address: userDetails.address,
        gender: userDetails.gender,
        dateOfBirth: userDetails.dateOfBirth,
        location: userDetails.location,
        alternateMobile: userDetails.alternateMobile,
        hintName: userDetails.hintName,
        totalAmount: total,
        items: cart.items.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price,
          seller: item.productId.seller, // Add seller field for each item
          size: item.size,
          color: item.color
        }))
      };
      await placeOrder(orderData);
      await clearCart(user._id);
      window.dispatchEvent(new Event('cart-updated'));
      setOrderSuccess(true);
      setTimeout(() => {
        setPlacingOrder(false);
        navigate('/orders');
      }, 1500);
    } catch (err) {
      setPlacingOrder(false);
      alert('Failed to place order.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>;

  return (
    <>
      {/* Overlay for placing order */}
      {(placingOrder || orderSuccess) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-green-500 bg-opacity-95">
          {!orderSuccess ? (
            <div className="flex flex-col items-center">
              <svg className="animate-spin h-16 w-16 text-white mb-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
              <div className="text-white text-2xl font-bold">Placing your order...</div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-white rounded-full p-6 mb-4 flex items-center justify-center" style={{ boxShadow: '0 0 0 8px #22c55e33' }}>
                <FaCheck className="text-green-500" size={48} />
              </div>
              <div className="text-white text-3xl font-bold mb-2">Order Placed</div>
              <div className="text-white text-lg">Redirecting to My Orders...</div>
            </div>
          )}
        </div>
      )}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 bg-almost-white min-h-screen">
        {/* Left: Cart Items */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6 text-classic-pink">SHOPPING BAG</h1>
          {cart.items.length === 0 ? (
            <div className="bg-pale-pink p-8 rounded-2xl shadow text-lg font-semibold">
              <div className="mb-2">YOUR SHOPPING BAG IS EMPTY.</div>
              <div className="mb-4 text-base font-normal">Sign in to save or access already saved items in your shopping bag.</div>
              {!user && (
                <div className="flex flex-col gap-2">
                  <button
                    className="border border-classic-pink text-classic-pink w-full py-3 rounded-xl text-lg font-semibold hover:bg-classic-pink hover:text-white transition"
                    onClick={() => navigate('/login')}
                  >
                    Existing User? Log In
                  </button>
                  <button
                    className="border border-classic-pink text-classic-pink w-full py-3 rounded-xl text-lg font-semibold hover:bg-classic-pink hover:text-white transition"
                    onClick={() => navigate('/register')}
                  >
                    New User? Register
                  </button>
                </div>
              )}
            </div>
          ) : (
            cart.items.map(item => (
              <CartItem key={item._id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
            ))
          )}
        </div>
        {/* Right: Summary */}
        <div className="bg-pale-pink p-8 rounded-2xl shadow flex flex-col gap-4">
          <div className="mb-2 font-semibold text-classic-pink">DISCOUNTS <span className="float-right text-classic-pink cursor-pointer">ADD</span></div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Order value</span>
            <span>Rs. {orderValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Discount</span>
            <span className="text-classic-pink">-Rs. {discount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between mb-1 text-sm">
            <span>Estimated delivery fee</span>
            <span>Free</span>
          </div>
          <div className="font-bold mt-2 mb-2 flex justify-between text-lg text-classic-pink">
            <span>TOTAL</span>
            <span>Rs. {total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
          <button
            className="w-full border border-classic-pink text-classic-pink py-3 rounded-xl text-lg font-semibold mb-2 hover:bg-classic-pink hover:text-white transition"
            onClick={handleCheckout}
          >
            CONTINUE TO CHECKOUT
          </button>
          <div className="flex items-center gap-4 mt-2 mb-2">
           
            <span className="font-semibold text-sm">CASH ON DELIVERY</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Prices and delivery costs are not confirmed until you've reached the checkout.<br />
            15 days free returns. Read more about <a href="#" className="underline">return and refund policy</a>.<br />
            Need help? Please contact <a href="#" className="underline">Customer Support</a>.<br />
            Customers would receive an SMS/WhatsApp notifications regarding deliveries on the registered phone number
          </div>
          <a href="#" className="underline text-sm mt-2">DELIVERY AND RETURN OPTIONS</a>
        </div>
      </div>
    </>
  );
}