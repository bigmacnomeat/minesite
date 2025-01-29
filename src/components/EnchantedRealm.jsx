import React, { useState } from 'react';
import { realtimeDb } from '../firebase';
import { ref, set, get } from 'firebase/database';

const EnchantedRealm = () => {
  const [wallet, setWallet] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [command, setCommand] = useState('');
  const [gameState, setGameState] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginStep, setLoginStep] = useState('wallet');

  const handleCommand = async (e) => {
    e.preventDefault();
    const cmd = command.toLowerCase().trim();

    if (!isLoggedIn) {
      if (loginStep === 'wallet') {
        if (!cmd) {
          setError('Please enter your wallet address');
          return;
        }
        setWallet(cmd);
        setLoginStep('password');
        setCommand('');
        setError('');
        return;
      } else if (loginStep === 'password') {
        if (!cmd) {
          setError('Please enter your password');
          return;
        }

        try {
          const gameStateRef = ref(realtimeDb, `gameStates/${wallet}`);
          const snapshot = await get(gameStateRef);
          const savedState = snapshot.val();

          if (savedState) {
            if (savedState.password !== cmd) {
              setError('Incorrect password');
              return;
            }
            const { password: _, ...gameData } = savedState;
            setGameState(gameData);
          } else {
            const newGameState = {
              level: 1,
              score: 0,
              inventory: [],
              position: { x: 0, y: 0 },
              health: 100,
              mana: 100,
              lastSaved: Date.now(),
              password: cmd
            };
            await set(gameStateRef, newGameState);
            const { password: _, ...gameData } = newGameState;
            setGameState(gameData);
          }

          setPassword(cmd);
          setIsLoggedIn(true);
          setError('');
          setMessage('Game loaded successfully!');
          setCommand('');
        } catch (error) {
          setError('Failed to load game: ' + error.message);
        }
        return;
      }
    }

    // Handle game commands
    if (cmd.includes('save')) {
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
    }
    
    setCommand('');
  };

  const getPrompt = () => {
    if (!isLoggedIn) {
      if (loginStep === 'wallet') {
        return '> Enter your wallet address:';
      }
      return '> Enter your password:';
    }
    return '> Enter command (type "save" at any time to save your game):';
  };

  return (
    <div className="py-8">
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

        {/* Command Input */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <form onSubmit={handleCommand}>
            <div className="font-mono text-mine-crystal mb-2">{getPrompt()}</div>
            <input
              type={loginStep === 'password' && !isLoggedIn ? 'password' : 'text'}
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white font-mono"
              autoFocus
            />
          </form>
        </div>

        {isLoggedIn && gameState && (
          <>
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
              <h3 className="text-xl font-bold text-mine-crystal mb-4">Inventory</h3>
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
          </>
        )}
      </div>
    </div>
  );
};

export default EnchantedRealm;
