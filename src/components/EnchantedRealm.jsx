import React, { useState, useEffect, useRef } from 'react';
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
  const [loginStep, setLoginStep] = useState('wallet'); // 'wallet' or 'password'
  const inputRef = useRef(null);

  // Reset login state when component mounts
  useEffect(() => {
    setIsLoggedIn(false);
    setGameState(null);
    setWallet('');
    setPassword('');
    setLoginStep('wallet');
    setError('');
    setMessage('');
    setCommand('');
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loginStep, isLoggedIn]);

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

  const handleLogin = async (inputWallet, inputPassword) => {
    if (!inputWallet || !inputPassword) {
      setError('Please enter both wallet address and password');
      return false;
    }

    try {
      // Check if there's a saved game state
      const gameStateRef = ref(realtimeDb, `gameStates/${inputWallet}`);
      const snapshot = await get(gameStateRef);
      const savedState = snapshot.val();

      if (savedState) {
        // Verify password
        if (savedState.password !== inputPassword) {
          setError('Incorrect password');
          return false;
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
          password: inputPassword
        };
        await set(gameStateRef, newGameState);
        const { password: _, ...gameData } = newGameState;
        setGameState(gameData);
      }

      setWallet(inputWallet);
      setPassword(inputPassword);
      setIsLoggedIn(true);
      setError('');
      setMessage('Game loaded successfully!');
      return true;
    } catch (error) {
      setError('Failed to load game: ' + error.message);
      return false;
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
        const success = await handleLogin(wallet, cmd);
        if (success) {
          setLoginStep('wallet');
        }
        setCommand('');
        return;
      }
    }

    if (cmd.includes('save')) {
      await saveGameState();
    } else {
      // Handle other game commands here
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
              ref={inputRef}
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
          </>
        )}
      </div>
    </div>
  );
};

export default EnchantedRealm;
