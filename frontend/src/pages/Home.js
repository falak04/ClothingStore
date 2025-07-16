import React, { useState } from 'react';
import casualwear from '../assets/casualwear.png'
import ethnicwear from '../assets/ethnicwear.png'
import officewear from '../assets/officewear.png'
import westernwear from '../assets/westernwear.png'
import { useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import img1 from '../assets/1.png.jpeg';
import img2 from '../assets/2.png.jpeg';
import img3 from '../assets/3.jpeg';
import img4 from '../assets/4.jpeg';
import { fetchProducts } from '../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faRegularHeart } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import { addToCart } from '../api/api';
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef();
  const navigate = useNavigate();
  // const { gender } = useParams();
  const [featured, setFeatured] = useState([]);
  const [flashNotif, setFlashNotif] = useState(null);
  const [adding, setAdding] = useState(false);

  // Carousel auto-slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(idx => (idx + 1) % 4);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Swipe support
  useEffect(() => {
    const ref = carouselRef.current;
    if (!ref) return;
    let startX = null;
    const onTouchStart = e => { startX = e.touches[0].clientX; };
    const onTouchEnd = e => {
      if (startX === null) return;
      const endX = e.changedTouches[0].clientX;
      if (endX - startX > 50) setCarouselIndex(idx => (idx - 1 + 4) % 4);
      if (startX - endX > 50) setCarouselIndex(idx => (idx + 1) % 4);
      startX = null;
    };
    ref.addEventListener('touchstart', onTouchStart);
    ref.addEventListener('touchend', onTouchEnd);
    return () => {
      ref.removeEventListener('touchstart', onTouchStart);
      ref.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    fetchProducts().then(res => {
      setFeatured(res.data.filter(product => product.isFeatured === true));
    });
  }, []);

  // Check for stock notifications on mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (user && user._id) {
      axios.get(`http://localhost:8000/notify-stock/${user._id}`).then(async res => {
        if (Array.isArray(res.data)) {
          for (const n of res.data) {
            // Fetch product and check if variant is in stock
            const prodRes = await axios.get(`http://localhost:8000/products/${n.productId}`);
            const prod = prodRes.data;
            if (prod && prod.variants && prod.variants.some(v => v.size === n.size && v.color === n.color && v.stock > 0)) {
              setFlashNotif({
                productId: n.productId,
                size: n.size,
                color: n.color,
                product: prod
              });
              // Mark as notified in backend
              await axios.post('http://localhost:8000/notify-stock', {
                userId: user._id,
                productId: n.productId,
                size: n.size,
                color: n.color,
                notified: true
              });
              break;
            }
          }
        }
      });
    }
  }, []);

  const handleCategoryClick = (categoryId, categoryTitle) => {
    setSelectedCategory({ id: categoryId, title: categoryTitle });
    console.log(categoryId);
    navigate(`/products?category=${categoryId}`);
  };

  const handleBuyNow = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user || !user._id) {
      alert('Please log in to buy.');
      return;
    }
    setAdding(true);
    await addToCart(user._id, flashNotif.productId, 1, flashNotif.size, flashNotif.color);
    setAdding(false);
    setFlashNotif(null);
    window.dispatchEvent(new Event('cart-updated'));
    navigate('/cart');
  };

  const categories = [
    {
      id: 'CasualWear',
      title: 'WFH Casual Wear',
      discount: '40-80% OFF',
      image: casualwear, 
      bgColor: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      id: 'EthnicWear',
      title: 'Ethnic Wear',
      discount: '50-80% OFF',
      image: ethnicwear,
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600'
    },
    {
      id: 'OfficeWear',
      title: 'Office Wear',
      discount: '30-70% OFF',
      image: officewear,
      bgColor: 'bg-gradient-to-br from-purple-500 to-blue-500'
    },
    {
      id: 'WesternWear',
      title: 'Western Wear',
      discount: '30-70% OFF',
      image: westernwear,
      bgColor: 'bg-gradient-to-br from-blue-500 to-green-500'
    }
  ];

  const carouselImages = [img1, img2, img3, img4];
  const carouselTitles = ['Carousel 1', 'Carousel 2', 'Carousel 3', 'Carousel 4'];
  const carouselGenders = ['All', 'Kids', 'Male', 'Female'];

  return (
    <>
      {/* Carousel */}
      <div className="w-full max-w-7xl mx-auto mt-4 mb-12">
        <div ref={carouselRef} className="relative w-full aspect-[16/6] max-h-[32rem] rounded-2xl overflow-hidden bg-white border border-pale-pink shadow flex items-center justify-center">
          {carouselImages.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={carouselTitles[idx]}
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${carouselIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              draggable="false"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (carouselGenders[idx] === 'All') {
                  navigate('/products');
                } else {
                  navigate(`/products?gender=${carouselGenders[idx]}`);
                }
              }}
            />
          ))}
          {/* Minimalistic dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselImages.map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border border-classic-pink transition ${carouselIndex === idx ? 'bg-classic-pink' : 'bg-white'}`}
                onClick={() => setCarouselIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 bg-almost-white min-h-screen rounded-xl border border-pale-pink">
        {/* Header Section
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-classic-pink">Welcome to the Clothing Store!</h1>
          <p className="text-lg text-gray-500">Shop the latest trends and enjoy seamless shopping.</p>
          {selectedCategory && (
            <div className="mt-4 p-4 bg-pale-pink rounded-lg">
              <p className="text-classic-pink font-semibold">
                You selected: {selectedCategory.title} (ID: {selectedCategory.id})
              </p>
            </div>
          )}
        </div> */}

        {/* Shop by Category Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-classic-pink mb-8 tracking-wider">SHOP BY CATEGORY</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.title)}
                className="relative cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group rounded-2xl overflow-hidden bg-pale-pink shadow"
              >
                <div className="relative  rounded-lg overflow-hidden shadow-lg">
                  {/* Background Image */}
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 rounded-2xl"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-classic-pink bg-opacity-10 group-hover:bg-opacity-5 transition-all duration-300 rounded-2xl"></div>
                  
                  {/* Content Overlay */}
                  {/* <div className={`absolute bottom-0 left-0 right-0 ${category.bgColor} p-6 text-white`}>
                    <h3 className="text-xl font-bold mb-2">{category.title}</h3>
                    <p className="text-2xl font-bold mb-3">{category.discount}</p>
                    <button className="bg-white text-gray-800 px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors duration-200">
                      Shop Now
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals Section */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-4xl font-bold mb-2 flex items-end justify-center gap-2">
              <span
                className="text-[3rem] font-extrabold"
                style={{
                  fontFamily: "'Dancing Script', cursive",
                  color: "#FFD700",
                  display: "inline-block",
                  lineHeight: 1,
                  letterSpacing: "0.08em",
                  fontWeight: 900,
                }}
              >
                New
              </span>
              <span
                className="text-black"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  fontSize: "2.5rem",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                ARRIVALS
              </span>
            </h2>
            <div className="text-gray-500 max-w-2xl mx-auto text-base font-medium">
              Discover the latest styles freshly added to our collection – from laid-back essentials to standout statement pieces, all designed to keep your wardrobe fresh and effortlessly on-trend.
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featured.map(product => (
              <div
                key={product._id}
                className="relative group flex flex-col items-center bg-gradient-to-br from-[#f7f6f3] to-[#ece9e2] rounded-[2rem] shadow-lg p-5 pt-8 cursor-pointer hover:shadow-2xl transition"
                style={{minHeight:'370px'}} 
                onClick={() => navigate(`/product/${product._id}`)}
              >
                {/* Heart Icon */}
                <button className="absolute top-4 right-4 text-xl text-gray-400 hover:text-classic-pink transition z-10 bg-white rounded-full p-2 shadow-md">
                  <FontAwesomeIcon icon={faRegularHeart} />
                </button>
                {/* Product Image */}
                <div className="w-full flex-1 flex items-center justify-center mb-4">
                  <img src={product.imageUrl} alt={product.name} className="h-48 w-auto object-contain rounded-xl drop-shadow" />
                </div>
                {/* Product Info */}
                <div className="w-full flex flex-col items-center">
                  <div className="font-semibold text-gray-900 text-base text-center mb-1">{product.name}</div>
                  <div className="text-classic-pink font-bold text-lg mb-2">₹{product.price}</div>
                  <button className="bg-classic-pink hover:bg-pale-pink text-white hover:text-classic-pink px-8 py-2 rounded-full font-semibold shadow transition">Buy</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Features Section */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="text-xl font-bold mb-2">Free Shipping</h3>
            <p className="text-gray-600">Free shipping on orders over ₹999</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="text-xl font-bold mb-2">Easy Returns</h3>
            <p className="text-gray-600">30-day return policy</p>
          </div>
          
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <div className="text-4xl mb-4">🎧</div>
            <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
            <p className="text-gray-600">Customer support available anytime</p>
          </div>
        </div> */}
      </div>
      {flashNotif && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-xl shadow-lg z-50 flex items-center gap-4">
          <span>{flashNotif.product?.name || 'Product'} is back in stock (Size: {flashNotif.size}, Color: {flashNotif.color})!</span>
          <button className="bg-white text-green-600 font-bold px-4 py-2 rounded ml-4" onClick={handleBuyNow} disabled={adding}>{adding ? 'Adding...' : 'Buy Now'}</button>
          <button
            className="ml-2 text-white text-xl font-bold bg-transparent border-none cursor-pointer hover:text-gray-200 focus:outline-none"
            onClick={() => setFlashNotif(null)}
            aria-label="Close notification"
            style={{ lineHeight: 1 }}
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}