import {useNavigate} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchProductById } from '../api/api';
import Toast from './Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';

export default function ProductCard({ product, onAddToCart, expanded, onExpand, isWishlisted, isSellerView, onEdit, onDelete }) {
  const navigate = useNavigate();
  const [details, setDetails] = useState(product);
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.color && product.color[0] ? product.color[0] : '');
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  // Wishlist logic
  const [wishlisted, setWishlisted] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored) {
      return JSON.parse(stored).some(p => p._id === product._id);
    }
    return false;
  });

  useEffect(() => {
    if (expanded && (!details.description || !details.size || !details.color)) {
      setLoading(true);
      fetchProductById(product._id)
        .then(res => {
          setDetails(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
    if (!expanded) {
      setSelectedSize('');
      setError('');
    }
    if (typeof isWishlisted === 'boolean') setWishlisted(isWishlisted);
    // eslint-disable-next-line
  }, [expanded, product._id, isWishlisted, details]);

  // Reset selectedColor and selectedSize when collapsed
  useEffect(() => {
    if (!expanded) {
      setSelectedColor('');
      setSelectedSize('');
    }
  }, [expanded]);

  // Set default color every time expanded and details/variants are available
  useEffect(() => {
    if (expanded) {
      const colors = Array.from(new Set((details.variants || []).map(v => v.color)));
      if (colors.length > 0) {
        setSelectedColor(colors[0]);
      }
    }
  }, [expanded, details]);

  // Extract available sizes and colors from variants
  const sizes = Array.from(new Set((details.variants || []).map(v => v.size)));
  const colors = Array.from(new Set((details.variants || []).map(v => v.color)));
  // Find stock for selected size+color
  const selectedVariant = (details.variants || []).find(v => v.size === selectedSize && v.color === selectedColor);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!selectedSize || !selectedColor) {
      setError('Please select a size and color.');
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user && user._id;
    if (userId) {
      await onAddToCart(userId, product._id, 1, selectedSize, selectedColor); // Pass size and color
      window.dispatchEvent(new Event('cart-updated'));
      setToast('Item added to cart successfully!');
    } else {
      alert('Please log in to add items to your cart.');
      navigate('/login');
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    let wishlist = [];
    const stored = localStorage.getItem('wishlist');
    if (stored) wishlist = JSON.parse(stored);
    if (wishlisted) {
      wishlist = wishlist.filter(p => p._id !== product._id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlisted(!wishlisted);
  };

  // Make the whole card clickable to go to detail page
  const handleCardClick = (e) => {
    if (isSellerView) return; // Disable navigation for seller view
    // Only navigate if not clicking on a button inside the card
    if (e.target.tagName !== 'BUTTON') {
      navigate(`/product/${details._id}`);
    } else if (onExpand) {
      onExpand();
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-6 flex flex-col items-center transition-all duration-300 ${isSellerView ? '' : 'cursor-pointer'} ${expanded ? 'ring-2 ring-classic-pink scale-105 z-10' : ''}`}
      onClick={handleCardClick}
      style={{ position: 'relative' }}
    >
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      {/* Wishlist Heart Button */}
      {!isSellerView && (
        <button
          className="absolute top-4 right-4 text-2xl z-10"
          onClick={toggleWishlist}
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FontAwesomeIcon icon={wishlisted ? faSolidHeart : faRegularHeart} className={wishlisted ? 'text-classic-pink' : 'text-gray-400'} />
        </button>
      )}
      <img src={details.imageUrl} alt={details.name} className="w-32 h-32 object-contain rounded mb-2 bg-light-pink" />
      <h3 className="text-lg font-bold mb-1 text-classic-pink hover:underline">{details.name}</h3>
      <p className="text-classic-pink font-semibold mb-1">₹{details.price}</p>
      {expanded && !isSellerView && (
        <div className="w-full mt-2">
          {loading ? (
            <div className="text-center text-gray-400">Loading...</div>
          ) : (
            <>
              <p className="text-gray-600 mb-2">{details.description}</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="font-semibold text-sm">Colors:</span>
                {colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`px-2 py-1 rounded border text-xs ${selectedColor === c ? 'bg-classic-pink text-white border-classic-pink' : 'bg-light-pink text-gray-700 border-pale-pink'}`}
                    onClick={e => { e.stopPropagation(); setSelectedColor(c); setError(''); }}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="font-semibold text-sm">Sizes:</span>
                {sizes.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`px-3 py-1 rounded border text-xs font-medium transition ${selectedSize === s ? 'bg-classic-pink text-white border-classic-pink' : 'bg-light-pink text-gray-700 border-pale-pink hover:bg-pale-pink'}`}
                    onClick={e => { e.stopPropagation(); setSelectedSize(s); setError(''); }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {selectedVariant && selectedVariant.stock === 0 && (
                <div className="text-red-500 text-xs mb-2 font-semibold">Out of Stock</div>
              )}
              {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
              {!isSellerView && (
                <button
                  className={`w-full bg-classic-pink hover:bg-pale-pink text-white px-4 py-2 rounded-xl transition mt-2 ${!selectedSize || !selectedColor || !selectedVariant || selectedVariant.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleAddToCart}
                  disabled={!selectedSize || !selectedColor || !selectedVariant || selectedVariant.stock === 0}
                >
                  Add to Cart
                </button>
              )}
            </>
          )}
        </div>
      )}
      {isSellerView && (
        <div className="flex gap-2 mt-2">
          <button onClick={e => { e.stopPropagation(); onEdit && onEdit(product._id); }} className="bg-yellow-500 text-white px-3 py-1 rounded shadow">Edit</button>
          <button onClick={e => { e.stopPropagation(); onDelete && onDelete(product._id); }} className="bg-red-500 text-white px-3 py-1 rounded shadow">Delete</button>
        </div>
      )}
      {!expanded && !isSellerView && (
        <>
          {/* Removed sizes and colors display from collapsed card */}
        </>
      )}
    </div>
  );
} 