import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Use backend enum values exactly
const categories = ['CasualWear', 'EthnicWear', 'OfficeWear', 'WesternWear'];
const genders = ['Female', 'Male', 'Kids'];
const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'white', 'black'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const priceRanges = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
  { label: '₹2000 & Above', min: 2000, max: Infinity },
];

export default function SidebarFilter({ onFilterChange, initialCategory, initialGender }) {
  // Store as-is for comparison
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || null);
  const [selectedGender, setSelectedGender] = useState(initialGender || null);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(null);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Sync sidebar state with URL search params and call onFilterChange after sync
  useEffect(() => {
    // Sync price
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    let found = null;
    if (priceMin && priceMax) {
      found = priceRanges.find(
        r => String(r.min) === priceMin && (String(r.max) === priceMax || (r.max === Infinity && priceMax === 'Infinity'))
      );
      setSelectedPrice(found || null);
    } else {
      setSelectedPrice(null);
    }

    // Sync colors
    const urlColors = searchParams.getAll('color');
    setSelectedColors(urlColors);

    // Sync sizes
    const urlSizes = searchParams.getAll('size');
    setSelectedSizes(urlSizes);

    // Sync category and gender
    const urlCategory = searchParams.get('category') || null;
    setSelectedCategory(urlCategory);
    const urlGender = searchParams.get('gender') || null;
    setSelectedGender(urlGender);

    // Call onFilterChange after syncing all state
    onFilterChange({
      categories: urlCategory ? [urlCategory] : [],
      genders: urlGender ? [urlGender] : [],
      colors: urlColors,
      sizes: urlSizes,
      price: found || null,
    });
    // eslint-disable-next-line
  }, [searchParams]);

  // Remove the useEffect that updates the URL on every state change.

  // Handlers to update the URL directly on user interaction
  const handleCategoryChange = (cat) => {
    const params = new URLSearchParams(window.location.search);
    if (cat) {
      params.set('category', cat);
    } else {
      params.delete('category');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleGenderChange = (g) => {
    const params = new URLSearchParams(window.location.search);
    if (g) {
      params.set('gender', g);
    } else {
      params.delete('gender');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handlePriceChange = (range) => {
    const params = new URLSearchParams(window.location.search);
    if (range) {
      params.set('priceMin', range.min);
      params.set('priceMax', range.max);
    } else {
      params.delete('priceMin');
      params.delete('priceMax');
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleColorChange = (color) => {
    const params = new URLSearchParams(window.location.search);
    const allColors = params.getAll('color');
    if (allColors.includes(color)) {
      // Remove
      const newColors = allColors.filter(c => c !== color);
      params.delete('color');
      newColors.forEach(c => params.append('color', c));
    } else {
      // Add
      params.append('color', color);
    }
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleSizeChange = (size) => {
    const params = new URLSearchParams(window.location.search);
    const allSizes = params.getAll('size');
    if (allSizes.includes(size)) {
      // Remove
      const newSizes = allSizes.filter(s => s !== size);
      params.delete('size');
      newSizes.forEach(s => params.append('size', s));
    } else {
      // Add
      params.append('size', size);
    }
    navigate({ search: params.toString() }, { replace: true });
  };


  return (
    <aside className="w-64 p-4 bg-white  rounded-2xl shadow ml-2">
      <h2 className="font-bold mb-4 text-lg text-classic-pink">FILTERS</h2>
      <div className="mb-4">
        <h3 className="font-semibold text-classic-pink">Category</h3>
        <label className="block">
          <input
            type="radio"
            name="category"
            checked={selectedCategory === null}
            onChange={() => handleCategoryChange(null)}
            className="accent-classic-pink" /> All
        </label>
        {categories.map(cat => (
          <label key={cat} className="block">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === cat}
              onChange={() => handleCategoryChange(cat)}
              className="accent-classic-pink" /> {cat}
          </label>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-classic-pink">Gender</h3>
        <label className="block">
          <input
            type="radio"
            name="gender"
            checked={selectedGender === null}
            onChange={() => handleGenderChange(null)}
            className="accent-classic-pink" /> All
        </label>
        {genders.map(g => (
          <label key={g} className="block">
            <input
              type="radio"
              name="gender"
              checked={selectedGender === g}
              onChange={() => handleGenderChange(g)}
              className="accent-classic-pink" /> {g}
          </label>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-classic-pink">Price Range</h3>
        <label className="block">
          <input
            type="radio"
            name="price"
            checked={selectedPrice === null}
            onChange={() => handlePriceChange(null)}
            className="accent-classic-pink" /> All
        </label>
        {priceRanges.map(range => (
          <label key={range.label} className="block">
            <input
              type="radio"
              name="price"
              checked={selectedPrice === range}
              onChange={() => handlePriceChange(range)}
              className="accent-classic-pink" /> {range.label}
          </label>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-classic-pink">Color</h3>
        {colors.map(color => (
          <label key={color} className="block">
            <input
              type="checkbox"
              checked={selectedColors.includes(color)}
              onChange={() => handleColorChange(color)}
              className="accent-classic-pink" /> {color.charAt(0).toUpperCase() + color.slice(1)}
          </label>
        ))}
      </div>
      <div className="mb-4">
        <h3 className="font-semibold text-classic-pink">Size</h3>
        {sizes.map(size => (
          <label key={size} className="block">
            <input
              type="checkbox"
              checked={selectedSizes.includes(size)}
              onChange={() => handleSizeChange(size)}
              className="accent-classic-pink" /> {size}
          </label>
        ))}
      </div>
    </aside>
  );
} 