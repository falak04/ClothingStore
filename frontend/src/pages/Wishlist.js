import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      setWishlist(JSON.parse(stored));
    }
  }, []);

  const handleRemove = (productId) => {
    const updated = wishlist.filter(p => p._id !== productId);
    setWishlist(updated);
    localStorage.setItem('wishlist', JSON.stringify(updated));
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6 text-classic-pink">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="text-gray-500 text-lg">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
            {wishlist.map(product => (
              <div key={product._id} className="relative">
                <ProductCard product={product} isWishlisted />
                <button
                  className="absolute top-4 right-4 text-2xl text-classic-pink hover:text-red-500"
                  onClick={() => handleRemove(product._id)}
                  title="Remove from wishlist"
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
} 