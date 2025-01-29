import React, { useState } from 'react';
import { realtimeDb } from '../firebase';
import { ref, set, get } from 'firebase/database';

const GameLogin = ({ onLogin }) => {
  const [wallet, setWallet] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!wallet || !password) {
      setError('Please enter both wallet address and password');
      return;
    }

    try {
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      const snapshot = await get(gameStateRef);
      const savedState = snapshot.val();

      if (savedState) {
        if (savedState.password !== password) {
          setError('Incorrect password');
          return;
        }
        const { password: _, ...gameData } = savedState;
        onLogin(wallet, password, gameData);
      } else {
        const newGameState = {
          level: 1,
          score: 0,
          inventory: [],
          position: { x: 0, y: 0 },
          health: 100,
          mana: 100,
          lastSaved: Date.now(),
          password
        };
        await set(gameStateRef, newGameState);
        const { password: _, ...gameData } = newGameState;
        onLogin(wallet, password, gameData);
      }
    } catch (error) {
      setError('Failed to load game: ' + error.message);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96 mx-auto">
      <h2 className="text-2xl font-bold text-mine-crystal mb-6 text-center">Enter The Enchanted Realm</h2>
      {error && (
        <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-mine-crystal mb-2">Wallet Address</label>
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="Enter your wallet address"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
          />
        </div>
        <div>
          <label className="block text-mine-crystal mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full bg-gray-700 rounded px-4 py-2 text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal rounded px-4 py-2 transition-colors"
        >
          Enter Realm
        </button>
      </form>
    </div>
  );
};

export default GameLogin;
