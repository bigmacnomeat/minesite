import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import LotterySystem from './components/LotterySystem';
import EnchantedRealm from './components/EnchantedRealm';
import AlphaCalls from './components/AlphaCalls';
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [playerHP, setPlayerHP] = useState(100);
  const [maxPlayerHP, setMaxPlayerHP] = useState(100);
  const [playerGold, setPlayerGold] = useState(0);
  const [explorationProgress, setExplorationProgress] = useState(0);
  const [currentDistrictIndex, setCurrentDistrictIndex] = useState(0);
  const [inventory, setInventory] = useState([]);
  const [gameState, setGameState] = useState('start'); // start, name, house, playing
  const [playerName, setPlayerName] = useState('');
  const [playerHouse, setPlayerHouse] = useState('');
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [currentNPC, setCurrentNPC] = useState(null);
  const [inCombat, setInCombat] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const navigate = useNavigate();

  // Add base stats and stat tracking
  const [baseStats, setBaseStats] = useState({
    maxHp: 100,
    damage: 10
  });

  const [bonusStats, setBonusStats] = useState({
    maxHp: 0,
    damage: 0
  });

  // Calculate total stats
  const totalStats = {
    maxHp: baseStats.maxHp + bonusStats.maxHp,
    damage: baseStats.damage + bonusStats.damage
  };

  const [stakingDropdown, setStakingDropdown] = useState(false);
  const stakingDropdownRef = useRef(null);

  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);
  const buyDropdownRef = useRef(null);

  const buyOptions = [
    {
      name: "Buy $MINE Token",
      url: "https://jup.ag/swap/USDC-GaHu73uhhWrcGLF3CWUi26ZBzv5mZAy8PLrvzoM5XMZh"
    },
    {
      name: "Buy NFT",
      url: "https://magiceden.io/marketplace/enchanted_miner"
    }
  ];

  const stakingOptions = [
    { name: 'Stake', href: 'https://staking.mine-token.com', isExternal: true },
    { name: 'NFT Staking', href: 'https://www.nftstake.app/enchantedminers', isExternal: true },
    { name: 'Token Staking', onClick: () => alert('Token Staking coming soon!') }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buyDropdownRef.current && !buyDropdownRef.current.contains(event.target)) {
        setBuyDropdownOpen(false);
      }
      if (stakingDropdownRef.current && !stakingDropdownRef.current.contains(event.target)) {
        setStakingDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { name: 'About', href: '#about' },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Vote', href: '#voting' },
    { name: 'Lottery', href: '#lottery' },
    { 
      name: 'Staking',
      isDropdown: true,
      dropdownItems: stakingOptions
    },
    { 
      name: 'Buy Now',
      isDropdown: true,
      dropdownItems: buyOptions
    },
    { name: 'Alpha Calls', href: '#alpha-calls' },
    { name: 'Casino', onClick: () => alert('Casino coming in Phase 2!') },
    { name: 'Enchanted Realm', onClick: () => setShowEnchantedRealm(true) }
  ];

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { 
      name: 'Staking',
      isDropdown: true,
      dropdownItems: stakingOptions
    },
    { name: 'Trait Store', href: 'https://www.traitstore.app', isExternal: true },
    { name: 'Tokenomics', href: '#tokenomics' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Ecosystem', href: '#ecosystem' },
    { name: 'Voting', href: '#voting' },
    { name: 'Lottery', href: '#lottery' },
    { 
      name: 'Buy Now',
      isDropdown: true,
      dropdownItems: buyOptions
    },
    { name: 'Alpha Calls', href: '#alpha-calls' },
    { name: 'Enchanted Realm', onClick: () => setShowEnchantedRealm(true) }
  ];

  const ecosystemProjects = [
    {
      name: 'Frens Factory',
      description: 'Premier raffle platform accepting $MINE tokens for exclusive NFT raffles. Join the mining community and win rare digital treasures.',
      logo: '🎲',
      link: '#',
      partnerType: 'raffle'
    },
    {
      name: 'Stoned Ape',
      description: 'Join Stoned Ape Crew missions using $MINE. Explore the cosmos and earn incredible rewards.',
      logo: '🚀',
      link: 'https://www.stonedapecrew.com/space-missions',
      partnerType: 'missions'
    },
    {
      name: 'Mutants',
      description: 'Enter exclusive raffles powered by $MINE tokens. Every raffle is a chance to expand your mining empire.',
      logo: '🧬',
      link: '#',
      partnerType: 'raffle'
    },
    {
      name: 'Sol Sniper',
      description: 'Snipe the best deals in the secondary market using $MINE. Perfect for miners looking to expand their collections.',
      logo: '🎯',
      link: '#',
      partnerType: 'marketplace'
    }
  ];

  const districtNames = [
    "Enchanted District",
    "District Basc",
    "District Puffsterz"
  ];

  // District-specific NPCs
  const districtNPCs = {
    "Enchanted District": {
        Saliten: {
            speech: "The blockchain awaits, young warrior! Watch for the Miner King.",
            item: "Golden Helmet",
            effect: "+100 HP",
            stats: { maxHp: 100, damage: 0 }
        },
        Cory: {
            speech: "Need some mining equipment? I've got just what you need!",
            item: "Diamond Pickaxe",
            effect: "+25 Attack Power",
            stats: { maxHp: 0, damage: 25 }
        },
        "Big Mac": {
            speech: "Hungry for victory? Take this special potion!",
            item: "Power Burger",
            effect: "+50 Max HP",
            stats: { maxHp: 50, damage: 0 }
        },
        Andy: {
            speech: "The ancient algorithms hold many secrets...",
            item: "Quantum Processor",
            effect: "+30 Mining Speed",
            stats: { maxHp: 0, damage: 30 }
        },
        Mike: {
            speech: "Watch out for the Miner King up ahead—he's a tough one.",
            item: "Health Potion",
            effect: "+50 HP",
            stats: { maxHp: 50, damage: 0 }
        },
        Kush: {
            speech: "The hash rate is strong with you, young miner.",
            item: "Hash Crystal",
            effect: "+40 Energy",
            stats: { maxHp: 40, damage: 40 }
        },
        "Jr Chicken": {
            speech: "Even small miners can become legends!",
            item: "Lucky Feather",
            effect: "+15% Critical Chance",
            stats: { maxHp: 0, damage: 15 }
        },
        Zombe: {
            speech: "The undead know secrets of eternal blockchain life...",
            item: "Necromancer's Shard",
            effect: "+45 Dark Power",
            stats: { maxHp: 45, damage: 45 }
        },
        Research: {
            speech: "Knowledge is power in the crypto realm!",
            item: "Ancient Whitepaper",
            effect: "+50 Intelligence",
            stats: { maxHp: 50, damage: 50 }
        }
    },
    "Basic District": {
        Dax: {
            speech: "Welcome to the Basic District, where legends begin!",
            item: "Basic Blade",
            effect: "+20 Attack",
            stats: { maxHp: 0, damage: 20 }
        },
        DJ: {
            speech: "The rhythm of the blockchain guides us all.",
            item: "Sound Crystal",
            effect: "+25 Defense",
            stats: { maxHp: 25, damage: 0 }
        },
        "Captain Doc": {
            speech: "Set sail on the sea of possibilities!",
            item: "Captain's Compass",
            effect: "Reveals Treasure",
            stats: { maxHp: 0, damage: 0 }
        },
        Rig: {
            speech: "A proper mining rig is key to success.",
            item: "Overclocked GPU",
            effect: "+35 Mining Power",
            stats: { maxHp: 0, damage: 35 }
        },
        EJC: {
            speech: "The code speaks to those who listen.",
            item: "Debug Toolkit",
            effect: "Auto-repair gear",
            stats: { maxHp: 0, damage: 0 }
        },
        Tom: {
            speech: "Basic doesn't mean simple, young miner.",
            item: "Foundational Stone",
            effect: "+30 All Stats",
            stats: { maxHp: 30, damage: 30 }
        }
    }
  };

  // NPC progression order for each district
  const npcProgressionOrder = {
    "Enchanted District": [
        { npc: "Saliten", progress: 0 },
        { npc: "Cory", progress: 10 },
        { npc: "Big Mac", progress: 20 },
        { npc: "Andy", progress: 30 },
        { npc: "Mike", progress: 40 },
        { npc: "Kush", progress: 50 },
        { npc: "Jr Chicken", progress: 60 },
        { npc: "Zombe", progress: 70 },
        { npc: "Research", progress: 80 }
    ],
    "Basic District": [
        { npc: "Dax", progress: 0 },
        { npc: "DJ", progress: 10 }
    ]
  };

  // Get current district's NPCs
  const getCurrentDistrictNPCs = () => {
    return districtNPCs[districtNames[currentDistrictIndex]] || {};
  };

  const checkHealth = () => {
    if (playerHP <= 0) {
      setGameOver(true);
      setCommandHistory(prev => [...prev,
        { type: 'system', text: '💀 You have fallen in battle...' },
        { type: 'system', text: 'Type "start" to try again' }
      ]);
      resetGame();
    }
  };

  const resetGame = () => {
    setPlayerHP(100);
    setMaxPlayerHP(100);
    setPlayerGold(0);
    setExplorationProgress(0);
    setInventory([]);
    setCurrentEnemy(null);
    setCurrentNPC(null);
    setInCombat(false);
    setGameState('start');
    setBossDefeated(false);
    setGameOver(false);
    
    // Clear NPC encounter history
    Object.values(districtNPCs).forEach(npcs => {
        Object.keys(npcs).forEach(npc => {
            localStorage.removeItem(`met_${npc}`);
        });
    });
  };

  const handleCommand = () => {
    const normalizedCommand = command.trim().toLowerCase();
    setCommandHistory(prev => [...prev, { type: 'user', text: `> ${command}` }]);

    // If game is over, only allow start command
    if (gameOver && normalizedCommand !== 'start') {
      setCommandHistory(prev => [...prev,
        { type: 'system', text: 'Game Over. Type "start" to try again.' }
      ]);
      setCommand('');
      return;
    }

    // Handle different game states
    switch (gameState) {
      case 'start':
        if (normalizedCommand === 'start') {
          setGameState('name');
          setCommandHistory(prev => [...prev,
            { type: 'system', text: 'Welcome to Crypto Conquerors: The Blockchain Quest!' },
            { type: 'system', text: 'What is your name, brave adventurer?' }
          ]);
        } else {
          setCommandHistory(prev => [...prev, { type: 'system', text: 'Type "start" to begin your adventure!' }]);
        }
        break;

      case 'name':
        if (normalizedCommand.length > 0) {
          setPlayerName(normalizedCommand);
          setGameState('house');
          setCommandHistory(prev => [...prev,
            { type: 'system', text: `Welcome, ${normalizedCommand}! Choose your crypto house:` },
            { type: 'system', text: '1. Bitcoin - The Original Pioneers' },
            { type: 'system', text: '2. Ethereum - The Smart Contract Innovators' },
            { type: 'system', text: '3. Solana - The Speed Demons' },
            { type: 'system', text: 'Type the number of your chosen house (1-3)' }
          ]);
        }
        break;

      case 'house':
        switch (normalizedCommand) {
          case '1':
          case '2':
          case '3':
            if (!playerName) {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'Please enter your name first!' }
              ]);
              break;
            }
            const house = command === '1' ? 'Bitcoin' : command === '2' ? 'Ethereum' : 'Solana';
            setPlayerHouse(house);
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `You've joined House ${house}!` },
              { type: 'system', text: 'Type "help" to see available commands.' }
            ]);
            
            // Automatically trigger Saliten's appearance with tutorial message
            setCurrentNPC("Saliten");
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `\nA wise elder appears before you, his eyes gleaming with ancient knowledge.` },
              { type: 'system', text: `You encounter Saliten!` },
              { type: 'system', text: `Saliten: "Welcome, young adventurer! I sense great potential in you."` },
              { type: 'system', text: `Saliten: "As you explore these lands, keep your eyes sharp. There are others like me scattered throughout,"` },
              { type: 'system', text: `Saliten: "hidden at specific points in your journey. Use the 'look' command when you feel a presence..."` },
              { type: 'system', text: `Type "talk" to receive my gift and begin your journey!` }
            ]);
            setGameState('playing');
            break;
        }
        break;

      case 'playing':
        // Check health before processing command
        checkHealth();
        
        if (inCombat && !['attack', 'flee', 'help'].includes(normalizedCommand)) {
          setCommandHistory(prev => [...prev,
            { type: 'system', text: 'You must attack or flee from combat first!' }
          ]);
          break;
        }

        switch (normalizedCommand) {
          case 'help':
            setCommandHistory(prev => [...prev,
              { type: 'system', text: 'Available Commands:' },
              { type: 'system', text: 'run - Explore the map' },
              { type: 'system', text: 'look - Search the area' },
              { type: 'system', text: 'explore - Discover special locations' },
              { type: 'system', text: 'attack - Fight enemies' },
              { type: 'system', text: 'flee - Run from combat' },
              { type: 'system', text: 'talk - Speak with NPCs' },
              { type: 'system', text: 'status - Check your stats' },
              { type: 'system', text: 'inventory - View your items' },
              { type: 'system', text: 'rest - Recover HP' }
            ]);
            break;

          case 'run':
            if (bossDefeated) {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'You have already conquered this district!' },
                { type: 'system', text: 'Time to move on to the next challenge.' }
              ]);
              break;
            }

            // Progress increases by 2% instead of 10%
            const newProgress = Math.min(explorationProgress + 2, 100);

            // Check for boss fight first before any other logic
            if (explorationProgress >= 96 && !currentEnemy && !bossDefeated) {
              setExplorationProgress(100);
              const boss = { ...bosses["Miner King"], name: "Miner King", hp: 200, damage: 25 };
              setCurrentEnemy(boss);
              setInCombat(true);
              setCommandHistory(prev => [...prev,
                { type: 'system', text: '\n=== BOSS ENCOUNTER ===\n' },
                { type: 'system', text: 'The ground trembles beneath your feet...' },
                { type: 'system', text: 'Ancient machinery whirs to life around you...' },
                { type: 'system', text: 'The Miner King emerges from his blockchain fortress!' },
                { type: 'system', text: '\n"So, you dare to challenge my realm?" he booms.' },
                { type: 'system', text: '"Let us see if you are worthy of the blockchain\'s power!"\n' },
                { type: 'system', text: 'Type "attack" to fight or "flee" to run away!' }
              ]);
              break;
            }

            // Only proceed with normal exploration if not fighting boss
            if (!currentEnemy) {
              setExplorationProgress(newProgress);
              
              if (!currentNPC) {
                // Random encounters
                const encounterChance = Math.random();
                if (encounterChance < 0.3) {
                  const enemies = ['Blockchain Bandit', 'Hash Rate Hunter', 'Crypto Wraith', 'Bug Bounty Beast'];
                  const enemyName = enemies[Math.floor(Math.random() * enemies.length)];
                  setCurrentEnemy({ name: enemyName, hp: 50, damage: 15 });
                  setInCombat(true);
                  setCommandHistory(prev => [...prev,
                    { type: 'system', text: `You encounter a ${enemyName}!` },
                    { type: 'system', text: 'Type "attack" to fight or "flee" to run away!' }
                  ]);
                } else {
                  setCommandHistory(prev => [...prev,
                    { type: 'system', text: `You venture deeper into ${districtNames[currentDistrictIndex]}... Exploration Progress: ${newProgress}%` }
                  ]);
                }
              }
            } else {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'You must deal with your current encounter first!' }
              ]);
            }
            break;

          case 'explore':
            const discoveries = [
              { name: 'Ancient Blockchain Temple', reward: 'Temple Blessing', gold: 100 },
              { name: 'Mysterious Crystal Cave', reward: 'Hash Crystal', gold: 150 },
              { name: 'Forgotten Mining Rig', reward: 'Genesis Core', gold: 200 }
            ];
            
            const discovery = discoveries[Math.floor(Math.random() * discoveries.length)];
            setPlayerGold(prev => prev + discovery.gold);
            setInventory(prev => [...prev, discovery.reward]);
            
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `You discovered the ${discovery.name}!` },
              { type: 'system', text: `You found ${discovery.gold} gold!` },
              { type: 'system', text: `Received: ${discovery.reward}` }
            ]);
            break;

          case 'look':
            if (!currentEnemy && !currentNPC) {
              // Check for NPCs first based on progress
              const currentDistrict = districtNames[currentDistrictIndex];
              const progression = npcProgressionOrder[currentDistrict];
              
              if (progression) {
                const nextNPC = progression.find(p => {
                  // Check if we're exactly at this NPC's progress point
                  const npcKey = `met_${p.npc}`;
                  return Math.floor(explorationProgress) === p.progress && !localStorage.getItem(npcKey);
                });

                if (nextNPC) {
                  const npc = nextNPC.npc;
                  setCurrentNPC(npc);
                  localStorage.setItem(`met_${npc}`, 'true');
                  
                  let description = "";
                  switch(npc) {
                    case "Saliten":
                      description = "A wise elder appears before you, his eyes gleaming with ancient knowledge.";
                      break;
                    case "Cory":
                      description = "A skilled blacksmith approaches, carrying finely crafted equipment.";
                      break;
                    case "Big Mac":
                      description = "A jolly chef emerges, his presence bringing warmth to the area.";
                      break;
                    case "Andy":
                      description = "A mysterious programmer materializes, surrounded by floating code fragments.";
                      break;
                    case "Mike":
                      description = "A battle-hardened warrior steps forth, his armor bearing marks of victory.";
                      break;
                    case "Kush":
                      description = "A mystical sage emerges from the shadows, ancient scrolls floating around him.";
                      break;
                    case "Jr Chicken":
                      description = "A small but confident warrior appears, radiating determination.";
                      break;
                    case "Zombe":
                      description = "A mysterious figure emerges from the shadows, ethereal chains rattling.";
                      break;
                    case "Research":
                      description = "A scholarly figure appears, surrounded by floating data streams.";
                      break;
                    default:
                      description = "A friendly face greets you.";
                  }
                  
                  setCommandHistory(prev => [...prev,
                    { type: 'system', text: `You discover a hidden presence...` },
                    { type: 'system', text: description },
                    { type: 'system', text: `You encounter ${npc}!` },
                    { type: 'system', text: 'Type "talk" to speak with them.' }
                  ]);
                  return;
                }
              }

              // If no NPC found, normal item discovery
              const findChance = Math.random();
              if (findChance < 0.4) {
                const items = ['Health Potion', 'Strength Elixir', 'Gold Coins', 'Ancient Scroll'];
                const item = items[Math.floor(Math.random() * items.length)];
                setCommandHistory(prev => [...prev,
                  { type: 'system', text: `You found a ${item}!` }
                ]);
                setInventory(prev => [...prev, item]);
              } else {
                setCommandHistory(prev => [...prev,
                  { type: 'system', text: 'You look around but find nothing of interest.' }
                ]);
              }
            } else {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'You cannot look around during an encounter!' }
              ]);
            }
            break;

          case 'attack':
            if (!currentEnemy) {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'There is nothing to attack!' }
              ]);
              break;
            }

            const playerDamage = totalStats.damage;
            const newEnemyHP = currentEnemy.hp - playerDamage;
            
            if (newEnemyHP <= 0) {
              if (currentEnemy.name === 'Miner King') {
                setBossDefeated(true);
                setCommandHistory(prev => [...prev,
                  { type: 'system', text: 'You have defeated the Miner King!' },
                  { type: 'system', text: 'You receive the Crown of the Miner King!' },
                  { type: 'system', text: 'Congratulations! You have completed this district!' }
                ]);
                setInventory(prev => [...prev, 'Crown of the Miner King']);
                setPlayerGold(prev => prev + 1000);
              } else {
                setCommandHistory(prev => [...prev,
                  { type: 'system', text: `You defeated the ${currentEnemy.name}!` },
                  { type: 'system', text: 'You found 50 gold!' }
                ]);
                setPlayerGold(prev => prev + 50);
              }
              setCurrentEnemy(null);
              setInCombat(false);
            } else {
              setCurrentEnemy({ ...currentEnemy, hp: newEnemyHP });
              const enemyDamage = currentEnemy.damage;
              setPlayerHP(prev => {
                const newHP = prev - enemyDamage;
                if (newHP <= 0) {
                  checkHealth();
                }
                return newHP;
              });
              setCommandHistory(prev => [...prev,
                { type: 'system', text: `You deal ${playerDamage} damage!` },
                { type: 'system', text: `Enemy HP: ${newEnemyHP}` },
                { type: 'system', text: `The ${currentEnemy.name} hits you for ${enemyDamage} damage!` }
              ]);
            }
            break;

          case 'flee':
            if (!currentEnemy) {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'There is nothing to flee from!' }
              ]);
              break;
            }

            const fleeChance = Math.random();
            if (fleeChance > 0.5 || currentEnemy.name === 'Miner King') {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'You failed to escape!' }
              ]);
            } else {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'You managed to escape!' }
              ]);
              setCurrentEnemy(null);
              setInCombat(false);
            }
            break;

          case 'talk':
            if (currentNPC) {
              const npcData = districtNPCs[districtNames[currentDistrictIndex]][currentNPC];
              setCommandHistory(prev => [...prev,
                { type: 'system', text: `${currentNPC}: "${npcData.speech}"` },
                { type: 'system', text: `${currentNPC} gives you a ${npcData.item}!` },
                { type: 'system', text: `Effect: ${npcData.effect}` }
              ]);

              // Apply stat bonuses
              setBonusStats(prev => ({
                maxHp: prev.maxHp + npcData.stats.maxHp,
                damage: prev.damage + npcData.stats.damage
              }));

              // Heal to new max HP when max HP increases
              if (npcData.stats.maxHp > 0) {
                setPlayerHP(totalStats.maxHp);
              }

              setInventory(prev => [...prev, npcData.item]);
              setCurrentNPC(null);
            } else {
              setCommandHistory(prev => [...prev,
                { type: 'system', text: 'There is no one to talk to!' }
              ]);
            }
            break;

          case 'status':
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `Name: ${playerName}` },
              { type: 'system', text: `HP: ${playerHP}/${totalStats.maxHp}` },
              { type: 'system', text: `Attack Power: ${totalStats.damage}` },
              { type: 'system', text: `Gold: ${playerGold}` },
              { type: 'system', text: `Progress: ${explorationProgress}%` }
            ]);
            break;

          case 'inventory':
            const items = inventory.length > 0 ? inventory.join(', ') : 'Empty';
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `Inventory: ${items}` }
            ]);
            break;

          case 'rest':
            const healAmount = 20;
            const newHP = Math.min(playerHP + healAmount, totalStats.maxHp);
            setPlayerHP(newHP);
            setCommandHistory(prev => [...prev,
              { type: 'system', text: `You rest and recover ${healAmount} HP. (${newHP}/${totalStats.maxHp})` }
            ]);
            break;

          default:
            setCommandHistory(prev => [...prev,
              { type: 'system', text: 'Command not recognized. Type "help" for available commands.' }
            ]);
        }
        break;
    }

    setCommand('');
  };

  // Add game intro when component mounts
  useEffect(() => {
    setCommandHistory([
      { type: 'system', text: '\n=== Welcome to Crypto Conquerors: The Blockchain Quest ===\n' },
      { type: 'system', text: 'Journey through 12 unique districts in this epic blockchain adventure:' },
      { type: 'system', text: '- Enchanted District: Where magic meets technology' },
      { type: 'system', text: '- Basic District: The foundation of blockchain' },
      { type: 'system', text: '- And 10 more districts to unlock!\n' },
      { type: 'system', text: 'Available Commands:' },
      { type: 'system', text: '- run: Explore and advance through the district' },
      { type: 'system', text: '- look: Search for hidden NPCs and items' },
      { type: 'system', text: '- explore: Discover special locations' },
      { type: 'system', text: '- attack/flee: Combat commands' },
      { type: 'system', text: '- talk: Interact with NPCs' },
      { type: 'system', text: '- status: Check your stats' },
      { type: 'system', text: '- inventory: View your items' },
      { type: 'system', text: '- rest: Recover HP\n' },
      { type: 'system', text: 'Special Features:' },
      { type: 'system', text: '- Hidden NPCs appear at specific progress points' },
      { type: 'system', text: '- Each district has a powerful boss' },
      { type: 'system', text: '- Collect unique items to grow stronger\n' },
      { type: 'system', text: "Type 'start' to begin your adventure!" }
    ]);
  }, []);

  // Add auto-scroll effect when command history updates
  useEffect(() => {
    const gameOutput = document.getElementById('game-output');
    if (gameOutput) {
        gameOutput.scrollTop = gameOutput.scrollHeight;
    }
  }, [commandHistory]);

  // Add state for voting modal
  const [showVotingModal, setShowVotingModal] = useState(false);

  // Add voting data
  const currentVotes = [
    {
      id: 1,
      title: "New Mining Pool Implementation",
      description: "Vote on implementing a new mining pool structure to improve efficiency and rewards distribution.",
      startDate: "2025-01-24",
      endDate: "2025-02-07",
      participants: 1247,
      status: "active"
    },
    {
      id: 2,
      title: "Community Fund Allocation",
      description: "Decide how to allocate the community fund for Q1 2025 between development, marketing, and liquidity.",
      startDate: "2025-01-20",
      endDate: "2025-01-27",
      participants: 892,
      status: "active"
    }
  ];

  const [showEnchantedRealm, setShowEnchantedRealm] = useState(false);

  return (
    <>  
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen w-screen bg-mine-dark text-white overflow-x-hidden bg-mine-pattern">
            {/* Cave Background Texture */}
            <div className="fixed inset-0 bg-cave-texture opacity-20 pointer-events-none" />
            <div className="fixed inset-0 bg-crystal-pattern opacity-10 pointer-events-none" />

            {/* Mining Ambience Elements */}
            {/* Water Drips */}
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <div
                  key={`drip-${i}`}
                  className="absolute animate-water-drip"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`
                  }}
                >
                  💧
                </div>
              ))}
            </div>

            {/* Cave Bats */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="animate-bat-fly text-2xl" style={{ animationDelay: '0s' }}>🦇</div>
              <div className="animate-bat-fly text-2xl" style={{ animationDelay: '5s' }}>🦇</div>
            </div>

            {/* Mining Equipment */}
            <div className="fixed bottom-10 left-10 animate-dig pointer-events-none">⛏️</div>
            <div className="fixed bottom-10 right-10 animate-drill-spin pointer-events-none">🔧</div>

            {/* Floating Ores */}
            <div className="fixed inset-0 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <div
                  key={`gold-${i}`}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 2}s`
                  }}
                >
                  <span className="text-mine-gold animate-ore-pulse">●</span>
                </div>
              ))}
              {[...Array(3)].map((_, i) => (
                <div
                  key={`silver-${i}`}
                  className="absolute animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${i * 2 + 1}s`
                  }}
                >
                  <span className="text-mine-silver animate-ore-pulse">●</span>
                </div>
              ))}
            </div>

            {/* Mining Elevator */}
            <div className="fixed right-20 inset-y-0 pointer-events-none">
              <div className="h-full flex items-center">
                <div className="animate-elevator-move">
                  <div className="bg-mine-dark/50 p-4 rounded-lg border border-mine-green/30">
                    <span className="text-2xl">🪜</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Wall Torches */}
            <div className="fixed left-0 inset-y-0 pointer-events-none">
              {[...Array(4)].map((_, i) => (
                <div
                  key={`torch-${i}`}
                  className="absolute left-4 animate-torch-flicker"
                  style={{ top: `${25 * (i + 1)}%` }}
                >
                  🔥
                </div>
              ))}
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex items-center justify-between h-20">
                  <div className="flex-shrink-0">
                    <span className="text-3xl font-bold text-mine-green animate-crystal-shine">$MINE</span>
                  </div>
                  
                  {/* Desktop Navigation */}
                  <div className="hidden md:block">
                    <div className="flex items-center space-x-8">
                      {navItems.map((item, index) => (
                        <React.Fragment key={item.name}>
                          {item.isDropdown && item.dropdownItems === buyOptions ? (
                            <div className="relative" ref={buyDropdownRef}>
                              <button
                                onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
                                className="px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                              >
                                <span>{item.name}</span>
                                <svg
                                  className={`ml-2 h-5 w-5 transform transition-transform ${buyDropdownOpen ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              {buyDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                                  <div className="py-1" role="menu" aria-orientation="vertical">
                                    {item.dropdownItems.map((dropdownItem) => (
                                      <a
                                        key={dropdownItem.name}
                                        href={dropdownItem.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                        role="menuitem"
                                        onClick={() => setBuyDropdownOpen(false)}
                                      >
                                        {dropdownItem.name}
                                        <span className="ml-2 text-sm">↗️</span>
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : item.isDropdown ? (
                            <div className="relative" ref={stakingDropdownRef}>
                              <button
                                onClick={() => setStakingDropdown(!stakingDropdown)}
                                className="px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                              >
                                <span>{item.name}</span>
                                <svg
                                  className={`ml-2 h-5 w-5 transform transition-transform ${stakingDropdown ? 'rotate-180' : ''}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              {stakingDropdown && (
                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
                                  <div className="py-1" role="menu" aria-orientation="vertical">
                                    {item.dropdownItems.map((dropdownItem) => (
                                      dropdownItem.href ? (
                                        <a
                                          key={dropdownItem.name}
                                          href={dropdownItem.href}
                                          target={dropdownItem.isExternal ? "_blank" : undefined}
                                          rel={dropdownItem.isExternal ? "noopener noreferrer" : undefined}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                          role="menuitem"
                                        >
                                          {dropdownItem.name}
                                          {dropdownItem.isExternal && (
                                            <span className="text-sm">↗️</span>
                                          )}
                                        </a>
                                      ) : (
                                        <button
                                          key={dropdownItem.name}
                                          onClick={dropdownItem.onClick}
                                          className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                          role="menuitem"
                                        >
                                          {dropdownItem.name}
                                        </button>
                                      )
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : item.onClick ? (
                            <button
                              onClick={item.onClick}
                              className="px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <a
                              href={item.href}
                              target={item.isExternal ? "_blank" : undefined}
                              rel={item.isExternal ? "noopener noreferrer" : undefined}
                              className="px-4 py-2 rounded-md text-lg font-medium flex items-center space-x-2 text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                            >
                              {item.name}
                              {item.isExternal && (
                                <span className="text-sm">↗️</span>
                              )}
                            </a>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Mobile menu button */}
                  <div className="md:hidden">
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white"
                    >
                      <span className="sr-only">Open main menu</span>
                      {menuOpen ? '✕' : '☰'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              {menuOpen && (
                <div className="md:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                      <React.Fragment key={item.name}>
                        {item.isDropdown && item.dropdownItems === buyOptions ? (
                          <div className="relative" ref={buyDropdownRef}>
                            <button
                              onClick={() => setBuyDropdownOpen(!buyDropdownOpen)}
                              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                            >
                              <span>{item.name}</span>
                              <svg
                                className={`ml-2 h-5 w-5 transform transition-transform ${buyDropdownOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            {buyDropdownOpen && (
                              <div className="pl-4">
                                {item.dropdownItems.map((dropdownItem) => (
                                  <a
                                    key={dropdownItem.name}
                                    href={dropdownItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                  >
                                    {dropdownItem.name}
                                    <span className="text-sm">↗️</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : item.isDropdown ? (
                          <>
                            <button
                              onClick={() => setStakingDropdown(!stakingDropdown)}
                              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                            >
                              {item.name}
                            </button>
                            {stakingDropdown && (
                              <div className="pl-4">
                                {item.dropdownItems.map((dropdownItem) => (
                                  dropdownItem.href ? (
                                    <a
                                      key={dropdownItem.name}
                                      href={dropdownItem.href}
                                      target={dropdownItem.isExternal ? "_blank" : undefined}
                                      rel={dropdownItem.isExternal ? "noopener noreferrer" : undefined}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                      {dropdownItem.name}
                                      {dropdownItem.isExternal && (
                                        <span className="text-sm">↗️</span>
                                      )}
                                    </a>
                                  ) : (
                                    <button
                                      key={dropdownItem.name}
                                      onClick={dropdownItem.onClick}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                                    >
                                      {dropdownItem.name}
                                    </button>
                                  )
                                ))}
                              </div>
                            )}
                          </>
                        ) : item.onClick ? (
                          <button
                            onClick={item.onClick}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                          >
                            {item.name}
                          </button>
                        ) : (
                          <a
                            href={item.href}
                            target={item.isExternal ? "_blank" : undefined}
                            rel={item.isExternal ? "noopener noreferrer" : undefined}
                            className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-mine-crystal hover:bg-black/30"
                          >
                            {item.name}
                            {item.isExternal && (
                              <span className="text-sm">↗️</span>
                            )}
                          </a>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </nav>

            {/* Hero Section */}
            <section id="home" className="min-h-screen w-full pt-20">
              <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black/80" />
              <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="flex flex-col items-center justify-center min-h-[calc(100vh-5rem)]">
                  <div className="text-center">
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 text-mine-green animate-float animate-glow">
                      Enchanted Miners
                    </h1>
                    <p className="text-2xl md:text-3xl mb-12 text-gray-300 animate-fade-in">
                      Join the magical mining revolution with our community of hardworking elves! 🧝‍♂️⛏️
                    </p>
                    <div className="flex flex-wrap justify-center gap-6">
                      <button onClick={() => window.open('https://jup.ag/swap/USDC-GaHu73uhhWrcGLF3CWUi26ZBzv5mZAy8PLrvzoM5XMZh', '_blank')} className="px-12 py-4 bg-mine-green hover:bg-mine-green-dark rounded-full text-xl font-semibold transition-all transform hover:scale-105 animate-bounce-subtle">
                        Buy Now
                      </button>
                      <button onClick={() => window.open('https://discord.gg/xptqZ2kp', '_blank')} className="px-12 py-4 bg-black/50 hover:bg-black/70 rounded-full text-xl font-semibold transition-all border-2 border-mine-green transform hover:scale-105 animate-pulse-glow">
                        Join Community
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About Section */}
            <section id="about" className="py-32 w-full relative">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">About $MINE</h2>
                  <p className="text-2xl text-gray-300">
                    The ultimate gaming and utility token in the magical mining realm
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative" style={{ isolation: 'isolate' }}>
                  <FeatureCard
                    title="Casino & Gaming"
                    description="Enter our magical casino realm at Enchanted Miners. Play, bet, and win with $MINE tokens across multiple games and events."
                    icon="🎰"
                    link="https://enchantedminers.xyz/"
                  />
                  <FeatureCard
                    title="Weekly Events"
                    description="Participate in weekly lotteries and exciting race betting events. Every week brings new chances to win big!"
                    icon="🎲"
                  />
                  <RaffleCard
                    title="Multi-Platform Raffles"
                    description="Enter exclusive raffles across our trusted partner platforms. Use $MINE to participate in multiple raffle opportunities!"
                    icon="🎯"
                  />
                  <FeatureCard
                    title="Art & Collectibles"
                    description="Unlock exclusive art upgrades and rare 1/1 pieces. Transform your NFTs into unique masterpieces with $MINE."
                    icon="🎨"
                    link="https://docs.google.com/forms/d/e/1FAIpQLSdX_JuEJJgB5SgzznGtoBemNtqgDzVtwvYTmZITwPSEr9j5_A/viewform?pli=1"
                  />
                  <FeatureCard
                    title="Space Missions"
                    description="Join Stoned Ape Crew missions using $MINE. Explore the cosmos and earn incredible rewards."
                    icon="🚀"
                    link="https://www.stonedapecrew.com/space-missions"
                  />
                  <FeatureCard
                    title="Trading Bot"
                    description="Coming Soon: Advanced trading bot using $MINE as gas fees. Trade smarter and faster with our automated solutions."
                    icon="🤖"
                  />
                </div>

                {/* Coming Soon Features */}
                <div className="mt-16">
                  <h3 className="text-3xl font-bold text-mine-crystal mb-8 text-center animate-crystal-shine">Coming Soon</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 animate-bounce-subtle">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">🎮</span>
                        <h4 className="text-xl font-bold text-mine-crystal">Gaming Platform</h4>
                      </div>
                      <p className="text-lg text-gray-300 mb-4">
                        Our dedicated casino and gaming platform featuring multiple games and betting options.
                      </p>
                    </div>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 animate-bounce-subtle">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">👕</span>
                        <h4 className="text-xl font-bold text-mine-crystal">$MINE Merch</h4>
                      </div>
                      <p className="text-lg text-gray-300 mb-4">
                        Exclusive merchandise store accepting $MINE tokens. Wear your mining pride!
                      </p>
                    </div>
                    
                    <div className="bg-black/30 rounded-xl p-6 border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 animate-bounce-subtle">
                      <div className="flex items-center mb-4">
                        <span className="text-2xl mr-3 animate-pulse-glow">🔄</span>
                        <h4 className="text-xl font-bold text-mine-crystal">Trading Features</h4>
                      </div>
                      <p className="text-lg text-gray-300 mb-4">
                        Enhanced trading capabilities with automated bots and advanced trading tools.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Use Cases Summary */}
                <div className="mt-16 text-center">
                  <div className="inline-flex flex-wrap justify-center gap-4 bg-black/30 rounded-xl p-6 border border-mine-green/30">
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-pickaxe-swing mr-2">⛏️</span> Casino Gaming
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-crystal-shine mr-2">💎</span> Art Upgrades
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-pulse-glow mr-2">🎲</span> Weekly Lotteries
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-float mr-2">🏇</span> Race Betting
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-bounce-subtle mr-2">🎯</span> Multiple Raffles
                    </span>
                    <span className="text-mine-crystal flex items-center">
                      <span className="animate-spin-slow mr-2">🤖</span> Trading Bot
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Tokenomics Section */}
            <div className="py-24 bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-12">Tokenomics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-gray-800 rounded-xl p-6 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Total Supply</h3>
                    <p className="text-xl text-blue-400">690,000,000</p>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Distribution</h3>
                    <ul className="space-y-4 text-gray-300">
                      <li className="flex justify-between items-center">
                        <span>Airdrop to Holders:</span>
                        <span className="text-blue-400">20%</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Staking & Casino:</span>
                        <span className="text-blue-400">40%</span>
                      </li>
                      <li className="flex justify-between items-center">
                        <span>Partner Projects:</span>
                        <span className="text-blue-400">40%</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-800 rounded-xl p-6">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Features</h3>
                    <ul className="space-y-4 text-gray-300">
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        No KOLs
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        No Presale
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        No Team Allocation
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Community Driven
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Roadmap Section */}
            <section id="roadmap" className="py-32 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Roadmap</h2>
                  <p className="text-2xl text-gray-300">
                    Our journey to build the ultimate mining ecosystem
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Phase 1 */}
                  <div className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="text-mine-green text-2xl font-bold mb-4">Phase 1</div>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">Airdrop Distribution</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">NFT Staking Launch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">$MINE Staking Launch</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">Art Upgrades</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">Raffles System</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
                        <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">Website Launch</span>
                      </li>
                    </ul>
                  </div>

                  {/* Phase 2 */}
                  <div className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="text-mine-green text-2xl font-bold mb-4">Phase 2</div>
                    <ul className="space-y-3">
                      <li>Casino Platform Launch</li>
                      <li>Multiple Game Types</li>
                      <li>Rewards System Integration</li>
                    </ul>
                  </div>

                  {/* Phase 3 */}
                  <div className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="text-mine-green text-2xl font-bold mb-4">Phase 3</div>
                    <ul className="space-y-3">
                      <li>Trading Bot Development</li>
                      <li>Strategy Implementation</li>
                      <li>Performance Analytics</li>
                    </ul>
                  </div>

                  {/* Phase 4 */}
                  <div className="bg-gray-800 rounded-xl p-6 transform hover:scale-105 transition duration-300">
                    <div className="text-mine-green text-2xl font-bold mb-4">Phase 4</div>
                    <ul className="space-y-3">
                      <li>Partner Services Platform</li>
                      <li>$MINE Integration</li>
                      <li>Service Marketplace</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Ecosystem Section */}
            <section id="ecosystem" className="py-32 w-full bg-black/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center">
                  <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                    <span className="block">Ecosystem</span>
                  </h2>
                  <p className="mt-4 text-xl text-gray-300">
                    Join our thriving ecosystem and be part of the future of blockchain gaming.
                  </p>
                </div>
                {/* Ecosystem content */}
              </div>
            </section>

            {/* Alpha Calls Section */}
            <section id="alpha-calls" className="py-24 w-full bg-gradient-to-b from-black to-gray-900">
              <AlphaCalls />
            </section>

            {/* Voting Section */}
            <section id="voting" className="py-24 w-full bg-gradient-to-b from-gray-900 to-black">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-white mb-8">
                    Community Voting
                  </h2>
                  <p className="mt-4 text-xl text-gray-300 mb-8">
                    Shape the future of $MINE. Your voice matters in our decentralized governance.
                  </p>
                  <button
                    onClick={() => setShowVotingModal(true)}
                    className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition duration-300"
                  >
                    View Active Votes
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </section>

            {/* Lottery Section */}
            <section id="lottery" className="py-32 w-full bg-black/30">
              <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12">Weekly Lottery</h2>
                <LotterySystem />
              </div>
            </section>

            {/* Buy Now Section */}
            <section id="buy" className="py-32 w-full">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-mine-green mb-6">Buy Now</h2>
                  <p className="text-2xl text-gray-300 mb-12">
                    Get your $MINE tokens today!
                  </p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="py-12 w-full bg-black/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-3xl font-bold text-mine-green mb-8 md:mb-0">
                    $MINE
                  </div>
                  <div className="flex space-x-12">
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Twitter
                    </a>
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Telegram
                    </a>
                    <a href="#" className="text-xl text-gray-300 hover:text-mine-crystal transition-colors">
                      Discord
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        } />
      </Routes>

      {/* Voting Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Active Votes</h3>
                <button
                  onClick={() => setShowVotingModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-6">
                {currentVotes.map(vote => (
                  <div key={vote.id} className="bg-gray-700 rounded-lg p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xl font-semibold text-white mb-2">{vote.title}</h4>
                        <p className="text-gray-300 mb-4">{vote.description}</p>
                      </div>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        Active
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-sm">Start Date</p>
                        <p className="text-white">{vote.startDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">End Date</p>
                        <p className="text-white">{vote.endDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Participants</p>
                        <p className="text-white">{vote.participants.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                      Cast Your Vote
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enchanted Realm Modal */}
      {showEnchantedRealm && createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/80" onClick={() => setShowEnchantedRealm(false)}></div>
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-gray-900 rounded-xl shadow-xl w-full max-w-4xl">
              <button 
                onClick={() => setShowEnchantedRealm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                ✕
              </button>
              <EnchantedRealm />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

const FeatureCard = ({ title, description, icon, link }) => {
  return (
    <div 
      onClick={() => link && window.open(link, '_blank')}
      className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group cursor-pointer"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute top-2 right-2 text-xl animate-crystal-shine">
        {icon}
        {link && <span className="ml-2 text-sm">↗️</span>}
      </div>
      
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-3xl animate-float`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-mine-crystal animate-crystal-shine">{title}</h3>
          <span className={`text-sm uppercase text-gray-300`}>{description}</span>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
    </div>
  );
};

const RaffleCard = ({ title, description, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const raffleLinks = [
    {
      name: "Frens Factory Raffles",
      url: "https://raffles.frenslabs.io/"
    },
    {
      name: "Mutants Raffles",
      url: "https://mutantsonsolanacrew.com/communities/EMINE"
    }
  ];

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105">
      <div className="absolute top-2 right-2 text-xl animate-crystal-shine">{icon}</div>
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-3xl animate-float`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-mine-crystal animate-crystal-shine">{title}</h3>
          <span className={`text-sm uppercase`}>{description}</span>
        </div>
      </div>
      
      <div className="relative z-50" ref={dropdownRef}>
        <button
          onClick={handleClick}
          className="w-full px-4 py-2 bg-mine-green/20 rounded-lg text-mine-crystal hover:text-mine-green transition-colors flex items-center justify-between"
        >
          <span>Choose Raffle Platform</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-90' : ''}`}>▶</span>
        </button>
        
        {isOpen && (
          <div className="absolute left-full ml-2 top-0 bg-gray-800 rounded-lg shadow-xl border border-mine-green/30 z-50 min-w-[200px]">
            {raffleLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-mine-green/20 hover:text-mine-crystal transition-colors first:rounded-t-lg last:rounded-b-lg whitespace-nowrap"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
                <span className="text-sm">↗️</span>
              </a>
            ))}
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute -right-2 bottom-2 text-sm animate-drill-spin">🔧</div>
    </div>
  );
};

const TokenomicCard = ({ title, value, description }) => {
  const oreTypes = ['🪙', '💎', '⚜️'];
  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute top-2 right-2 text-xl animate-crystal-shine">{oreTypes[Math.floor(Math.random() * oreTypes.length)]}</div>
      
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-3xl animate-float`}>
          {oreTypes[Math.floor(Math.random() * oreTypes.length)]}
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-mine-crystal animate-crystal-shine">{title}</h3>
          <span className={`text-sm uppercase`}>{description}</span>
        </div>
      </div>
      
      <div className="text-4xl font-bold text-white mb-2 group-hover:animate-sparkle">{value}</div>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute -right-2 bottom-2 text-sm animate-float delay-100">💎</div>
    </div>
  );
};

const RoadmapPhase = ({ phase, items }) => {
  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-2 right-2 text-xl animate-lantern-flicker">🏮</div>
      <div className="absolute top-2 left-2 text-xl animate-torch-flicker">🔥</div>
      <h3 className="text-2xl font-bold text-mine-crystal mb-6 animate-crystal-shine">{phase}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li 
            key={index} 
            className="flex items-center mb-4"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <span className="text-2xl text-mine-green group-hover:animate-pickaxe-swing">⛏️</span>
            <span className="text-lg text-gray-300 group-hover:text-mine-crystal transition-colors">{item}</span>
            {index % 2 === 0 && (
              <span className="text-sm animate-float ml-2">💎</span>
            )}
          </li>
        ))}
      </ul>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute bottom-2 right-2 text-sm animate-drill-spin">🔧</div>
    </div>
  );
};

const EcosystemCard = ({ name, description, logo, link, partnerType }) => {
  const partnerIcons = {
    'raffle': '🎲',
    'missions': '🚀',
    'flip': '🎰',
    'burn': '🔥',
    'marketplace': '🎯',
  };

  const partnerColors = {
    'raffle': 'text-purple-400',
    'missions': 'text-blue-400',
    'flip': 'text-yellow-400',
    'burn': 'text-red-400',
    'marketplace': 'text-green-400',
  };

  return (
    <div className="p-8 bg-black/30 rounded-xl border border-mine-green/30 hover:border-mine-green transition-all transform hover:scale-105 relative overflow-hidden group">
      <div className="absolute top-2 right-2 text-xl animate-crystal-shine">{partnerIcons[partnerType]}</div>
      <div className="absolute top-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      
      <div className="flex items-center mb-6">
        <div className={`w-16 h-16 rounded-full bg-black/50 flex items-center justify-center text-3xl animate-float ${partnerColors[partnerType]}`}>
          {logo}
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-mine-crystal animate-crystal-shine">{name}</h3>
          <span className={`text-sm ${partnerColors[partnerType]} uppercase`}>{partnerType}</span>
        </div>
      </div>
      
      <p className="text-lg text-gray-300 mb-4">{description}</p>
      
      <a 
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center ${partnerColors[partnerType]} hover:text-mine-green transition-colors`}
      >
        Visit Project <span className="ml-2 group-hover:animate-pickaxe-swing">⛏️</span>
      </a>
      
      <div className="absolute bottom-0 left-0 w-full h-1 bg-mine-green/20 animate-mine-dust" />
      <div className="absolute -right-2 bottom-2 text-sm animate-float delay-100">💎</div>
    </div>
  );
};

export default App;

