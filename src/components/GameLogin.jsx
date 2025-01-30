import React, { useState } from 'react';

const GameLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    wallet: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { wallet, password } = formData;

    if (!wallet.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await onLogin(wallet.trim(), password);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-black p-8 rounded-lg border-2 border-green-400 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-400 text-center mb-6">
          Crypto Conquerors
        </h2>
        
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-400 p-3 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="wallet" className="block text-green-400 text-sm font-medium mb-1">
              Wallet Address
            </label>
            <input
              id="wallet"
              name="wallet"
              type="text"
              value={formData.wallet}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 text-green-400 border-2 border-green-400 rounded 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                       placeholder-green-700"
              placeholder="Enter your wallet address"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-green-400 text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 bg-gray-900 text-green-400 border-2 border-green-400 rounded 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                       placeholder-green-700"
              placeholder="Enter password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium 
                     rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Enter Game
          </button>
        </form>

        <p className="mt-4 text-sm text-green-600 text-center">
          New players will be automatically registered
        </p>
      </div>
    </div>
  );
};

export default GameLogin;
