import React, { useState, useEffect, useRef } from 'react';
import './DuelGame.css';
import DuelModeSelect from './DuelModeSelect.jsx'; 
import DuelPvP from './DuelPvP.jsx'; 
import { ref, get, set } from 'firebase/database';

const DuelGame = ({ wallet, connection, onClose, database }) => {
    const [playerHealth, setPlayerHealth] = useState(100);
    const [playerXP, setPlayerXP] = useState(0);
    const [playerLevel, setPlayerLevel] = useState(1);
    const [playerHouse, setPlayerHouse] = useState('');
    const [armorItems, setArmorItems] = useState([]);
    const [playerArmor, setPlayerArmor] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [inBattle, setInBattle] = useState(false);
    const [currentEnemy, setCurrentEnemy] = useState(null);
    const [enemyHealth, setEnemyHealth] = useState(0);
    const [currentZone, setCurrentZone] = useState('SOLANARA_PLAINS');
    const [checkpointZone, setCheckpointZone] = useState('SOLANARA_PLAINS');
    const [isBossBattle, setIsBossBattle] = useState(false);
    const [currentBoss, setCurrentBoss] = useState(null);
    const [salitenMet, setSalitenMet] = useState(false);
    const [salitenAvailable, setSalitenAvailable] = useState(false);
    const [runProgress, setRunProgress] = useState(0);
    const [runCount, setRunCount] = useState(0);
    const [lastRunTime, setLastRunTime] = useState(null);
    const [commandHistory, setCommandHistory] = useState([]);
    const [hasDefeatedFirstEnemy, setHasDefeatedFirstEnemy] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [achievements, setAchievements] = useState([]);
    const [obtainedItems, setObtainedItems] = useState(new Set());
    const [playerName, setPlayerName] = useState('');
    const [characterCreationStep, setCharacterCreationStep] = useState(null);
    const [gameState, setGameState] = useState('intro');
    const [playerWeapon, setPlayerWeapon] = useState(null);

    // Game constants and configurations
    const ENEMIES = {
        WATER_ELEMENTAL: { name: 'Water Elemental', description: 'A fluid being of pure liquid crypto', hp: 40, attack: 15, weakness: 'earth', resistance: 'fire', difficulty: 'easy' },
        FIRE_SPIRIT: { name: 'Fire Spirit', description: 'A blazing entity of pure flame', hp: 38, attack: 16, weakness: 'water', resistance: 'fire', difficulty: 'easy' },
        EARTH_GOLEM: { name: 'Earth Golem', description: 'A massive creature formed from crystallized tokens', hp: 50, attack: 14, weakness: 'fire', resistance: 'earth', difficulty: 'medium' },
        CRYPTO_TROLL: { name: 'Crypto Troll', description: 'A mischievous creature spreading FUD', hp: 35, attack: 12, weakness: 'fire', resistance: 'water', difficulty: 'easy' },
        DATA_WRAITH: { name: 'Data Wraith', description: 'A spectral being composed of lost transactions', hp: 45, attack: 18, weakness: 'earth', resistance: 'fire', difficulty: 'medium' },
    };

    const handleEnemyAttack = () => {
        const enemyAttack = ENEMIES[currentEnemy].attack;
        setPlayerHealth(playerHealth - enemyAttack);
    };

    const handlePlayerAttack = () => {
        const playerAttack = playerLevel * 10;
        setEnemyHealth(enemyHealth - playerAttack);
    };

    const handlePlayerRun = () => {
        setIsRunning(true);
        setRunProgress(runProgress + 10);
    };

    const handlePlayerStop = () => {
        setIsRunning(false);
    };

    const handleEnemyDefeated = () => {
        setHasDefeatedFirstEnemy(true);
        setPlayerXP(playerXP + 100);
        setPlayerLevel(playerLevel + 1);
    };

    const handleGameStart = () => {
        setGameStarted(true);
        setGameState('game');
    };

    const handleGameEnd = () => {
        setGameStarted(false);
        setGameState('intro');
    };

    useEffect(() => {
        if (playerHealth <= 0) {
            handleGameEnd();
        }
    }, [playerHealth]);

    useEffect(() => {
        if (enemyHealth <= 0) {
            handleEnemyDefeated();
        }
    }, [enemyHealth]);

    useEffect(() => {
        if (runProgress >= 100) {
            handlePlayerStop();
        }
    }, [runProgress]);

    return (
        <div>
            <h1>Duel Game</h1>
            {gameState === 'intro' && (
                <button onClick={handleGameStart}>Start Game</button>
            )}
            {gameState === 'game' && (
                <div>
                    <p>Player Health: {playerHealth}</p>
                    <p>Player XP: {playerXP}</p>
                    <p>Player Level: {playerLevel}</p>
                    <button onClick={handlePlayerAttack}>Attack</button>
                    <button onClick={handlePlayerRun}>Run</button>
                    {isRunning && (
                        <p>Run Progress: {runProgress}%</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default DuelGame;
