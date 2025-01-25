import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AlphaCalls = () => {
  const [calls, setCalls] = useState([]);
  const [newCall, setNewCall] = useState({
    description: '',
    wallet: '',
    tokenMint: '',
    currentPrice: '',
    targetPrice: '',
    timeframe: '24h'
  });

  // Load calls from localStorage
  useEffect(() => {
    const savedCalls = localStorage.getItem('alphaCalls');
    if (savedCalls) {
      setCalls(JSON.parse(savedCalls));
    }
  }, []);

  // Save calls to localStorage
  useEffect(() => {
    localStorage.setItem('alphaCalls', JSON.stringify(calls));
  }, [calls]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const call = {
      id: Date.now(),
      tokenMint: newCall.tokenMint,
      description: newCall.description,
      wallet: newCall.wallet,
      currentPrice: parseFloat(newCall.currentPrice),
      targetPrice: parseFloat(newCall.targetPrice),
      timeframe: newCall.timeframe,
      expiryDate: new Date(Date.now() + getTimeframeMs(newCall.timeframe)),
      status: 'pending',
      upvotes: 0,
      downvotes: 0
    };
    
    setCalls(prevCalls => [...prevCalls, call]);
    setNewCall({
      description: '',
      wallet: '',
      tokenMint: '',
      currentPrice: '',
      targetPrice: '',
      timeframe: '24h'
    });
  };

  const handleVote = (id, voteType) => {
    setCalls(calls.map(call => {
      if (call.id === id) {
        if (voteType === 'up') {
          return { ...call, upvotes: call.upvotes + 1 };
        } else {
          const newDownvotes = call.downvotes + 1;
          if (newDownvotes >= 3) {
            return null; // Remove call
          }
          return { ...call, downvotes: newDownvotes };
        }
      }
      return call;
    }).filter(Boolean));
  };

  const getTimeframeMs = (timeframe) => {
    const times = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    };
    return times[timeframe] || times['24h'];
  };

  const formatTimeLeft = (expiryDate) => {
    const now = new Date();
    const timeLeft = new Date(expiryDate) - now;
    
    if (timeLeft <= 0) return 'Expired';
    
    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => alert('Copied to clipboard!'))
      .catch(err => console.error('Failed to copy:', err));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold text-white mb-8">Alpha Calls</h2>
        
        {/* Submit new call */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your wallet address"
              value={newCall.wallet}
              onChange={(e) => setNewCall({ ...newCall, wallet: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="text"
              placeholder="Token Mint Address"
              value={newCall.tokenMint}
              onChange={(e) => setNewCall({ ...newCall, tokenMint: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Current Price (USDC)"
              value={newCall.currentPrice}
              onChange={(e) => setNewCall({ ...newCall, currentPrice: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
            <input
              type="number"
              step="0.000001"
              placeholder="Target Price (USDC)"
              value={newCall.targetPrice}
              onChange={(e) => setNewCall({ ...newCall, targetPrice: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
              required
            />
            <select
              value={newCall.timeframe}
              onChange={(e) => setNewCall({ ...newCall, timeframe: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded"
            >
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
            <textarea
              placeholder="Analysis and reasoning..."
              value={newCall.description}
              onChange={(e) => setNewCall({ ...newCall, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded h-24"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Submit Call
            </button>
          </div>
        </form>

        {/* List of calls */}
        <div className="space-y-6">
          {calls.map(call => (
            <motion.div
              key={call.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl text-white font-bold">Token:</h3>
                    <span 
                      className="text-xl text-white font-bold cursor-pointer hover:text-blue-400" 
                      onClick={() => handleCopyToClipboard(call.tokenMint)}
                    >
                      {call.tokenMint.slice(0, 4)}...{call.tokenMint.slice(-4)} 📋
                    </span>
                  </div>
                  <p className="text-white">{call.description}</p>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mt-2">
                    <span>Wallet:</span>
                    <span className="cursor-pointer hover:text-white" onClick={() => handleCopyToClipboard(call.wallet)}>
                      {call.wallet.slice(0, 6)}...{call.wallet.slice(-4)} 📋
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    call.status === 'successful' ? 'bg-green-500' :
                    call.status === 'failed' ? 'bg-red-500' :
                    'bg-yellow-500'
                  } text-white`}>
                    {call.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Entry Price</p>
                  <p className="text-white">${call.currentPrice.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Target Price</p>
                  <p className="text-white">${call.targetPrice.toFixed(6)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Time Left</p>
                  <p className="text-white">{formatTimeLeft(call.expiryDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Status</p>
                  <p className={`text-sm ${
                    call.status === 'pending' ? 'text-yellow-500' :
                    call.status === 'successful' ? 'text-green-500' :
                    'text-red-500'
                  }`}>
                    {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleVote(call.id, 'up')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-green-500"
                  >
                    <span>👍 {call.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(call.id, 'down')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-500"
                  >
                    <span>👎 {call.downvotes}</span>
                  </button>
                </div>
                <button
                  onClick={() => alert('Tipping feature coming soon!')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded transition duration-300"
                >
                  Tip $MINE
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlphaCalls;
