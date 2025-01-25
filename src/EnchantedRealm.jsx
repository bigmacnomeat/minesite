import React, { useState, useEffect, useRef } from 'react';
import './DuelGame.css';
import DuelModeSelect from './DuelModeSelect';
import DuelPvP from './DuelPvP';
import { ref, get, set } from 'firebase/database';

const DuelGame = ({ wallet, connection, onClose, database }) => {
    // State variables at the top of the component
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
    const [inventory, setInventory] = useState([]);
    const [storyText, setStoryText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [gameMode, setGameMode] = useState(null);
    const [showModeSelect, setShowModeSelect] = useState(true);
    const [movesRemaining, setMovesRemaining] = useState(6);
    const [lastResetTime, setLastResetTime] = useState(null);
    const [activeEvent, setActiveEvent] = useState(null);
    const [reputation, setReputation] = useState(0);
    const [statusEffects, setStatusEffects] = useState([]);
    const [companions, setCompanions] = useState([]);
    const [questLog, setQuestLog] = useState([]);
    const MOVES_PER_DAY = 6;
    const MS_PER_DAY = 24 * 60 * 60 * 1000;
    const commandInputRef = useRef(null);
    const commandHistoryRef = useRef(null);

    // Game constants and configurations
    const ENEMIES = {
        WATER_ELEMENTAL: {
            name: 'Water Elemental',
            description: 'A fluid being of pure liquid crypto',
            hp: 40,
            attack: 15,
            weakness: 'earth',
            resistance: 'fire',
            difficulty: 'easy'
        },
        FIRE_SPIRIT: {
            name: 'Fire Spirit',
            description: 'A blazing entity of pure flame',
            hp: 38,
            attack: 16,
            weakness: 'water',
            resistance: 'fire',
            difficulty: 'easy'
        },
        EARTH_GOLEM: {
            name: 'Earth Golem',
            description: 'A massive creature formed from crystallized tokens',
            hp: 50,
            attack: 14,
            weakness: 'fire',
            resistance: 'earth',
            difficulty: 'medium'
        },
        CRYPTO_TROLL: {
            name: 'Crypto Troll',
            description: 'A mischievous creature spreading FUD',
            hp: 35,
            attack: 12,
            weakness: 'fire',
            resistance: 'water',
            difficulty: 'easy'
        },
        DATA_WRAITH: {
            name: 'Data Wraith',
            description: 'A spectral being composed of lost transactions',
            hp: 45,
            attack: 18,
            weakness: 'earth',
            resistance: 'fire',
            difficulty: 'medium'
        },
        ROGUE_KOL: {
            name: 'Rogue KoL',
            description: 'A fallen knight who lost everything to a rug pull',
            hp: 42,
            attack: 16,
            weakness: 'water',
            resistance: 'earth',
            difficulty: 'hard'
        }
    };

    const ARMOR_STATS = {
        'Rusty Chain Mail': { defense: 5, description: 'A basic armor that has seen better days' },
        'Leather Boots': { defense: 3, description: 'Light boots for quick movement' },
        'Copper Helmet': { defense: 4, description: 'Basic head protection' },
        'Iron Gauntlets': { defense: 4, description: 'Sturdy hand protection' },
        'Steel Plate': { defense: 8, description: 'Heavy but reliable chest protection' },
        'Mithril Shield': { defense: 10, description: 'A rare shield with exceptional defense' },
        'Rare NFT Chest Plate': { defense: 15, description: 'Digital protection at its finest' },
        'Legendary Boots': { defense: 13, description: 'Speed and protection combined' },
        'Epic Helmet': { defense: 14, description: 'Superior head protection' },
        'Meme Lord Plate': { defense: 20, description: 'The ultimate chest protection' },
        'Doge Boots': { defense: 18, description: 'Much protect, very speed' },
        'Pepe Crown': { defense: 25, description: 'The rarest of all armor pieces' },
        'Ghost Kids Tribal Helmet': {
            defense: 15,
            description: 'A mystical helmet enchanted with the spirits of ancient Ghost Kids warriors.',
            type: 'head',
            rarity: 'legendary'
        },
    };

    const ZONES = {
        SOLANARA_PLAINS: {
            name: 'Solanara Plains',
            description: 'The entrance to the digital realm, where crypto spirits roam freely.',
            enemies: [
                { 
                    name: 'Crypto Troll', 
                    description: 'A mischievous creature spreading FUD', 
                    hp: 35, 
                    attack: 12, 
                    weakness: 'fire', 
                    resistance: 'water',
                    difficulty: 'easy',
                    encounterMessage: '🧟 A Crypto Troll emerges from the shadows!' 
                },
                { 
                    name: 'Data Wraith', 
                    description: 'A spectral being composed of lost transactions', 
                    hp: 45, 
                    attack: 18, 
                    weakness: 'earth', 
                    resistance: 'fire',
                    difficulty: 'medium',
                    encounterMessage: '👻 A Data Wraith materializes before you!' 
                },
                { 
                    name: 'Water Elemental', 
                    description: 'A fluid being of pure liquid crypto', 
                    hp: 40, 
                    attack: 15, 
                    weakness: 'earth', 
                    resistance: 'fire',
                    difficulty: 'easy',
                    encounterMessage: '💧 A Water Elemental forms from the mist!' 
                }
            ],
            boss: {
                name: 'Genesis Guardian',
                description: 'The mighty protector of the Solanara Plains',
                hp: 100,
                attack: 25,
                weakness: 'fire',
                resistance: 'water',
                rewards: ['Genesis Armor']
            },
            minLevel: 1,
            nextZone: 'ETHEREAL_MOUNTAINS'
        },
        ETHEREAL_MOUNTAINS: {
            name: 'Ethereal Mountains',
            description: 'Towering peaks where smart contracts are forged.',
            enemies: [
                { 
                    name: 'Contract Phantom', 
                    description: 'A ghostly enforcer of broken promises', 
                    hp: 60, 
                    attack: 22, 
                    weakness: 'water', 
                    resistance: 'fire',
                    difficulty: 'medium',
                    encounterMessage: '👻 A Contract Phantom appears!' 
                },
                { 
                    name: 'Gas Giant', 
                    description: 'An enormous creature that feeds on transaction fees', 
                    hp: 70, 
                    attack: 25, 
                    weakness: 'fire', 
                    resistance: 'earth',
                    difficulty: 'hard',
                    encounterMessage: '🌌 A Gas Giant emerges!' 
                },
                { 
                    name: 'Mountain Oracle', 
                    description: 'A mysterious being that predicts price movements', 
                    hp: 65, 
                    attack: 28, 
                    weakness: 'earth', 
                    resistance: 'fire',
                    difficulty: 'medium',
                    encounterMessage: '🔮 A Mountain Oracle appears!' 
                }
            ],
            boss: {
                name: 'Smart Chain Titan',
                description: 'Master of automated warfare',
                hp: 150,
                attack: 35,
                weakness: 'water',
                resistance: 'fire',
                rewards: ['Titan\'s Gauntlets']
            },
            minLevel: 5,
            nextZone: 'BINANCIA_DESERT'
        },
        BINANCIA_DESERT: {
            name: 'Binancia Desert',
            description: 'An endless expanse of golden digital sand.',
            enemies: [
                { 
                    name: 'Sand Trader', 
                    description: 'A cunning desert dweller who fights with ancient coins', 
                    hp: 85, 
                    attack: 32, 
                    weakness: 'water', 
                    resistance: 'fire',
                    difficulty: 'hard',
                    encounterMessage: '🏜️ A Sand Trader emerges!' 
                },
                { 
                    name: 'Token Scorpion', 
                    description: 'A deadly creature that stings with volatile assets', 
                    hp: 90, 
                    attack: 35, 
                    weakness: 'fire', 
                    resistance: 'earth',
                    difficulty: 'hard',
                    encounterMessage: '🦂 A Token Scorpion appears!' 
                },
                { 
                    name: 'Desert Whale', 
                    description: 'A massive being that manipulates the market', 
                    hp: 95, 
                    attack: 38, 
                    weakness: 'earth', 
                    resistance: 'fire',
                    difficulty: 'hard',
                    encounterMessage: '🐳 A Desert Whale emerges!' 
                }
            ],
            boss: {
                name: 'Exchange Overlord',
                description: 'Supreme ruler of the trading wastes',
                hp: 200,
                attack: 45,
                weakness: 'fire',
                resistance: 'earth',
                rewards: ['Overlord\'s Crown']
            },
            minLevel: 10,
            nextZone: null
        },
        ENCHANTED_REALM: {
            name: 'Enchanted Realm',
            description: 'A mystical land of wonder and magic.',
            enemies: [
                { 
                    name: 'Unicorn', 
                    description: 'A majestic creature with a horn of pure magic', 
                    hp: 80, 
                    attack: 30, 
                    weakness: 'dark', 
                    resistance: 'light',
                    difficulty: 'medium',
                    encounterMessage: '🦄 A Unicorn appears!' 
                },
                { 
                    name: 'Mermaid', 
                    description: 'A alluring creature that lures with enchanting songs', 
                    hp: 75, 
                    attack: 28, 
                    weakness: 'fire', 
                    resistance: 'water',
                    difficulty: 'medium',
                    encounterMessage: '🧜‍♀️ A Mermaid emerges!' 
                },
                { 
                    name: 'Phoenix', 
                    description: 'A fiery bird that rises from the ashes', 
                    hp: 90, 
                    attack: 35, 
                    weakness: 'water', 
                    resistance: 'fire',
                    difficulty: 'hard',
                    encounterMessage: '🐦 A Phoenix rises!' 
                }
            ],
            boss: {
                name: 'Enchanted Queen',
                description: 'The ruler of the Enchanted Realm',
                hp: 250,
                attack: 50,
                weakness: 'dark',
                resistance: 'light',
                rewards: ['Enchanted Crown']
            },
            minLevel: 15,
            nextZone: null
        }
    };

    const ACHIEVEMENTS = {
        FIRST_VICTORY: {
            id: 'first_victory',
            name: 'First Victory',
            description: 'Win your first battle',
            emoji: '⚔️'
        },
        SALITEN_MET: {
            id: 'saliten_met',
            name: 'Mysterious Encounter',
            description: 'Meet the mysterious Saliten',
            emoji: '⭐'
        },
        LEVEL_5: {
            id: 'level_5',
            name: 'Rising Star',
            description: 'Reach level 5',
            emoji: '🌟'
        },
        FULL_ARMOR: {
            id: 'full_armor',
            name: 'Well Protected',
            description: 'Collect a complete set of armor',
            emoji: '🛡️'
        },
        EXPLORER: {
            id: 'explorer',
            name: 'Explorer',
            description: 'Complete 10 runs',
            emoji: '🗺️'
        }
    };

    // ... (rest of the code remains unchanged)

export default DuelGame;
