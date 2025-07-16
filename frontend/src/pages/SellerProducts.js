import React, { useEffect, useState } from 'react';
import { fetchSellerProducts, deleteSellerProduct } from '../api/api';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (user && user._id) {
      fetchSellerProducts(user._id).then(res => setProducts(res.data));
    }
  }, [user]);

  const handleEdit = (id) => {
    navigate(`/seller/products/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteSellerProduct(id, user._id);
      setProducts(products.filter(p => p._id !== id));
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-pale-pink">
        <h2 className="text-2xl font-bold mb-4 text-classic-pink">My Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} isSellerView={true} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
} 