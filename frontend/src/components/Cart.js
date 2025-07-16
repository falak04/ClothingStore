import { useEffect, useState } from 'react';
import { fetchCart, updateCartItem, removeCartItem } from '../api/api';
import CartItem from './CartItem';

export default function Cart() {
  const [cart, setCart] = useState({ items: [] });

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user && user._id;
    if (userId) {
      fetchCart(userId).then(res => {
        setCart(res.data);
      });
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
    console.log(itemId);
    removeCartItem(itemId).then(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item._id !== itemId)
      }));
      console.log(cart);
    });
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 bg-gray-50 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cart.items.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        cart.items.map(item => (
          <CartItem key={item._id} item={item} onUpdate={handleUpdate} onRemove={handleRemove} />
        ))
      )}
    </div>
  );
} 