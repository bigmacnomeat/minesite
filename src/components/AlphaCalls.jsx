@@ -1,271 +1 @@
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue, push, update } from 'firebase/database';

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
  const [error, setError] = useState('');
  // Load and listen to calls from Firebase
  useEffect(() => {
    const callsRef = ref(db, 'alphaCalls');
    
    // Set up real-time listener
    const unsubscribe = onValue(callsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array, filter out calls with 3+ downvotes, and sort by timestamp
        const callsArray = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value
          }))
          .filter(call => !call.hidden && call.downvotes < 3) // Hide calls with 3 or more downvotes
          .sort((a, b) => b.timestamp - a.timestamp);
        setCalls(callsArray);
      } else {
        setCalls([]);
      }
    });
    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const call = {
        tokenMint: newCall.tokenMint,
        description: newCall.description,
        wallet: newCall.wallet,
        currentPrice: parseFloat(newCall.currentPrice),
        targetPrice: parseFloat(newCall.targetPrice),
        timeframe: newCall.timeframe,
        expiryDate: new Date(Date.now() + getTimeframeMs(newCall.timeframe)).toISOString(),
        status: 'pending',
        upvotes: 0,
        downvotes: 0,
        timestamp: Date.now(),
        hidden: false
      };
      
      // Add to Firebase
      const callsRef = ref(db, 'alphaCalls');
      await push(callsRef, call);
      
      // Reset form
      setNewCall({
        description: '',
        wallet: '',
        tokenMint: '',
        currentPrice: '',
        targetPrice: '',
        timeframe: '24h'
      });
      setError('');
    } catch (error) {
      setError('Failed to submit call: ' + error.message);
    }
  };
  const handleVote = async (callId, voteType) => {
    try {
      const callRef = ref(db, `alphaCalls/${callId}`);
      const call = calls.find(c => c.id === callId);
      if (call) {
        const updates = {
          [voteType]: call[voteType] + 1
        };
        
        // If downvotes reach 3, update hidden status but keep in database
        if (voteType === 'downvotes' && call.downvotes + 1 >= 3) {
          updates.hidden = true;
        }
        
        await update(callRef, updates);
      }
    } catch (error) {
      setError('Failed to vote: ' + error.message);
    }
  };
  const getTimeframeMs = (timeframe) => {
    const hours = {
      '24h': 24,
      '48h': 48,
      '72h': 72
    };
    return hours[timeframe] * 60 * 60 * 1000;
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      <div className="bg-gray-800 rounded-xl p-6">
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
              <option value="48h">48 Hours</option>
              <option value="72h">72 Hours</option>
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
          {calls.map((call) => (
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
                      onClick={() => navigator.clipboard.writeText(call.tokenMint).then(() => alert('Copied to clipboard!')).catch(err => console.error('Failed to copy:', err))}
                    >
                      {call.tokenMint.slice(0, 4)}...{call.tokenMint.slice(-4)} 
                    </span>
                  </div>
                  <p className="text-white">{call.description}</p>
                  <div className="flex items-center space-x-2 text-gray-400 text-sm mt-2">
                    <span>Wallet:</span>
                    <span className="cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(call.wallet).then(() => alert('Copied to clipboard!')).catch(err => console.error('Failed to copy:', err))}>
                      {call.wallet.slice(0, 6)}...{call.wallet.slice(-4)} 
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
                  <p className="text-white">{new Date(call.expiryDate) - new Date() <= 0 ? 'Expired' : Math.floor((new Date(call.expiryDate) - new Date()) / (1000 * 60 * 60)) + 'h ' + Math.floor(((new Date(call.expiryDate) - new Date()) % (1000 * 60 * 60)) / (1000 * 60)) + 'm'}</p>
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
                    onClick={() => handleVote(call.id, 'upvotes')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-green-500"
                  >
                    <span> {call.upvotes}</span>
                  </button>
                  <button
                    onClick={() => handleVote(call.id, 'downvotes')}
                    className="flex items-center space-x-1 text-gray-300 hover:text-red-500"
                  >
                    <span> {call.downvotes}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default AlphaCalls;
