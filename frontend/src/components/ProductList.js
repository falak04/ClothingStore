import { useEffect, useState } from 'react';
import { fetchProducts, addToCart } from '../api/api';
import ProductCard from './ProductCard';
import { useNavigate } from 'react-router-dom';

export default function ProductList({ gender, category, filters = {}, searchTerm = '' }) {
  const [products, setProducts] = useState([]);
  const [expandedProductId, setExpandedProductId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts().then(res => setProducts(res.data));
  }, []);

  const handleAddToCart = async (userId, productId, quantity = 1) => {
    await addToCart(userId, productId, quantity);
    navigate('/cart');
  };

  // Filter products by gender, category, and search term if provided
  let filteredProducts = products.filter(product => {
    const matchesGender = gender
      ? (Array.isArray(product.Gender) && product.Gender.some(g =>
          g.toLowerCase().replace(/\s/g, '') === gender.toLowerCase().replace(/\s/g, '')
        ))
      : true;

    const matchesCategory = category
      ? (Array.isArray(product.category) && product.category.some(cat =>
          cat.toLowerCase().replace(/\s/g, '') === category.toLowerCase().replace(/\s/g, '')
        ))
      : true;

    // Split searchTerm into words, and require all words to be present in the product name
    const matchesSearch = searchTerm
      ? (product.name && searchTerm.trim().toLowerCase().split(/\s+/).every(word => product.name.toLowerCase().includes(word)))
      : true;

    return matchesGender && matchesCategory && matchesSearch;
  });

  // Apply sidebar filters
  if (filters.categories && filters.categories.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.category && product.category.some(cat => filters.categories.includes(cat))
    );
  }
  if (filters.genders && filters.genders.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      product.Gender && product.Gender.some(g => filters.genders.includes(g))
    );
  }
  if (filters.colors && filters.colors.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      (product.variants || []).some(v => filters.colors.includes(v.color))
    );
  }
  if (filters.sizes && filters.sizes.length > 0) {
    filteredProducts = filteredProducts.filter(product =>
      (product.variants || []).some(v => filters.sizes.includes(v.size))
    );
  }
  if (filters.price) {
    filteredProducts = filteredProducts.filter(product =>
      product.price >= filters.price.min && product.price < filters.price.max
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-6">
      {filteredProducts.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onAddToCart={handleAddToCart}
          expanded={expandedProductId === product._id}
          onExpand={() => setExpandedProductId(expandedProductId === product._id ? null : product._id)}
        />
      ))}
    </div>
  );
} 