import ProductList from '../components/ProductList';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SidebarFilter from '../components/SidebarFilter';
import FilterChips from '../components/FilterChips';
import React from 'react';

export default function Products() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Always extract filters from current searchParams so they update on navigation
  const gender = searchParams.get('gender') || '';
  const category = searchParams.get('category') || '';
  const searchTerm = searchParams.get('search') || '';
  const priceMin = searchParams.get('priceMin');
  const priceMax = searchParams.get('priceMax');
  const colors = searchParams.getAll('color');
  const sizes = searchParams.getAll('size');
  const [filters, setFilters] = React.useState({});
  const [sidebarKey, setSidebarKey] = React.useState(0);

  // Find the price label if price is set
  let price = null;
  if (priceMin && priceMax) {
    const priceRanges = [
      { label: 'Under ₹500', min: 0, max: 500 },
      { label: '₹500 - ₹1000', min: 500, max: 1000 },
      { label: '₹1000 - ₹2000', min: 1000, max: 2000 },
      { label: '₹2000 & Above', min: 2000, max: Infinity },
    ];
    price = priceRanges.find(r => String(r.min) === priceMin && (String(r.max) === priceMax || (r.max === Infinity && priceMax === 'Infinity')));
  }

  const handleRemoveFilter = (key) => {
    const params = new URLSearchParams(window.location.search);
    let shouldResetSidebar = false;
    if (key === 'category') { params.delete('category'); shouldResetSidebar = true; }
    if (key === 'gender') { params.delete('gender'); shouldResetSidebar = true; }
    if (key === 'price') {
      params.delete('priceMin');
      params.delete('priceMax');
      shouldResetSidebar = true;
    }
    if (key.startsWith('color-')) {
      const color = key.replace('color-', '');
      const allColors = params.getAll('color').filter(c => c !== color);
      params.delete('color');
      allColors.forEach(c => params.append('color', c));
      shouldResetSidebar = true;
    }
    if (key.startsWith('size-')) {
      const size = key.replace('size-', '');
      const allSizes = params.getAll('size').filter(s => s !== size);
      params.delete('size');
      allSizes.forEach(s => params.append('size', s));
      shouldResetSidebar = true;
    }
    navigate({ search: params.toString() }, { replace: true });
    if (shouldResetSidebar) setSidebarKey(prev => prev + 1);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto mt-8 flex bg-almost-white rounded-xl">
        <SidebarFilter 
          key={sidebarKey}
          onFilterChange={setFilters} 
          initialCategory={category}
          initialGender={gender}
        />
        <div className="flex-1">
          <div className="px-6">
            <FilterChips category={category} gender={gender} price={price} colors={colors} sizes={sizes} onRemove={handleRemoveFilter} />
          </div>
          <ProductList gender={gender} category={category} filters={filters} searchTerm={searchTerm} />
        </div>
      </div>
    </>
  );
} 