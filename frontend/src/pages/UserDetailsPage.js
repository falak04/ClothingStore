import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserDetails, saveUserDetails } from '../api/api';

export default function UserDetailsPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [details, setDetails] = useState({
    phoneNumber: '',
    fullName: '',
    email: '',
    gender: '',
    dateOfBirth: '',
    location: '',
    address: '',
    alternateMobile: '',
    hintName: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    const userObj = JSON.parse(storedUser);
    setUser(userObj);
    // Fetch user details from backend
    fetchUserDetails(userObj._id)
      .then(res => {
        const d = res.data || {};
        setDetails(prev => ({
          ...prev,
          phoneNumber: d.phoneNumber || '',
          fullName: userObj.username || '',
          email: userObj.email || '',
          gender: d.gender || '',
          dateOfBirth: d.dateOfBirth ? d.dateOfBirth.slice(0, 10) : '',
          location: d.location || '',
          address: d.address || '',
          alternateMobile: d.alternateMobile || '',
          hintName: d.hintName || ''
        }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleGender = (gender) => {
    setDetails(prev => ({ ...prev, gender }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError('');
    try {
      await saveUserDetails({
        userId: user._id,
        phoneNumber: details.phoneNumber,
        gender: details.gender,
        dateOfBirth: details.dateOfBirth,
        location: details.location,
        address: details.address,
        alternateMobile: details.alternateMobile,
        hintName: details.hintName
      });
      setSuccess(true);
    } catch (err) {
      setError('Failed to save details.');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-64 text-gray-400">Loading...</div>;

  return (
    <>
      <div className="max-w-xl mx-auto mt-8 bg-white rounded-xl shadow p-6 border border-pale-pink">
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Mobile Number*</label>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Mobile Number"
              name="phoneNumber"
              value={details.phoneNumber}
              onChange={handleChange}
              type="tel"
              maxLength={15}
              required
            />
          </div>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Full Name"
            name="fullName"
            value={details.fullName}
            onChange={handleChange}
            disabled
          />
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Email"
            name="email"
            value={details.email}
            onChange={handleChange}
            disabled
          />
          <div className="flex mb-4">
            <button
              type="button"
              className={`flex-1 border py-3 rounded-l ${details.gender === 'Male' ? 'bg-gray-100 font-bold' : ''}`}
              onClick={() => handleGender('Male')}
            >
              Male
            </button>
            <button
              type="button"
              className={`flex-1 border-t border-b border-r py-3 rounded-r ${details.gender === 'Female' ? 'bg-gray-100 font-bold' : ''}`}
              onClick={() => handleGender('Female')}
            >
              {details.gender === 'Female' && <span className="text-pink-500 mr-1">&#10003;</span>}Female
            </button>
          </div>
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Birthday (yyyy-mm-dd)"
            name="dateOfBirth"
            value={details.dateOfBirth}
            onChange={handleChange}
            type="date"
          />
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Location"
            name="location"
            value={details.location}
            onChange={handleChange}
          />
          <input
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Address"
            name="address"
            value={details.address}
            onChange={handleChange}
          />
          <div className="font-semibold mb-2 mt-6">Alternate mobile details</div>
          <div className="flex mb-2">
            <span className="border rounded-l px-3 py-2 bg-gray-50 text-gray-500">+91</span>
            <input
              className="w-full border-t border-b border-r rounded-r px-3 py-2"
              placeholder="Alternate Mobile"
              name="alternateMobile"
              value={details.alternateMobile}
              onChange={handleChange}
            />
          </div>
          <input
            className="w-full border rounded px-3 py-2 mb-6"
            placeholder="Hint name"
            name="hintName"
            value={details.hintName}
            onChange={handleChange}
          />
          {success && <div className="text-green-600 mb-2">Details saved successfully!</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          <button
            type="submit"
            className="w-full bg-classic-pink hover:bg-pale-pink text-white font-bold py-3 rounded mt-2 text-lg transition"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'SAVE DETAILS'}
          </button>
        </form>
      </div>
    </>
  );
} 