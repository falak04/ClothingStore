import { useEffect } from 'react';

export default function Toast({ message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-classic-pink text-white px-6 py-3 rounded-xl shadow-lg z-50 text-lg font-semibold animate-fade-in">
      {message}
    </div>
  );
} 