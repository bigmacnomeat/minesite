import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ADMIN_PASSWORD = "mine_admin_2024"; // You should change this to a secure password

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin/dashboard');
    } else {
      setError('Invalid password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold text-mine-crystal mb-6 text-center">Admin Login</h2>
        {error && (
          <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white mb-4"
          />
          <button
            type="submit"
            className="w-full bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal rounded px-4 py-2 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
