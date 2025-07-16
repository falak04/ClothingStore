import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faHeart, faBagShopping, faSearch } from '@fortawesome/free-solid-svg-icons';
import UserDropdown from './UserDropdown';
import logo from '../assets/image.png';
import { fetchCart } from '../api/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialSearch = params.get('search') || '';
  const [search, setSearch] = useState(initialSearch);
  const [cartCount, setCartCount] = useState(0);

  // Update search state if URL changes (e.g., back/forward navigation)
  useEffect(() => {
    setSearch(params.get('search') || '');
    // eslint-disable-next-line
  }, [location.search]);

  // Debounced update of URL as user types
  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = new URLSearchParams(location.search);
      if (search) {
        newParams.set('search', search);
      } else {
        newParams.delete('search');
      }
      navigate({ search: newParams.toString() }, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [search, navigate, location.search]);

  useEffect(() => {
    const fetchAndSetCartCount = () => {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const userId = user && user._id;
      if (userId) {
        fetchCart(userId)
          .then(res => {
            const items = res.data && Array.isArray(res.data.items) ? res.data.items : [];
            const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
            setCartCount(count);
          })
          .catch(err => {
            setCartCount(0);
          });
      } else {
        setCartCount(0);
      }
    };

    fetchAndSetCartCount();
    window.addEventListener('cart-updated', fetchAndSetCartCount);
    return () => window.removeEventListener('cart-updated', fetchAndSetCartCount);
  }, []);

  const user = JSON.parse(sessionStorage.getItem('user'));
  const isSeller = user && user.role === 'seller';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow flex items-center justify-between px-8 py-2">
      {/* Logo */}
      <div className="flex items-center mr-8">
        <Link to="/">
          <div className="w-40 h-20 flex items-center justify-center">
            <img src={logo} alt="Clothing Store Logo" className="h-20 w-auto object-contain" />
          </div>
        </Link>
      </div>
      {/* Menu Items */}
      <div className="flex space-x-8 font-bold text-gray-900 text-base tracking-wide">
        <Link to="/products?gender=Male" className="hover:text-classic-pink transition">MEN</Link>
        <Link to="/products?gender=Female" className="hover:text-classic-pink transition">WOMEN</Link>
        <Link to="/products?gender=Kids" className="hover:text-classic-pink transition">KIDS</Link>
        <Link to="/" className="hover:text-classic-pink transition">HOME</Link>
      </div>
      {/* Search Bar */}
      <div className="flex-1 flex justify-center mx-8">
        <div className="relative w-full max-w-xl">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <FontAwesomeIcon icon={faSearch} />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for products, brands and more"
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-100 focus:bg-white border border-gray-200 focus:border-classic-pink outline-none transition placeholder-gray-500"
          />
        </div>
      </div>
      {/* Icons */}
      <div className="flex items-center space-x-8 ml-8">
        <div className="flex flex-col items-center">
          <UserDropdown />
          <span className="text-xs font-semibold text-gray-900">Profile</span>
        </div>
        {!isSeller && (
          <>
            <Link to="/wishlist" className="flex flex-col items-center group">
              <FontAwesomeIcon icon={faHeart} className="text-xl text-gray-700 group-hover:text-classic-pink transition" />
              <span className="text-xs font-semibold text-gray-900 group-hover:text-classic-pink">Wishlist</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center group relative">
              <FontAwesomeIcon icon={faBagShopping} className="text-xl text-gray-700 group-hover:text-classic-pink transition" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-classic-pink text-white text-xs font-bold rounded-full px-2 py-0.5 shadow">
                  {cartCount}
                </span>
              )}
              <span className="text-xs font-semibold text-gray-900 group-hover:text-classic-pink">Bag</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
} 