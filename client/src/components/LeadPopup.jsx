import React, { useState, useEffect } from 'react';
import axios from 'axios';
import popupImage from '../assets/popupImage.png';

const API_BASE = process.env.REACT_APP_API_BASE_URL;

const LeadPopup = ({ isOpen, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [popupEnabled, setPopupEnabled] = useState(true);
  const [configChecked, setConfigChecked] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/leads/popup-config`);
        setPopupEnabled(res.data.enabled);
      } catch {
        setPopupEnabled(true); // Default to enabled if error
      } finally {
        setConfigChecked(true);
      }
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (showSuccessAnim) {
      const timer = setTimeout(() => {
        setShowSuccessAnim(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessAnim, onClose]);

  if (!isOpen || !configChecked || !popupEnabled) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.name.trim()) {
      setError('Name is required.');
      return;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be exactly 10 digits.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/api/leads`, form);
      setSuccess('Thank you! Your details have been submitted.');
      setForm({ name: '', phone: '' });
      setShowSuccessAnim(true);
    } catch (err) {
      setError(
        err.response?.data?.error || 'Submission failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="relative w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center">
        {/* Image at the top, fixed height */}
        <div className="w-full h-48 md:h-56 relative">
          <img
            src={popupImage}
            alt="Motivation"
            className="w-full h-full object-cover"
          />
          {/* Optional: Overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white text-2xl z-20 bg-black/40 rounded-full w-9 h-9 flex items-center justify-center"
          >
            &times;
          </button>
        </div>
        {/* Form Card */}
        <div className="relative z-10 w-full bg-white/95 px-6 py-8 flex flex-col items-center">
          {showSuccessAnim ? (
            <div className="flex flex-col items-center justify-center w-full animate-fade-in">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4 animate-scale-in">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="text-green-700 text-lg font-semibold mb-2 bg-white/80 px-4 py-2 rounded">Thank you!</div>
              <div className="text-gray-700 text-center mb-2">We will get back to you.</div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">
                Take Your First Step Toward Becoming a Doctor!
              </h2>
              <p className="text-gray-700 mb-4 text-center">
                Enter your name and phone number to get expert NEET guidance and updates.
              </p>
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="10-digit Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500"
                  maxLength={10}
                  pattern="\d{10}"
                  required
                />
                {error && <div className="text-red-600 text-sm">{error}</div>}
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg mt-2 transition"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Get Started"}
                </button>
              </form>
              <div className="text-xs text-gray-500 mt-4 text-center">
                We respect your privacy. Your details are safe with us.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadPopup; 