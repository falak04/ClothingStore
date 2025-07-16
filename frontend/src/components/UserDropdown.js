import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

export default function UserDropdown() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateUser = () => {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    updateUser();
    // Close dropdown on outside click
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('user-login', updateUser);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('user-login', updateUser);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
    setOpen(false);
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/login');
  };

  const handleDetails = () => {
    setOpen(false);
    navigate('/user/details');
  };

  const handleOrders = () => {
    setOpen(false);
    navigate('/orders');
  };

  const handleLogin = () => {
    setOpen(false);
    navigate('/login');
  };
  const handleSignUp = () => {
    setOpen(false);
    navigate('/register');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white hover:bg-white hover:text-white focus:outline-none transition-colors"
        onClick={() => setOpen((o) => !o)}
      >
        <FontAwesomeIcon icon={faCircleUser} className="w-6 h-6 text-classic-pink" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-classic-pink z-50 p-4">
          {user ? (
            <>
              <div className="font-bold text-classic-pink mb-1">Hello {user.username}</div>
              {user.phoneNumber && (
                <div className="text-sm text-gray-600 mb-2">{user.phoneNumber}</div>
              )}
              <button
                className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm"
                onClick={handleDetails}
              >
                Details
              </button>
              <button
                className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm"
                onClick={handleOrders}
              >
                Orders
              </button>
              {user && user.role === 'seller' && (
                <>
                  <button
                    className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm"
                    onClick={() => { setOpen(false); navigate('/seller/products/add'); }}
                  >
                    Add Product
                  </button>
                  <button
                    className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm"
                    onClick={() => { setOpen(false); navigate('/seller/products'); }}
                  >
                    My Products
                  </button>
                  <button
                    className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm"
                    onClick={() => { setOpen(false); navigate('/seller/orders'); }}
                  >
                    My Orders (Seller)
                  </button>
                </>
              )}
              <button
                className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm text-red-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (<>
            <button
              className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm text-classic-pink font-semibold"
              onClick={handleLogin}
            >
              Login
            </button>
                        <button
                        className="w-full text-left py-2 px-2 hover:bg-pale-pink rounded text-sm text-classic-pink font-semibold"
                        onClick={handleSignUp}
                      >
                        Sign Up
                      </button></>
          )}
        </div>
      )}
    </div>
  );
} 