import React, { useState, useEffect } from 'react';
import { realtimeDb } from '../firebase';
import { ref, onValue, set, get } from 'firebase/database';

const EnchantedRealm = () => {
  const [wallet, setWallet] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameState, setGameState] = useState({
    level: 1,
    score: 0,
    inventory: [],
    position: { x: 0, y: 0 },
    health: 100,
    mana: 100,
    lastSaved: null
  });
  const [error, setError] = useState('');

  // Load saved game state when wallet is entered
  useEffect(() => {
    if (isLoggedIn && wallet) {
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      const unsubscribe = onValue(gameStateRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setGameState(data);
        }
      });

      return () => unsubscribe();
    }
  }, [isLoggedIn, wallet]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!wallet) {
      setError('Please enter your wallet address');
      return;
    }

    try {
      // Check if there's a saved game state
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      const snapshot = await get(gameStateRef);
      const savedState = snapshot.val();

      if (savedState) {
        setGameState(savedState);
      } else {
        // Initialize new game state
        const newGameState = {
          level: 1,
          score: 0,
          inventory: [],
          position: { x: 0, y: 0 },
          health: 100,
          mana: 100,
          lastSaved: Date.now()
        };
        await set(gameStateRef, newGameState);
        setGameState(newGameState);
      }

      setIsLoggedIn(true);
      setError('');
    } catch (error) {
      setError('Failed to load game: ' + error.message);
    }
  };

  const saveGameState = async (newState) => {
    try {
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      await set(gameStateRef, {
        ...newState,
        lastSaved: Date.now()
      });
    } catch (error) {
      setError('Failed to save game: ' + error.message);
    }
  };

  // Example game actions
  const movePlayer = (direction) => {
    const newPosition = { ...gameState.position };
    switch (direction) {
      case 'up':
        newPosition.y -= 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
      default:
        break;
    }

    const newGameState = {
      ...gameState,
      position: newPosition
    };
    setGameState(newGameState);
    saveGameState(newGameState);
  };

  const collectItem = (item) => {
    const newGameState = {
      ...gameState,
      inventory: [...gameState.inventory, item],
      score: gameState.score + 10
    };
    setGameState(newGameState);
    saveGameState(newGameState);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-bold text-mine-crystal mb-6 text-center">Enter The Enchanted Realm</h2>
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white mb-4"
            />
            <button
              type="submit"
              className="w-full bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal rounded px-4 py-2 transition-colors"
            >
              Enter Realm
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
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
              onClick={() => movePlayer('up')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded col-start-2"
            >
              ↑
            </button>
            <button
              onClick={() => movePlayer('left')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              ←
            </button>
            <button
              onClick={() => movePlayer('down')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              ↓
            </button>
            <button
              onClick={() => movePlayer('right')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              →
            </button>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-mine-crystal mb-4">Inventory</h3>
          <div className="grid grid-cols-4 gap-4">
            {gameState.inventory.map((item, index) => (
              <div key={index} className="bg-gray-700 p-2 rounded text-center text-white">
                {item}
              </div>
            ))}
          </div>
          {/* Example item collection button */}
          <button
            onClick={() => collectItem('Potion')}
            className="mt-4 bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal px-4 py-2 rounded"
          >
            Collect Potion
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnchantedRealm;
