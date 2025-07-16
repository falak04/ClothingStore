import { useState } from 'react';
import { login, register } from '../api/api';
import { useNavigate } from 'react-router-dom';

export function LoginForm() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const res = await login(form);
      console.log(res.data.user);
      // Store userId in sessionStorage for session
      if (res.data && res.data.user && res.data.user._id) {
        sessionStorage.setItem('user', JSON.stringify(res.data.user));
        window.dispatchEvent(new Event('user-login'));
        window.dispatchEvent(new Event('cart-updated'));
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col gap-4">
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button type="submit" className="bg-classic-pink hover:bg-pale-pink text-white py-2 rounded transition">Login</button>
    </form>
  );
}

export function RegisterForm() {
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(form);
      console.log(1);
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-10 p-6 bg-white rounded shadow flex flex-col gap-4">
      {/* Role Toggler */}
      <div className="flex mb-2">
        <button
          type="button"
          className={`flex-1 py-2 rounded-l border border-classic-pink font-semibold text-lg transition ${form.role === 'customer' ? 'bg-classic-pink text-white' : 'bg-white text-classic-pink hover:bg-pale-pink'}`}
          onClick={() => setForm({ ...form, role: 'customer' })}
        >
          Customer
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-r border-t border-b border-r border-classic-pink font-semibold text-lg transition ${form.role === 'seller' ? 'bg-classic-pink text-white' : 'bg-white text-classic-pink hover:bg-pale-pink'}`}
          onClick={() => setForm({ ...form, role: 'seller' })}
        >
          Seller
        </button>
      </div>
      <input placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="border rounded px-3 py-2" />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {success && <div className="text-green-600 text-sm">{success}</div>}
      <button type="submit" className="bg-classic-pink hover:bg-pale-pink text-white py-2 rounded transition">Register</button>
    </form>
  );
} 