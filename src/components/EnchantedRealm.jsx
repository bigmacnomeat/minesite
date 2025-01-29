import React, { useState } from 'react';
import { realtimeDb } from '../firebase';
import { ref, set } from 'firebase/database';
import GameLogin from './GameLogin';

const EnchantedRealm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wallet, setWallet] = useState('');
  const [password, setPassword] = useState('');
  const [gameState, setGameState] = useState(null);
  const [message, setMessage] = useState('');

  const handleLogin = (walletAddr, pwd, initialGameState) => {
    setWallet(walletAddr);
    setPassword(pwd);
    setGameState(initialGameState);
    setIsLoggedIn(true);
  };

  const handleSave = async () => {
    try {
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      await set(gameStateRef, {
        ...gameState,
        password,
        lastSaved: Date.now()
      });
      setMessage('Game saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to save game: ' + error.message);
    }
  };

  if (!isLoggedIn) {
    return <GameLogin onLogin={handleLogin} />;
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        {message && (
          <div className="bg-green-500/20 text-green-300 p-4 rounded mb-4 text-center">
            {message}
          </div>
        )}

        {/* Game Stats */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-mine-crystal">Level</div>
              <div className="text-2xl text-white">{gameState.level}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-mine-crystal">Score</div>
              <div className="text-2xl text-white">{gameState.score}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-mine-crystal">Health</div>
              <div className="text-2xl text-green-400">{gameState.health}</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-mine-crystal">Mana</div>
              <div className="text-2xl text-blue-400">{gameState.mana}</div>
            </div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
            <button
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  position: { ...prev.position, y: prev.position.y - 1 }
                }));
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded col-start-2"
            >
              ↑
            </button>
            <button
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  position: { ...prev.position, x: prev.position.x - 1 }
                }));
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              ←
            </button>
            <button
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  position: { ...prev.position, y: prev.position.y + 1 }
                }));
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              ↓
            </button>
            <button
              onClick={() => {
                setGameState(prev => ({
                  ...prev,
                  position: { ...prev.position, x: prev.position.x + 1 }
                }));
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              →
            </button>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-mine-crystal">Inventory</h3>
            <button
              onClick={handleSave}
              className="bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal px-4 py-2 rounded"
            >
              Save Game
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {gameState.inventory.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-center text-white">
                {item}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setGameState(prev => ({
                ...prev,
                inventory: [...prev.inventory, 'Potion'],
                score: prev.score + 10
              }));
            }}
            className="mt-4 bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal px-4 py-2 rounded"
          >
            Collect Potion
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnchantedRealm;
