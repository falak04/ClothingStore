import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchProductById, addToCart } from '../api/api';
import Toast from '../components/Toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';

const ALL_SIZES = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

function isValidCssColor(color) {
  const s = new Option().style;
  s.color = '';
  s.color = color;
  return !!s.color;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState('');
  const [wishlisted, setWishlisted] = useState(() => {
    const stored = localStorage.getItem('wishlist');
    if (stored && product) {
      return JSON.parse(stored).some(p => p._id === id);
    }
    return false;
  });
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [flashNotif, setFlashNotif] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(res => {
        setProduct(res.data);
        // Default color: first color in variants or color array
        const defaultColor = res.data.variants?.[0]?.color || (res.data.color && res.data.color[0]) || '';
        setSelectedColor(defaultColor);
        // Default size: first size available for the default color
        const defaultSize = res.data.variants?.find(v => v.color === defaultColor)?.size || '';
        setSelectedSize(defaultSize);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (product) {
      const stored = localStorage.getItem('wishlist');
      if (stored) {
        setWishlisted(JSON.parse(stored).some(p => p._id === id));
      }
    }
  }, [product, id]);

  // Check for stock notifications on mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user._id) {
      axios.get(`http://localhost:8000/notify-stock/${user._id}`).then(res => {
        if (Array.isArray(res.data)) {
          // Check if any notification matches this product and is now in stock
          res.data.forEach(n => {
            if (
              n.productId === id &&
              product && product.variants && product.variants.some(v => v.size === n.size && v.color === n.color && v.stock > 0)
            ) {
              setFlashNotif({
                productId: id,
                size: n.size,
                color: n.color
              });
            }
          });
        }
      });
    }
  }, [id, product]);

  useEffect(() => {
    if (product && selectedColor) {
      // Find the first available size for the selected color
      const availableSize = (product.variants || []).find(v => v.color === selectedColor)?.size || '';
      setSelectedSize(availableSize);
    }
  }, [selectedColor, product]);

  const toggleWishlist = () => {
    let wishlist = [];
    const stored = localStorage.getItem('wishlist');
    if (stored) wishlist = JSON.parse(stored);
    if (wishlisted) {
      wishlist = wishlist.filter(p => p._id !== id);
    } else {
      wishlist.push(product);
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    setWishlisted(!wishlisted);
  };

  // Extract available sizes and colors from variants
  const sizes = Array.from(new Set((product?.variants || []).map(v => v.size)));
  const colors = Array.from(new Set((product?.variants || []).map(v => v.color)));
  // Find stock for selected size+color
  const selectedVariant = (product?.variants || []).find(v => v.size === selectedSize && v.color === selectedColor);

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      setError('Please select a size and color.');
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user && user._id;
    if (!userId) {
      alert('Please log in to add items to your cart.');
      navigate('/login');
      return;
    }
    setAdding(true);
    await addToCart(userId, product._id, 1, selectedSize, selectedColor);
    setAdding(false);
    window.dispatchEvent(new Event('cart-updated'));
    setToast('Item added to cart successfully!');
  };

  const handleNotifyMe = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) {
      alert('Please log in to use Notify Me.');
      return;
    }
    await axios.post('http://localhost:8000/notify-stock', {
      userId: user._id,
      productId: id,
      size: selectedVariant.size,
      color: selectedVariant.color
    });
    setNotifyRequested(true);
  };

  const handleBuyNow = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) {
      alert('Please log in to buy.');
      return;
    }
    setAdding(true);
    await addToCart(user._id, product._id, 1, flashNotif.size, flashNotif.color);
    setAdding(false);
    setFlashNotif(null);
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/cart');
  };

  const user = JSON.parse(sessionStorage.getItem('user'));
  const isSeller = user && user.role === 'seller';

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>;
  if (!product) return <div className="text-center text-red-500 mt-8">Product not found.</div>;

  return (
    <>
      {toast && <Toast message={toast} onClose={() => setToast('')} />}
      {flashNotif && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-4">
          <span>Product is back in stock (Size: {flashNotif.size}, Color: {flashNotif.color})!</span>
          <button className="bg-white text-green-600 font-bold px-4 py-2 rounded ml-4" onClick={handleBuyNow}>Buy Now</button>
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-10 bg-almost-white rounded-2xl shadow-lg p-0 md:p-8 flex flex-col md:flex-row gap-0 md:gap-8 min-h-[500px]">
        {/* Left: Large Product Image */}
        <div className="flex-1 flex items-center justify-center bg-white rounded-l-2xl border border-pale-pink">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full max-w-md h-[400px] object-contain rounded-2xl"
          />
        </div>
        {/* Right: Details */}
        <div className="flex-1 flex flex-col justify-start p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-1 tracking-wide text-classic-pink">{product.name}</h2>
              <div className="text-lg md:text-xl font-semibold text-classic-pink mb-1">Rs. {product.price?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
              <div className="text-xs text-gray-500 mb-2">MRP inclusive of all taxes</div>
            </div>
            {/* Heart Icon */}
            <button
              className="ml-4 text-2xl transition-colors"
              title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              onClick={toggleWishlist}
            >
              <FontAwesomeIcon icon={wishlisted ? faSolidHeart : faRegularHeart} className={wishlisted ? 'text-classic-pink' : 'text-gray-400'} />
            </button>
          </div>
          {/* Color Swatches */}
          <div className="mb-4">
            <span className="font-semibold text-lg">COLOR:</span> <span className="capitalize">{selectedColor}</span>
            <div className="flex gap-4 mt-2">
              {colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-10 h-10 rounded-md border-2 flex items-center justify-center transition-all duration-150 ${selectedColor === c ? 'border-classic-pink' : 'border-pale-pink'}`}
                  style={{ background: isValidCssColor(c) ? c : '#eee' }}
                  onClick={() => setSelectedColor(c)}
                  aria-label={c}
                >
                  {selectedColor === c && <span className="w-8 h-8 rounded bg-white bg-opacity-10 border border-classic-pink"></span>}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-2 font-semibold text-classic-pink">SELECT SIZE</div>
          <div className="mb-4 grid grid-cols-5 gap-0 border border-pale-pink rounded overflow-hidden w-full max-w-lg bg-white">
            {sizes.map((s, idx) => {
              const isAvailable = (product?.variants || []).some(v => v.size === s && v.color === selectedColor);
              return (
                <button
                  key={idx}
                  type="button"
                  className={`py-4 text-base border-r border-b border-pale-pink last:border-r-0 last:row-end-2 focus:outline-none transition
                    ${isAvailable
                      ? (selectedSize === s ? 'bg-classic-pink text-white' : 'bg-white text-classic-pink hover:bg-pale-pink')
                      : 'bg-white text-gray-400 line-through cursor-not-allowed'}
                  `}
                  style={{ minWidth: '60px' }}
                  onClick={() => { if (isAvailable) { setSelectedSize(s); setError(''); } }}
                  disabled={!isAvailable}
                >
                  {s}
                </button>
              );
            })}
          </div>
          {selectedVariant && selectedVariant.stock === 0 && (
            <>
              <div className="text-red-500 text-xs mb-2 font-semibold">Out of Stock</div>
              {!notifyRequested ? (
                <button className="bg-classic-pink text-white px-4 py-2 rounded" onClick={handleNotifyMe}>Notify Me</button>
              ) : (
                <div className="text-classic-pink text-xs mt-2">You'll be notified when this product is back in stock.</div>
              )}
            </>
          )}
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          {!isSeller && (
            <button
              className={`w-full max-w-lg bg-classic-pink hover:bg-pink text-white px-4 py-4 rounded-xl text-lg font-semibold tracking-widest transition mt-2 ${!selectedSize || !selectedVariant || selectedVariant.stock === 0 || adding ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedVariant || selectedVariant.stock === 0 || adding}
            >
              {adding ? 'ADDING...' : 'ADD'}
            </button>
          )}
        </div>
      </div>
    </>
  );
} 