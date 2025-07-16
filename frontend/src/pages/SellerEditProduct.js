import React, { useEffect, useState } from 'react';
import { fetchProductById, addSellerProduct } from '../api/api';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function SellerEditProduct() {
  const { id } = useParams();
  const [form, setForm] = useState({ name: '', price: '', description: '', category: [], Gender: [], imageUrl: '', isFeatured: false });
  const [variants, setVariants] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    fetchProductById(id).then(res => {
      const prod = res.data;
      setForm({
        name: prod.name || '',
        price: prod.price || '',
        description: prod.description || '',
        category: (prod.category && prod.category[0]) || '',
        Gender: (prod.Gender && prod.Gender[0]) || '',
        imageUrl: prod.imageUrl || '',
        isFeatured: prod.isFeatured || false
      });
      setVariants(prod.variants || []);
    });
  }, [id]);

  // Add variant handler
  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', stock: 0 }]);
  };
  // Update variant handler
  const updateVariant = (idx, field, value) => {
    setVariants(variants.map((v, i) => i === idx ? { ...v, [field]: value } : v));
  };
  // Remove variant handler
  const removeVariant = idx => {
    setVariants(variants.filter((_, i) => i !== idx));
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else if (type === 'select-multiple') {
      setForm({ ...form, [name]: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.put(`http://localhost:8000/seller/products/${id}`, { ...form, variants, sellerId: user._id });
      setSuccess('Product updated!');
      setTimeout(() => navigate('/seller/products'), 1000);
    } catch (err) {
      setError('Failed to update product.');
    }
  };

  return (
    <>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow border border-pale-pink">
        <h2 className="text-2xl font-bold mb-4 text-classic-pink">Edit Product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="border border-pale-pink bg-almost-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-classic-pink" />
          <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} className="border border-pale-pink bg-almost-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-classic-pink" />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} className="border border-pale-pink bg-almost-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-classic-pink" />

          <div>
            <div className="font-semibold mb-1 text-classic-pink">Category:</div>
            {['CasualWear','EthnicWear','OfficeWear','WesternWear'].map(cat => (
              <label key={cat} className="mr-4 text-gray-700">
                <input type="radio" name="category" value={cat} checked={form.category === cat} onChange={handleChange} className="mr-1 accent-classic-pink" />
                {cat}
              </label>
            ))}
          </div>

          <div>
            <div className="font-semibold mb-1 text-classic-pink">Gender:</div>
            {['Female','Male','Kids'].map(g => (
              <label key={g} className="mr-4 text-gray-700">
                <input type="radio" name="Gender" value={g} checked={form.Gender === g} onChange={handleChange} className="mr-1 accent-classic-pink" />
                {g}
              </label>
            ))}
          </div>

          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} className="border border-pale-pink bg-almost-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-classic-pink" />

          <div>
            <div className="font-semibold mb-1 text-classic-pink">Variants:</div>
            {variants.map((variant, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <select value={variant.size} onChange={e => updateVariant(idx, 'size', e.target.value)}>
                  <option value="">Size</option>
                  {['XS','S','M','L','XL','XXL'].map(sz => <option key={sz} value={sz}>{sz}</option>)}
                </select>
                <select value={variant.color} onChange={e => updateVariant(idx, 'color', e.target.value)}>
                  <option value="">Color</option>
                  {['red','blue','green','yellow','purple','white','black'].map(clr => <option key={clr} value={clr}>{clr}</option>)}
                </select>
                <input type="number" min="0" value={variant.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} placeholder="Stock" />
                <button type="button" onClick={() => removeVariant(idx)} className="text-red-500">Remove</button>
              </div>
            ))}
            <button type="button" onClick={addVariant} className="text-classic-pink">Add Variant</button>
          </div>

          <label className="flex items-center gap-2 text-gray-700">
            <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange} className="accent-classic-pink" /> Featured
          </label>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button type="submit" className="bg-classic-pink hover:bg-pale-pink text-white hover:text-classic-pink py-2 rounded transition">Update Product</button>
        </form>
      </div>
    </>
  );
} 