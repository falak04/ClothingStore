import React from 'react';

export default function FilterChips({ category, gender, price, colors, sizes, onRemove }) {
  const chips = [];
  if (category) chips.push({ label: category, key: 'category' });
  if (gender) chips.push({ label: gender, key: 'gender' });
  if (price) chips.push({ label: price.label, key: 'price' });
  if (colors && colors.length > 0) {
    colors.forEach(color => chips.push({ label: color.charAt(0).toUpperCase() + color.slice(1), key: `color-${color}` }));
  }
  if (sizes && sizes.length > 0) {
    sizes.forEach(size => chips.push({ label: size, key: `size-${size}` }));
  }
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {chips.map(chip => (
        <span key={chip.key} className="flex items-center bg-pale-pink rounded-full px-3 py-1 text-sm font-medium text-classic-pink">
          {chip.label}
          <button
            className="ml-2 text-classic-pink hover:text-pink-400 focus:outline-none"
            onClick={() => onRemove(chip.key)}
          >
            &times;
          </button>
        </span>
      ))}
    </div>
  );
} 