import React, { useState, useEffect } from 'react';
import { realtimeDb } from '../firebase';
import { ref, onValue, set, get } from 'firebase/database';

const EnchantedRealm = () => {
  const [wallet, setWallet] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [command, setCommand] = useState('');
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Load saved game state when logged in
  useEffect(() => {
    if (isLoggedIn && wallet) {
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      const unsubscribe = onValue(gameStateRef, (snapshot) => {
        const data = snapshot.val();
        if (data && data.password === password) {
          const { password: _, ...gameData } = data;
          setGameState(gameData);
        }
      });

      return () => unsubscribe();
    }
  }, [isLoggedIn, wallet, password]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!wallet || !password) {
      setError('Please enter both wallet address and password');
      return;
    }

    try {
      // Check if there's a saved game state
      const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
      const snapshot = await get(gameStateRef);
      const savedState = snapshot.val();

      if (savedState) {
        // Verify password
        if (savedState.password !== password) {
          setError('Incorrect password');
          return;
        }
        const { password: _, ...gameData } = savedState;
        setGameState(gameData);
      } else {
        // Initialize new game state
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
        setGameState(gameData);
      }

      setIsLoggedIn(true);
      setError('');
      setMessage('Game loaded successfully!');
    } catch (error) {
      setError('Failed to load game: ' + error.message);
    }
  };

  const saveGameState = async () => {
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
      setError('Failed to save game: ' + error.message);
    }
  };

  const handleCommand = async (e) => {
    e.preventDefault();
    const cmd = command.toLowerCase().trim();
    
    if (cmd === '/save') {
      await saveGameState();
    }
    
    setCommand('');
  };

  // Example game actions
  const movePlayer = (direction) => {
    if (!gameState) return;
    
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

    setGameState({
      ...gameState,
      position: newPosition
    });
  };

  const collectItem = (item) => {
    if (!gameState) return;
    
    setGameState({
      ...gameState,
      inventory: [...gameState.inventory, item],
      score: gameState.score + 10
    });
  };

  if (!isLoggedIn || !gameState) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
          <h2 className="text-2xl font-bold text-mine-crystal mb-6 text-center">Enter The Enchanted Realm</h2>
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              placeholder="Enter your wallet address"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
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
        {message && (
          <div className="bg-green-500/20 text-green-300 p-4 rounded mb-4 text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded mb-4 text-center">
            {error}
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

        {/* Command Input */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <form onSubmit={handleCommand}>
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Type /save to save your game"
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
            />
          </form>
          <div className="text-gray-400 text-sm mt-2">
            Available commands: /save
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
      </div>
    </div>
  );
};

export default EnchantedRealm;
