import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  getDatabase, 
  ref, 
  set, 
  get, 
  update, 
  onValue, 
  push, 
  serverTimestamp 
} from 'firebase/database';
import GameLogin from './GameLogin';

const MAX_OUTPUT_LINES = 100;

// Game constants
const DISTRICTS = {
  '1': {
    name: 'Novice Mines',
    description: 'A mysterious area of the blockchain.',
    enemies: [
      { name: 'Crypto Rat', maxHp: 20, hp: 20, attack: 5, defense: 2, exp: 10, gold: 5 },
      { name: 'Digital Spider', maxHp: 25, hp: 25, attack: 6, defense: 3, exp: 12, gold: 6 },
      { name: 'Code Goblin', maxHp: 30, hp: 30, attack: 7, defense: 4, exp: 15, gold: 8 }
    ],
    npcs: [
      { name: 'Old Miner', dialogue: ['Welcome to the mines, young one.', 'Be careful of the creatures that lurk here.'] },
      { name: 'Merchant', dialogue: ['Want to trade?', 'I have the best prices in the district!'] },
      { name: 'Lost Explorer', dialogue: ['I\'ve been mapping these mines for years.', 'There\'s treasure to be found if you know where to look.'] }
    ],
    explorationPoints: [
      'Ancient Mining Cart',
      'Abandoned Tunnel',
      'Crystal Cave',
      'Underground Stream',
      'Glowing Mushroom Grove'
    ]
  },
  '2': {
    name: 'Crystal Caverns',
    description: 'Shimmering crystals line the walls of this mysterious place.',
    enemies: [
      { name: 'Crystal Golem', maxHp: 40, hp: 40, attack: 10, defense: 5, exp: 20, gold: 10 },
      { name: 'Gem Eater', maxHp: 45, hp: 45, attack: 12, defense: 6, exp: 25, gold: 12 },
      { name: 'Shard Beast', maxHp: 50, hp: 50, attack: 15, defense: 7, exp: 30, gold: 15 }
    ],
    npcs: [
      { name: 'Crystal Sage', dialogue: ['The crystals speak to those who listen.', 'Their power grows stronger each day.'] },
      { name: 'Gem Cutter', dialogue: ['These crystals hold incredible power.', 'I can help you harness their energy.'] },
      { name: 'Cave Dweller', dialogue: ['Watch your step in these caves.', 'The crystal creatures are not friendly.'] }
    ],
    explorationPoints: [
      'Crystal Garden',
      'Resonating Chamber',
      'Prismatic Pool',
      'Gem Forge',
      'Echo Cavern'
    ]
  },
  '3': {
    name: 'Shadow Depths',
    description: 'Darkness pervades this treacherous area of the mines.',
    enemies: [
      { name: 'Shadow Lurker', maxHp: 60, hp: 60, attack: 20, defense: 10, exp: 40, gold: 20 },
      { name: 'Void Walker', maxHp: 65, hp: 65, attack: 22, defense: 12, exp: 45, gold: 22 },
      { name: 'Dark Miner', maxHp: 70, hp: 70, attack: 25, defense: 15, exp: 50, gold: 25 }
    ],
    npcs: [
      { name: 'Shadow Guide', dialogue: ['The darkness holds many secrets.', 'Let me show you the way.'] },
      { name: 'Mysterious Trader', dialogue: ['Rare goods for brave souls.', 'What secrets do you seek?'] },
      { name: 'Lost Soul', dialogue: ['I\'ve been here so long...', 'The shadows whisper ancient truths.'] }
    ],
    explorationPoints: [
      'Shadow Portal',
      'Void Pit',
      'Dark Shrine',
      'Obsidian Chamber',
      'Nightmare Cave'
    ]
  },
  '4': {
    name: 'Elemental Forge',
    description: 'Ancient forges burn with elemental power.',
    enemies: [
      { name: 'Flame Golem', maxHp: 80, hp: 80, attack: 30, defense: 18, exp: 60, gold: 30 },
      { name: 'Storm Wraith', maxHp: 85, hp: 85, attack: 32, defense: 20, exp: 65, gold: 32 },
      { name: 'Earth Crusher', maxHp: 90, hp: 90, attack: 35, defense: 22, exp: 70, gold: 35 }
    ],
    npcs: [
      { name: 'Master Smith', dialogue: ['The elements bend to my will.', 'Bring me materials, and I\'ll forge you something special.'] },
      { name: 'Element Binder', dialogue: ['The elements are restless today.', 'Such power requires great respect.'] },
      { name: 'Forge Keeper', dialogue: ['These flames have burned for centuries.', 'The ancient forges hold many secrets.'] }
    ],
    explorationPoints: [
      'Eternal Flame',
      'Thunder Anvil',
      'Earth Core',
      'Wind Chamber',
      'Element Well'
    ]
  },
  '5': {
    name: 'Tech Haven',
    description: 'A district where ancient and modern technology converge.',
    enemies: [
      { name: 'Mech Warrior', maxHp: 100, hp: 100, attack: 40, defense: 25, exp: 80, gold: 40 },
      { name: 'Cyber Sentinel', maxHp: 105, hp: 105, attack: 42, defense: 27, exp: 85, gold: 42 },
      { name: 'Data Reaper', maxHp: 110, hp: 110, attack: 45, defense: 30, exp: 90, gold: 45 }
    ],
    npcs: [
      { name: 'Tech Oracle', dialogue: ['The future and past are one here.', 'Seek wisdom in the machine.'] },
      { name: 'Circuit Weaver', dialogue: ['Every connection tells a story.', 'The network grows stronger each day.'] },
      { name: 'Digital Sage', dialogue: ['Technology is just another form of magic.', 'Let me upgrade your gear.'] }
    ],
    explorationPoints: [
      'Quantum Core',
      'Data Ocean',
      'Circuit Maze',
      'Binary Forest',
      'Tech Shrine'
    ]
  },
  '6': {
    name: 'Cosmic Void',
    description: 'A mysterious realm where space and time blur.',
    enemies: [
      { name: 'Star Eater', maxHp: 120, hp: 120, attack: 50, defense: 32, exp: 100, gold: 50 },
      { name: 'Void Stalker', maxHp: 125, hp: 125, attack: 52, defense: 35, exp: 105, gold: 52 },
      { name: 'Time Wraith', maxHp: 130, hp: 130, attack: 55, defense: 37, exp: 110, gold: 55 }
    ],
    npcs: [
      { name: 'Star Walker', dialogue: ['The void hungers!', 'Time is an illusion here.'] },
      { name: 'Cosmic Weaver', dialogue: ['Stars are born and die in my hands.', 'The universe whispers its secrets.'] },
      { name: 'Void Seer', dialogue: ['I see all possible futures.', 'Choose your path wisely.'] }
    ],
    explorationPoints: [
      'Star Forge',
      'Time Rift',
      'Void Gate',
      'Cosmic Well',
      'Reality Tear'
    ]
  },
  '7': {
    name: 'Dragon\'s Lair',
    description: 'Ancient dragons guard their treasures in this fierce realm.',
    enemies: [
      { name: 'Dragon Whelp', maxHp: 140, hp: 140, attack: 60, defense: 40, exp: 120, gold: 60 },
      { name: 'Drake Hunter', maxHp: 145, hp: 145, attack: 62, defense: 42, exp: 125, gold: 62 },
      { name: 'Wyrm Guard', maxHp: 150, hp: 150, attack: 65, defense: 45, exp: 130, gold: 65 }
    ],
    npcs: [
      { name: 'Dragon Tamer', dialogue: ['Even dragons can be reasoned with.', 'Respect their power.'] },
      { name: 'Scale Smith', dialogue: ['Dragon scales make the finest armor.', 'If you can get them, that is.'] },
      { name: 'Wyrm Scholar', dialogue: ['Dragons are the oldest beings here.', 'Their wisdom is unmatched.'] }
    ],
    explorationPoints: [
      'Dragon Nest',
      'Scale Garden',
      'Flame Pool',
      'Treasure Vault',
      'Ancient Roost'
    ]
  },
  '8': {
    name: 'Celestial Peaks',
    description: 'The highest peaks where celestial beings dwell.',
    enemies: [
      { name: 'Angel Knight', maxHp: 160, hp: 160, attack: 70, defense: 48, exp: 140, gold: 70 },
      { name: 'Star Seraph', maxHp: 165, hp: 165, attack: 72, defense: 50, exp: 145, gold: 72 },
      { name: 'Heaven\'s Guard', maxHp: 170, hp: 170, attack: 75, defense: 52, exp: 150, gold: 75 }
    ],
    npcs: [
      { name: 'Cloud Walker', dialogue: ['The air is thin but pure here.', 'Few mortals reach these heights.'] },
      { name: 'Star Reader', dialogue: ['The constellations tell your story.', 'Your destiny is written in the stars.'] },
      { name: 'Sky Sage', dialogue: ['Heaven\'s secrets are not for mortals.', 'But perhaps you are different...'] }
    ],
    explorationPoints: [
      'Star Gate',
      'Cloud Temple',
      'Heaven\'s Forge',
      'Astral Pool',
      'Divine Garden'
    ]
  },
  '9': {
    name: 'Demon\'s Deep',
    description: 'The deepest layer where ancient demons reside.',
    enemies: [
      { name: 'Hell Knight', maxHp: 180, hp: 180, attack: 80, defense: 55, exp: 160, gold: 80 },
      { name: 'Demon Lord', maxHp: 185, hp: 185, attack: 82, defense: 57, exp: 165, gold: 82 },
      { name: 'Soul Reaper', maxHp: 190, hp: 190, attack: 85, defense: 60, exp: 170, gold: 85 }
    ],
    npcs: [
      { name: 'Dark Priest', dialogue: ['The darkness welcomes all.', 'Power comes at a price.'] },
      { name: 'Soul Keeper', dialogue: ['So many souls, so little time.', 'Each one tells a story of regret.'] },
      { name: 'Demon Scholar', dialogue: ['Knowledge is power.', 'And power corrupts beautifully.'] }
    ],
    explorationPoints: [
      'Hell Gate',
      'Soul Forge',
      'Dark Altar',
      'Shadow Throne',
      'Demon\'s Treasury'
    ]
  },
  '10': {
    name: 'Digital Nexus',
    description: 'The heart of all digital realms.',
    enemies: [
      { name: 'Code Titan', maxHp: 200, hp: 200, attack: 90, defense: 62, exp: 180, gold: 90 },
      { name: 'Data Leviathan', maxHp: 205, hp: 205, attack: 92, defense: 65, exp: 185, gold: 92 },
      { name: 'Binary God', maxHp: 210, hp: 210, attack: 95, defense: 67, exp: 190, gold: 95 }
    ],
    npcs: [
      { name: 'System Admin', dialogue: ['The code flows through all things.', 'Reality is just another program.'] },
      { name: 'Network Ghost', dialogue: ['I am everywhere and nowhere.', 'The network remembers all.'] },
      { name: 'Digital Prophet', dialogue: ['I have seen the future in the data streams.', 'Your path is calculated.'] }
    ],
    explorationPoints: [
      'Central Core',
      'Data Ocean',
      'Code Library',
      'Binary Temple',
      'Digital Nexus'
    ]
  },
  '11': {
    name: 'Time Labyrinth',
    description: 'Where past, present, and future converge.',
    enemies: [
      { name: 'Chrono Knight', maxHp: 220, hp: 220, attack: 100, defense: 70, exp: 200, gold: 100 },
      { name: 'Temporal Beast', maxHp: 225, hp: 225, attack: 102, defense: 72, exp: 205, gold: 102 },
      { name: 'Time Devourer', maxHp: 230, hp: 230, attack: 105, defense: 75, exp: 210, gold: 105 }
    ],
    npcs: [
      { name: 'Time Keeper', dialogue: ['All moments exist at once here.', 'Choose your timeline wisely.'] },
      { name: 'Past Walker', dialogue: ['I have seen all that was.', 'History repeats in cycles.'] },
      { name: 'Future Seer', dialogue: ['The future is not set.', 'But some paths are more likely than others.'] }
    ],
    explorationPoints: [
      'Time Pool',
      'Memory Hall',
      'Future Gate',
      'Past Archive',
      'Present Nexus'
    ]
  },
  '12': {
    name: 'Creator\'s Realm',
    description: 'The final frontier where reality itself is forged.',
    enemies: [
      { name: 'Reality Shaper', maxHp: 240, hp: 240, attack: 110, defense: 77, exp: 220, gold: 110 },
      { name: 'Universe Weaver', maxHp: 245, hp: 245, attack: 112, defense: 80, exp: 225, gold: 112 },
      { name: 'Existence Ender', maxHp: 250, hp: 250, attack: 115, defense: 82, exp: 230, gold: 115 }
    ],
    npcs: [
      { name: 'Creator', dialogue: ['All realities begin and end here.', 'You have come far, little one.'] },
      { name: 'Reality Architect', dialogue: ['I design the frameworks of existence.', 'What world shall we build today?'] },
      { name: 'Universal Scribe', dialogue: ['Every story must have an ending.', 'But endings are just new beginnings.'] }
    ],
    explorationPoints: [
      'Creation Forge',
      'Reality Loom',
      'Existence Core',
      'Universal Heart',
      'Creator\'s Throne'
    ]
  }
};

const BOSSES = {
  '1': {
    name: 'The Mining Overseer',
    maxHp: 100,
    hp: 100,
    attack: 15,
    defense: 10,
    exp: 100,
    gold: 100,
    dialogue: [
      'So, you dare challenge me?',
      'You\'ll never leave these mines alive!',
      'Impossible... how did you become so strong?'
    ]
  },
  '2': {
    name: 'Crystal Monarch',
    maxHp: 200,
    hp: 200,
    attack: 25,
    defense: 15,
    exp: 200,
    gold: 200,
    dialogue: [
      'You disturb the crystal\'s slumber!',
      'Feel the power of the ancient gems!',
      'The crystals... they\'ve chosen you...'
    ]
  },
  '3': {
    name: 'Shadow King',
    maxHp: 300,
    hp: 300,
    attack: 35,
    defense: 20,
    exp: 300,
    gold: 300,
    dialogue: [
      'The darkness consumes all!',
      'Your light will fade in my domain!',
      'Perhaps... you are worthy of the shadows...'
    ]
  },
  '4': {
    name: 'Elemental Lord',
    maxHp: 400,
    hp: 400,
    attack: 45,
    defense: 25,
    exp: 400,
    gold: 400,
    dialogue: [
      'You dare challenge the elements?',
      'Feel nature\'s wrath!',
      'The elements... acknowledge you...'
    ]
  },
  '5': {
    name: 'Tech Overlord',
    maxHp: 500,
    hp: 500,
    attack: 55,
    defense: 30,
    exp: 500,
    gold: 500,
    dialogue: [
      'Your hardware is obsolete!',
      'Time for a forced upgrade!',
      'System... shutting... down...'
    ]
  },
  '6': {
    name: 'Void Emperor',
    maxHp: 600,
    hp: 600,
    attack: 65,
    defense: 35,
    exp: 600,
    gold: 600,
    dialogue: [
      'The void hungers!',
      'Reality bends to my will!',
      'Impossible... the void... accepts you...'
    ]
  },
  '7': {
    name: 'Elder Dragon',
    maxHp: 700,
    hp: 700,
    attack: 75,
    defense: 40,
    exp: 700,
    gold: 700,
    dialogue: [
      'You are but an insect to me!',
      'Burn in eternal flame!',
      'Perhaps... you are worthy...'
    ]
  },
  '8': {
    name: 'Celestial Emperor',
    maxHp: 800,
    hp: 800,
    attack: 85,
    defense: 45,
    exp: 800,
    gold: 800,
    dialogue: [
      'You dare ascend to the heavens?',
      'Feel divine judgment!',
      'The heavens... acknowledge you...'
    ]
  },
  '9': {
    name: 'Demon King',
    maxHp: 900,
    hp: 900,
    attack: 95,
    defense: 50,
    exp: 900,
    gold: 900,
    dialogue: [
      'Kneel before the king of hell!',
      'Your soul will fuel my power!',
      'Perhaps... you are worthy of the crown...'
    ]
  },
  '10': {
    name: 'Digital Overlord',
    maxHp: 1000,
    hp: 1000,
    attack: 105,
    defense: 55,
    exp: 1000,
    gold: 1000,
    dialogue: [
      'I am the perfect being!',
      'Your existence will be deleted!',
      'System... crash... imminent...'
    ]
  },
  '11': {
    name: 'Time Lord',
    maxHp: 1100,
    hp: 1100,
    attack: 115,
    defense: 60,
    exp: 1100,
    gold: 1100,
    dialogue: [
      'Time itself bows to me!',
      'Your future ends here!',
      'Time... chooses... you...'
    ]
  },
  '12': {
    name: 'The Creator',
    maxHp: 1200,
    hp: 1200,
    attack: 125,
    defense: 65,
    exp: 1200,
    gold: 1200,
    dialogue: [
      'Face your creator!',
      'Reality bends to my will!',
      'You... have surpassed creation itself...'
    ]
  }
};

const DISTRICT_NAMES = {
  '1': 'Novice Mines',
  '2': 'Crystal Caverns',
  '3': 'Shadow Depths',
  '4': 'Elemental Forge',
  '5': 'Tech Haven',
  '6': 'Cosmic Void',
  '7': 'Dragon\'s Lair',
  '8': 'Celestial Peaks',
  '9': 'Demon\'s Deep',
  '10': 'Digital Nexus',
  '11': 'Time Labyrinth',
  '12': 'Creator\'s Realm'
};

const ENEMIES = {
  'Novice Mines': [
    { name: 'Crypto Rat', maxHp: 20, hp: 20, attack: 5, defense: 2, exp: 10, gold: 5 },
    { name: 'Digital Spider', maxHp: 25, hp: 25, attack: 6, defense: 3, exp: 12, gold: 6 },
    { name: 'Code Goblin', maxHp: 30, hp: 30, attack: 7, defense: 4, exp: 15, gold: 8 }
  ],
  'Crystal Caverns': [
    { name: 'Crystal Golem', maxHp: 40, hp: 40, attack: 10, defense: 5, exp: 20, gold: 10 },
    { name: 'Gem Eater', maxHp: 45, hp: 45, attack: 12, defense: 6, exp: 25, gold: 12 },
    { name: 'Shard Beast', maxHp: 50, hp: 50, attack: 15, defense: 7, exp: 30, gold: 15 }
  ],
  'Shadow Depths': [
    { name: 'Shadow Lurker', maxHp: 60, hp: 60, attack: 20, defense: 10, exp: 40, gold: 20 },
    { name: 'Void Walker', maxHp: 65, hp: 65, attack: 22, defense: 12, exp: 45, gold: 22 },
    { name: 'Dark Miner', maxHp: 70, hp: 70, attack: 25, defense: 15, exp: 50, gold: 25 }
  ],
  'Elemental Forge': [
    { name: 'Flame Golem', maxHp: 80, hp: 80, attack: 30, defense: 18, exp: 60, gold: 30 },
    { name: 'Storm Wraith', maxHp: 85, hp: 85, attack: 32, defense: 20, exp: 65, gold: 32 },
    { name: 'Earth Crusher', maxHp: 90, hp: 90, attack: 35, defense: 22, exp: 70, gold: 35 }
  ],
  'Tech Haven': [
    { name: 'Mech Warrior', maxHp: 100, hp: 100, attack: 40, defense: 25, exp: 80, gold: 40 },
    { name: 'Cyber Sentinel', maxHp: 105, hp: 105, attack: 42, defense: 27, exp: 85, gold: 42 },
    { name: 'Data Reaper', maxHp: 110, hp: 110, attack: 45, defense: 30, exp: 90, gold: 45 }
  ],
  'Cosmic Void': [
    { name: 'Star Eater', maxHp: 120, hp: 120, attack: 50, defense: 32, exp: 100, gold: 50 },
    { name: 'Void Stalker', maxHp: 125, hp: 125, attack: 52, defense: 35, exp: 105, gold: 52 },
    { name: 'Time Wraith', maxHp: 130, hp: 130, attack: 55, defense: 37, exp: 110, gold: 55 }
  ],
  'Dragon\'s Lair': [
    { name: 'Dragon Whelp', maxHp: 140, hp: 140, attack: 60, defense: 40, exp: 120, gold: 60 },
    { name: 'Drake Hunter', maxHp: 145, hp: 145, attack: 62, defense: 42, exp: 125, gold: 62 },
    { name: 'Wyrm Guard', maxHp: 150, hp: 150, attack: 65, defense: 45, exp: 130, gold: 65 }
  ],
  'Celestial Peaks': [
    { name: 'Angel Knight', maxHp: 160, hp: 160, attack: 70, defense: 48, exp: 140, gold: 70 },
    { name: 'Star Seraph', maxHp: 165, hp: 165, attack: 72, defense: 50, exp: 145, gold: 72 },
    { name: 'Heaven\'s Guard', maxHp: 170, hp: 170, attack: 75, defense: 52, exp: 150, gold: 75 }
  ],
  'Demon\'s Deep': [
    { name: 'Hell Knight', maxHp: 180, hp: 180, attack: 80, defense: 55, exp: 160, gold: 80 },
    { name: 'Demon Lord', maxHp: 185, hp: 185, attack: 82, defense: 57, exp: 165, gold: 82 },
    { name: 'Soul Reaper', maxHp: 190, hp: 190, attack: 85, defense: 60, exp: 170, gold: 85 }
  ],
  'Digital Nexus': [
    { name: 'Code Titan', maxHp: 200, hp: 200, attack: 90, defense: 62, exp: 180, gold: 90 },
    { name: 'Data Leviathan', maxHp: 205, hp: 205, attack: 92, defense: 65, exp: 185, gold: 92 },
    { name: 'Binary God', maxHp: 210, hp: 210, attack: 95, defense: 67, exp: 190, gold: 95 }
  ],
  'Time Labyrinth': [
    { name: 'Chrono Knight', maxHp: 220, hp: 220, attack: 100, defense: 70, exp: 200, gold: 100 },
    { name: 'Temporal Beast', maxHp: 225, hp: 225, attack: 102, defense: 72, exp: 205, gold: 102 },
    { name: 'Time Devourer', maxHp: 230, hp: 230, attack: 105, defense: 75, exp: 210, gold: 105 }
  ],
  'Creator\'s Realm': [
    { name: 'Reality Shaper', maxHp: 240, hp: 240, attack: 110, defense: 77, exp: 220, gold: 110 },
    { name: 'Universe Weaver', maxHp: 245, hp: 245, attack: 112, defense: 80, exp: 225, gold: 112 },
    { name: 'Existence Ender', maxHp: 250, hp: 250, attack: 115, defense: 82, exp: 230, gold: 115 }
  ]
};

const NPCS = {
  'Novice Mines': {
    10: {
      name: 'Old Miner',
      dialogue: 'Welcome to the mines, young one. Be careful of the creatures that lurk here.',
      reward: { gold: 50, item: 'Mining Pick' }
    },
    20: {
      name: 'Merchant',
      dialogue: 'Want to trade? I have the best prices in the district!',
      reward: { gold: 75, item: 'Data Fragment' }
    },
    30: {
      name: 'Lost Explorer',
      dialogue: 'I\'ve been mapping these mines for years. There\'s treasure to be found if you know where to look.',
      reward: { gold: 100, item: 'Sage\'s Scroll' }
    },
    40: {
      name: 'Circuit Runner',
      dialogue: 'Take this circuit board, it\'s got some juice left in it.',
      reward: { gold: 125, item: 'Charged Circuit' }
    },
    50: {
      name: 'Merchant Bot',
      dialogue: 'I\'ve got rare items for sale! Come back when you\'re stronger.',
      reward: { gold: 150, item: 'Lucky Coin' }
    },
    60: {
      name: 'Binary Prophet',
      dialogue: 'The ones and zeros speak of your destiny...',
      reward: { gold: 175, item: 'Prophet\'s Mark' }
    },
    70: {
      name: 'Veteran Programmer',
      dialogue: 'The boss uses strong defensive algorithms. Find a way to break through!',
      reward: { gold: 200, item: 'Debug Tool' }
    },
    80: {
      name: 'Quantum Tinkerer',
      dialogue: 'This quantum chip might give you an edge in battle.',
      reward: { gold: 250, item: 'Quantum Chip' }
    },
    90: {
      name: 'District Guardian',
      dialogue: 'You\'re almost ready to face the Mining Overseer. Take this, it might help!',
      reward: { gold: 300, item: 'Guardian\'s Blessing' }
    },
    95: {
      name: 'Lost AI',
      dialogue: 'My calculations suggest you\'ll need this for the upcoming battle...',
      reward: { gold: 350, item: 'AI Core' }
    }
  }
};

const SHOP_ITEMS = {
  'Novice Mines': [
    { name: 'Health Potion', price: 50, effect: 'Restores 50 HP', type: 'consumable' },
    { name: 'Iron Sword', price: 100, effect: '+5 Attack', type: 'weapon' },
    { name: 'Leather Armor', price: 80, effect: '+3 Defense', type: 'armor' },
    { name: 'Lucky Charm', price: 150, effect: '+5% Critical Chance', type: 'accessory' },
    { name: 'Speed Boots', price: 120, effect: '+10% Flee Chance', type: 'accessory' }
  ]
};

const EXPLORATION_ITEMS = {
  'Novice Mines': [
    { name: 'Rusty Gear', type: 'misc', rarity: 'common', value: 10 },
    { name: 'Data Crystal', type: 'misc', rarity: 'uncommon', value: 25 },
    { name: 'Binary Shard', type: 'material', rarity: 'common', value: 15 },
    { name: 'Circuit Fragment', type: 'material', rarity: 'uncommon', value: 30 },
    { name: 'Memory Core', type: 'material', rarity: 'rare', value: 50 },
    { name: 'Code Scroll', type: 'consumable', rarity: 'uncommon', value: 35 },
    { name: 'Health Circuit', type: 'consumable', rarity: 'common', value: 20, heal: 30 },
    { name: 'Power Fragment', type: 'material', rarity: 'rare', value: 45 },
    { name: 'Digital Essence', type: 'material', rarity: 'epic', value: 100 },
    { name: 'Quantum Dust', type: 'material', rarity: 'rare', value: 75 }
  ]
};

const EXPLORATION_EVENTS = {
  'Novice Mines': [
    { 
      text: 'You found an old computer terminal...',
      rewards: [
        { type: 'gold', amount: 10 },
        { type: 'item', chance: 0.3, pool: ['Rusty Gear', 'Binary Shard'] }
      ]
    },
    { 
      text: 'A cache of lost data crystals glimmers nearby...',
      rewards: [
        { type: 'gold', amount: 15 },
        { type: 'item', chance: 0.4, pool: ['Data Crystal', 'Circuit Fragment'] }
      ]
    },
    { 
      text: 'Ancient code fragments float in the digital wind...',
      rewards: [
        { type: 'gold', amount: 20 },
        { type: 'item', chance: 0.5, pool: ['Code Scroll', 'Memory Core'] }
      ]
    },
    { 
      text: 'You discover a forgotten mining rig...',
      rewards: [
        { type: 'gold', amount: 25 },
        { type: 'item', chance: 0.6, pool: ['Power Fragment', 'Health Circuit'] }
      ]
    },
    { 
      text: 'A mysterious blockchain signature catches your eye...',
      rewards: [
        { type: 'gold', amount: 30 },
        { type: 'item', chance: 0.7, pool: ['Digital Essence', 'Quantum Dust'] }
      ]
    }
  ]
};

const EQUIPMENT = {
  'Iron Sword': { type: 'weapon', attack: 5 },
  'Steel Sword': { type: 'weapon', attack: 10 },
  'Mythril Sword': { type: 'weapon', attack: 15 },
  'Dragon Slayer': { type: 'weapon', attack: 25 },
  
  'Leather Armor': { type: 'armor', defense: 3 },
  'Iron Armor': { type: 'armor', defense: 8 },
  'Steel Armor': { type: 'armor', defense: 15 },
  'Dragon Scale Armor': { type: 'armor', defense: 25 },
  
  'Lucky Charm': { type: 'accessory', critChance: 5 },
  'Speed Boots': { type: 'accessory', fleeChance: 10 },
  'Power Ring': { type: 'accessory', attack: 5 },
  'Guardian Amulet': { type: 'accessory', defense: 5 }
};

const CONSUMABLES = {
  'Health Potion': { heal: 50 },
  'Super Potion': { heal: 100 },
  'Max Potion': { heal: 999 },
  'Attack Boost': { tempAttack: 10, duration: 3 },
  'Defense Boost': { tempDefense: 10, duration: 3 }
};

const EXP_TO_LEVEL = {
  1: 100,
  2: 250,
  3: 500,
  4: 1000,
  5: 2000,
  6: 4000,
  7: 8000,
  8: 16000,
  9: 32000,
  10: 64000
};

const LEVEL_REWARDS = {
  2: { maxHp: 120, attack: 12, defense: 8 },
  3: { maxHp: 150, attack: 15, defense: 10 },
  4: { maxHp: 200, attack: 20, defense: 15 },
  5: { maxHp: 300, attack: 30, defense: 20 },
  6: { maxHp: 450, attack: 45, defense: 30 },
  7: { maxHp: 600, attack: 60, defense: 40 },
  8: { maxHp: 800, attack: 80, defense: 55 },
  9: { maxHp: 1000, attack: 100, defense: 70 },
  10: { maxHp: 1500, attack: 150, defense: 100 }
};

const STORE_ITEMS = {
  'Health Potion': { price: 50, description: 'Restores 50 HP' },
  'Strength Potion': { price: 100, description: 'Temporarily increases attack by 5' },
  'Defense Potion': { price: 100, description: 'Temporarily increases defense by 5' },
  'Iron Sword': { price: 200, description: 'Increases attack by 10' },
  'Iron Armor': { price: 200, description: 'Increases defense by 10' },
  'Magic Crystal': { price: 500, description: 'Required for district advancement' }
};

const TRADE_ITEMS = {
  'Ore': { value: 10, description: 'Basic mining resource' },
  'Gems': { value: 50, description: 'Precious stones from mining' },
  'Artifacts': { value: 100, description: 'Ancient items found while mining' },
  'Magic Crystal': { value: 250, description: 'Rare magical crystal' }
};

const ITEM_VALUES = {
  // Basic potions
  'Health Potion': 25,
  'Strength Potion': 30,
  'Defense Potion': 30,

  // Cave items (25% mark)
  'Ancient Mining Pick': 150,
  'Crystal Compass': 200,
  'Glowing Mushrooms': 100,
  'Underground Map': 175,
  'Miner\'s Lucky Charm': 250,

  // Temple items (50% mark)
  'Sacred Relic': 300,
  'Blessed Amulet': 350,
  'Temple Key': 275,
  'Holy Water': 225,
  'Divine Scroll': 400,

  // Treasure items (75% mark)
  'Gold Nugget': 500,
  'Precious Gems': 600,
  'Rare Coins': 450,
  'Ancient Artifact': 700,
  'Valuable Ring': 550,

  // Note items (100% mark)
  'Secret Map': 800,
  'Ancient Prophecy': 1000,
  'Mysterious Coordinates': 750,
  'Forgotten Knowledge': 900,
  'Coded Message': 850,

  // NPC special items
  'Rare Crystal': 400,
  'Ancient Coin': 300,
  'Magic Scroll': 350,
  'Lucky Charm': 250,
  'Mysterious Key': 500,
  'Enchanted Ring': 600,
  'Power Stone': 700,
  'Mining Map': 450
};

const HOUSES = {
  'Dragon': {
    description: 'House of the Dragon: Masters of power and strength. Start with higher attack.',
    bonuses: { attack: 5, maxHp: 100, defense: 3 }
  },
  'Phoenix': {
    description: 'House of the Phoenix: Blessed with vitality and rebirth. Start with higher HP.',
    bonuses: { attack: 3, maxHp: 120, defense: 3 }
  },
  'Griffin': {
    description: 'House of the Griffin: Balanced in all aspects. Equal stats in all areas.',
    bonuses: { attack: 4, maxHp: 110, defense: 4 }
  },
  'Serpent': {
    description: 'House of the Serpent: Masters of defense and survival. Start with higher defense.',
    bonuses: { attack: 3, maxHp: 100, defense: 5 }
  }
};

const generateNPC = () => {
  const npcs = [
    {
      name: 'Old Miner Jim',
      greeting: 'Ah, another brave soul seeking fortune in these mines!',
      advice: 'Watch your step in the deeper parts of the mine, and always keep a health potion handy!'
    },
    {
      name: 'Mystic Maven',
      greeting: 'The crystals whisper of your arrival...',
      advice: 'The mines hold many secrets. Sometimes looking around can reveal hidden treasures.'
    },
    {
      name: 'Trader Tom',
      greeting: 'Got some nice gems to trade?',
      advice: 'Save your rare ores and gems. They\'re worth more than you might think!'
    },
    {
      name: 'Scout Sarah',
      greeting: 'These tunnels change every day, I swear!',
      advice: 'The deeper you go, the better the rewards... but also the greater the danger.'
    }
  ];
  return npcs[Math.floor(Math.random() * npcs.length)];
};

const generateExplorationSpot = () => {
  const spots = [
    {
      name: 'Ancient Mining Cart',
      description: 'An old mining cart filled with forgotten treasures.'
    },
    {
      name: 'Crystal Cave',
      description: 'A hidden cave with walls covered in sparkling crystals.'
    },
    {
      name: 'Abandoned Storage Room',
      description: 'A dusty room filled with old mining equipment and supplies.'
    },
    {
      name: 'Underground Lake',
      description: 'A serene underground lake with crystal-clear water.'
    },
    {
      name: 'Mysterious Shrine',
      description: 'An ancient shrine dedicated to the spirits of the mine.'
    }
  ];
  return spots[Math.floor(Math.random() * spots.length)];
};

const generateBoss = (district) => {
  const bosses = {
    'Novice Mines': {
      name: 'The Crystal Golem',
      hp: 200,
      damage: 15,
      dialogue: 'I am the guardian of these mines. Prove your worth!',
      reward: 500
    },
    'Shadow Caverns': {
      name: 'Shadowmaw',
      hp: 300,
      damage: 20,
      dialogue: 'The darkness will consume you!',
      reward: 750
    },
    'Molten Core': {
      name: 'Magma Lord',
      hp: 400,
      damage: 25,
      dialogue: 'Feel the burn of my eternal flame!',
      reward: 1000
    },
    'Frost Peaks': {
      name: 'Ice Queen',
      hp: 500,
      damage: 30,
      dialogue: 'Your heart will freeze in my domain!',
      reward: 1250
    },
    'Thunder Plains': {
      name: 'Storm Giant',
      hp: 600,
      damage: 35,
      dialogue: 'Face the fury of the tempest!',
      reward: 1500
    },
    'Mystic Forest': {
      name: 'Ancient Treant',
      hp: 700,
      damage: 40,
      dialogue: 'Nature\'s wrath shall be your end!',
      reward: 1750
    },
    'Cursed Catacombs': {
      name: 'Necrolord',
      hp: 800,
      damage: 45,
      dialogue: 'Join my army of the undead!',
      reward: 2000
    },
    'Dragon\'s Lair': {
      name: 'Elder Dragon',
      hp: 1000,
      damage: 50,
      dialogue: 'I have slept for a thousand years. You dare disturb me?',
      reward: 2500
    }
  };
  return bosses[district];
};

const generateEnemy = (district) => {
  const enemies = {
    'Novice Mines': [
      { name: 'Cave Bat', hp: 30, damage: 10, reward: 15 },
      { name: 'Rock Elemental', hp: 40, damage: 15, reward: 20 },
      { name: 'Crystal Spider', hp: 35, damage: 12, reward: 18 },
      { name: 'Mine Goblin', hp: 45, damage: 13, reward: 25 }
    ],
    'Shadow Caverns': [
      { name: 'Shadow Lurker', hp: 50, damage: 15, reward: 30 },
      { name: 'Dark Stalker', hp: 55, damage: 18, reward: 35 },
      { name: 'Void Beast', hp: 60, damage: 20, reward: 40 },
      { name: 'Night Hunter', hp: 65, damage: 22, reward: 45 }
    ],
    'Molten Core': [
      { name: 'Flame Imp', hp: 70, damage: 25, reward: 50 },
      { name: 'Lava Crawler', hp: 75, damage: 28, reward: 55 },
      { name: 'Fire Elemental', hp: 80, damage: 30, reward: 60 },
      { name: 'Magma Beast', hp: 85, damage: 32, reward: 65 }
    ],
    'Frost Peaks': [
      { name: 'Frost Wolf', hp: 90, damage: 35, reward: 70 },
      { name: 'Ice Golem', hp: 95, damage: 38, reward: 75 },
      { name: 'Snow Wraith', hp: 100, damage: 40, reward: 80 },
      { name: 'Frozen Giant', hp: 105, damage: 42, reward: 85 }
    ],
    'Thunder Plains': [
      { name: 'Lightning Sprite', hp: 110, damage: 45, reward: 90 },
      { name: 'Storm Hawk', hp: 115, damage: 48, reward: 95 },
      { name: 'Thunder Beast', hp: 120, damage: 50, reward: 100 },
      { name: 'Tempest Warrior', hp: 125, damage: 52, reward: 105 }
    ],
    'Mystic Forest': [
      { name: 'Forest Spirit', hp: 130, damage: 55, reward: 110 },
      { name: 'Ancient Ent', hp: 135, damage: 58, reward: 115 },
      { name: 'Fae Warrior', hp: 140, damage: 60, reward: 120 },
      { name: 'Beast Shaman', hp: 145, damage: 62, reward: 125 }
    ],
    'Cursed Catacombs': [
      { name: 'Skeletal Knight', hp: 150, damage: 65, reward: 130 },
      { name: 'Wraith', hp: 155, damage: 68, reward: 135 },
      { name: 'Cursed Warrior', hp: 160, damage: 70, reward: 140 },
      { name: 'Death Mage', hp: 165, damage: 72, reward: 145 }
    ],
    'Dragon\'s Lair': [
      { name: 'Dragon Whelp', hp: 170, damage: 75, reward: 150 },
      { name: 'Drake Guardian', hp: 175, damage: 78, reward: 155 },
      { name: 'Wyrmling', hp: 180, damage: 80, reward: 160 },
      { name: 'Dragon Knight', hp: 185, damage: 82, reward: 165 }
    ]
  };
  
  const districtEnemies = enemies[district];
  return districtEnemies[Math.floor(Math.random() * districtEnemies.length)];
};

const handleTradeRequest = async (targetPlayer, itemIndex, goldAmount, currentWallet) => {
  const db = getDatabase();
  const tradesRef = ref(db, 'trades');
  const newTradeRef = push(tradesRef);
  
  // Create trade request
  await set(newTradeRef, {
    from: currentWallet,
    to: targetPlayer,
    itemIndex,
    goldAmount,
    status: 'pending',
    timestamp: serverTimestamp()
  });

  return newTradeRef;
};

const acceptTrade = async (tradeId, currentWallet) => {
  const db = getDatabase();
  const tradeRef = ref(db, `trades/${tradeId}`);
  
  try {
    // Get trade details
    const tradeSnapshot = await get(tradeRef);
    const trade = tradeSnapshot.val();
    
    if (!trade) {
      console.error('Trade not found:', tradeId);
      return { success: false, error: 'Trade not found' };
    }

    if (trade.status !== 'pending') {
      console.error('Trade not pending:', trade.status);
      return { success: false, error: 'Trade already ' + trade.status };
    }
    
    // Verify trade is for this player
    if (trade.to !== currentWallet) {
      console.error('Trade not for current player:', trade.to, currentWallet);
      return { success: false, error: 'This trade is not for you' };
    }
    
    // Get sender's data
    const fromSnapshot = await get(ref(db, `users/${trade.from}`));
    const fromData = fromSnapshot.val()?.gameData;
    
    // Get receiver's data
    const toSnapshot = await get(ref(db, `users/${trade.to}`));
    const toData = toSnapshot.val()?.gameData;
    
    if (!fromData || !toData) {
      console.error('Player data missing:', !fromData ? 'sender' : 'receiver');
      return { success: false, error: 'Player data missing' };
    }
    
    // Verify sender has enough gold
    if (trade.goldAmount > 0 && (!fromData.gold || fromData.gold < trade.goldAmount)) {
      console.error('Not enough gold:', fromData.gold, trade.goldAmount);
      return { success: false, error: 'Sender does not have enough gold' };
    }
    
    // Verify sender has the item
    if (trade.itemIndex >= 0) {
      if (!fromData.inventory || trade.itemIndex >= fromData.inventory.length) {
        console.error('Item not found:', trade.itemIndex, fromData.inventory);
        return { success: false, error: 'Item no longer available' };
      }
    }
    
    // Transfer gold
    const fromNewGold = (fromData.gold || 0) - (trade.goldAmount || 0);
    const toNewGold = (toData.gold || 0) + (trade.goldAmount || 0);
    
    // Transfer item
    let fromNewInventory = [...(fromData.inventory || [])];
    let toNewInventory = [...(toData.inventory || [])];
    
    if (trade.itemIndex >= 0) {
      const item = fromNewInventory[trade.itemIndex];
      fromNewInventory.splice(trade.itemIndex, 1);
      toNewInventory.push(item);
    }
    
    // Update both players' data
    await set(ref(db, `users/${trade.from}/gameData`), {
      ...fromData,
      gold: fromNewGold,
      inventory: fromNewInventory
    });
    
    await set(ref(db, `users/${trade.to}/gameData`), {
      ...toData,
      gold: toNewGold,
      inventory: toNewInventory
    });
    
    // Mark trade as completed
    await set(tradeRef, {
      ...trade,
      status: 'completed',
      completedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Trade error:', error);
    return { success: false, error: 'Technical error: ' + error.message };
  }
};

const EnchantedRealm = () => {
  const [wallet, setWallet] = useState(null);
  const [playerData, setPlayerData] = useState(null);
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState(['Welcome to Enchanted Miners! Connect your wallet to begin.']);
  const [inBattle, setInBattle] = useState(false);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [currentNpc, setCurrentNpc] = useState(null);
  const [canTalkToNpc, setCanTalkToNpc] = useState(false);
  const [explorationSpot, setExplorationSpot] = useState(null);
  const [canExplore, setCanExplore] = useState(false);
  const [isNewPlayer, setIsNewPlayer] = useState(false);
  const [characterCreation, setCharacterCreation] = useState({
    step: 0,
    name: '',
    house: ''
  });
  const [districtChoices, setDistrictChoices] = useState([]);
  const [awaitingDistrictChoice, setAwaitingDistrictChoice] = useState(false);
  const [awaitingTrade, setAwaitingTrade] = useState(false);
  const [tradeItems, setTradeItems] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [awaitingTradeType, setAwaitingTradeType] = useState(false);
  const [activePlayers, setActivePlayers] = useState([]);
  const [allPlayers, setAllPlayers] = useState([]);
  const [searchMode, setSearchMode] = useState(false);
  const [pendingTradeIds, setPendingTradeIds] = useState([]);
  const outputRef = useRef(null);

  const addToOutput = useCallback((message) => {
    setOutput(prev => [...prev, ...(Array.isArray(message) ? message : [message])]);
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }, 0);
  }, []);

  const savePlayerData = useCallback(async (newData) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${wallet}`);
      await set(userRef, {
        gameData: newData
      });
      setPlayerData(newData);
    } catch (error) {
      console.error('Error saving player data:', error);
      // Don't show error message to user
    }
  }, [wallet]);

  const handleLogin = useCallback(async (address) => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${address}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData) {
        // New user
        const initialGameData = {
          gold: 0,
          hp: 100,
          maxHp: 100,
          attack: 1,
          defense: 1,
          level: 1,
          inventory: [],
          currentDistrict: null,
          districtProgress: 0,
          completedDistricts: []
        };

        setWallet(address);
        setPlayerData(initialGameData);
        setIsNewPlayer(true);
        setCharacterCreation({ step: 1, name: '', house: '' });
        addToOutput([
          '🎮 Welcome to the Enchanted Mining Realm! 🎮',
          '',
          'Before you begin your adventure, let\'s create your character.',
          'What shall we call you, brave miner? (Type "name <your-name>")'
        ]);
      } else {
        // Existing user
        setWallet(address);
        setPlayerData(userData.gameData);
        setIsNewPlayer(false);
        setCharacterCreation({ step: 0, name: '', house: '' });
        addToOutput([
          `Welcome back, ${userData.gameData.name} of House ${userData.gameData.house}!`,
          'Type "help" to see available commands or "start" to continue your adventure.'
        ]);
      }
    } catch (error) {
      console.error('Login error:', error);
      addToOutput('Error logging in. Please try again.');
    }
  }, [addToOutput]);

  const handleCommand = useCallback(async (cmd) => {
    if (!cmd) return;
    cmd = cmd.trim().toLowerCase();

    // Handle character creation first
    if (isNewPlayer) {
      if (cmd.startsWith('name ') && characterCreation.step === 1) {
        const name = cmd.substring(5).trim();
        if (name.length < 2 || name.length > 20) {
          addToOutput('Please choose a name between 2 and 20 characters.');
          return;
        }

        setCharacterCreation(prev => ({
          ...prev,
          step: 2,
          name: name
        }));

        addToOutput([
          `Greetings, ${name}! Now, choose your house:`,
          '',
          ...Object.entries(HOUSES).map(([house, data]) => 
            `${house}: ${data.description}`
          ),
          '',
          'Type "house <house-name>" to choose your house.'
        ]);
        return;
      }

      if (cmd.startsWith('house ') && characterCreation.step === 2) {
        const houseName = cmd.substring(6).trim();
        const matchedHouse = Object.keys(HOUSES).find(h => h.toLowerCase() === houseName.toLowerCase());
        const house = HOUSES[matchedHouse];

        if (!house) {
          addToOutput([
            'Invalid house name. Please choose from:',
            ...Object.keys(HOUSES).map(name => `- ${name}`)
          ]);
          return;
        }

        const newPlayerData = {
          name: characterCreation.name,
          house: matchedHouse, // Use the properly cased house name
          level: 1,
          exp: 0,
          gold: 100,
          ...house.bonuses,
          hp: house.bonuses.maxHp,
          inventory: ['Health Potion', 'Health Potion'],
          currentDistrict: null,
          districtProgress: 0,
          completedDistricts: []
        };

        const db = getDatabase();
        const userRef = ref(db, `users/${wallet}`);
        
        try {
          await set(userRef, {
            gameData: newPlayerData
          });

          setPlayerData(newPlayerData);
          setIsNewPlayer(false);
          setCharacterCreation({ step: 0, name: '', house: '' });

          addToOutput([
            `Welcome, ${newPlayerData.name} of House ${matchedHouse}!`,
            '',
            '📜 Game Introduction 📜',
            'You find yourself at the entrance of the mysterious Novice Mines.',
            'Here are the basic commands to get you started:',
            '',
            '- "start": Begin your adventure',
            '- "run": Explore the current area',
            '- "look": Search for hidden secrets or NPCs',
            '- "attack": Fight enemies you encounter',
            '- "flee": Try to escape from battle (25% chance)',
            '- "heal": Use a potion to recover HP',
            '- "inventory": Check your items',
            '- "store": Visit the store to sell items',
            '- "help": See all available commands',
            '',
            'Special Features:',
            '- Every 10% progress: Use "look" to find NPCs',
            '- Every 25% progress: Use "explore" to find special locations',
            '- At 100% progress: Face the district boss',
            '',
            'Type "start" when you\'re ready to begin!'
          ]);
        } catch (error) {
          console.error('Error creating character:', error);
          // Don't show error message to user
        }
        return;
      }

      // Only show these messages if we're not handling a valid command
      if (!cmd.startsWith('name ') && !cmd.startsWith('house ')) {
        if (characterCreation.step === 1) {
          addToOutput('Please choose your name first. (Type "name <your-name>")');
          return;
        } else if (characterCreation.step === 2) {
          addToOutput('Please choose your house first. (Type "house <house-name>")');
          return;
        }
      }
      return;
    }

    // Rest of the command handling...
    if (cmd === 'help') {
      addToOutput([
        'Available commands:',
        '- start: Begin your adventure',
        '- run: Explore the current district',
        '- attack: Fight enemies',
        '- heal: Use a health potion',
        '- flee: Try to escape battle',
        '- trade: Trade with shop or players',
        '- trades: View pending trades',
        '- accept <ID>: Accept a trade',
        '- decline <ID>: Decline a trade',
        '- stats: View your stats',
        '- inventory: View your items'
      ]);

    } else if (cmd === 'stats') {
      if (!playerData) {
        addToOutput('No character data available!');
        return;
      }

      addToOutput([
        '📊 Character Stats 📊',
        '-------------------',
        `Name: ${playerData.name}`,
        `House: ${playerData.house}`,
        `Level: ${playerData.level}`,
        `HP: ${playerData.hp}/${playerData.maxHp}`,
        `Attack: ${playerData.attack}`,
        `Defense: ${playerData.defense}`,
        `Gold: ${playerData.gold || 0}`,
        `Current District: ${playerData.currentDistrict || 'None'}`,
        `District Progress: ${playerData.districtProgress || 0}%`
      ]);

    } else if (cmd === 'inventory') {
      if (!playerData || !playerData.inventory || playerData.inventory.length === 0) {
        addToOutput('Your inventory is empty. Use "trade" to buy items!');
      } else {
        addToOutput([
          'Your Inventory:',
          ...playerData.inventory.map((item, i) => `${i + 1}. ${item}`),
          '',
          'Gold: ' + (playerData.gold || 0)
        ]);
      }
    } else if (cmd === 'start') {
      if (playerData.currentDistrict) {
        addToOutput(`You are currently in ${playerData.currentDistrict}. Type "run" to explore!`);
        return;
      }

      // Get available districts based on completed ones
      const completedDistricts = playerData.completedDistricts || [];
      let availableDistricts = ['Novice Mines'];
      
      const allDistricts = [
        'Novice Mines',
        'Shadow Caverns',
        'Molten Core',
        'Frost Peaks',
        'Thunder Plains',
        'Mystic Forest',
        'Cursed Catacombs',
        'Dragon\'s Lair'
      ];

      // Unlock districts based on completed ones
      for (let i = 0; i < completedDistricts.length; i++) {
        if (i + 1 < allDistricts.length) {
          availableDistricts.push(allDistricts[i + 1]);
        }
      }

      // Filter out completed districts unless all are done
      if (completedDistricts.length < allDistricts.length) {
        availableDistricts = availableDistricts.filter(d => !completedDistricts.includes(d));
      }

      // If all districts completed, allow replaying any
      if (completedDistricts.length === allDistricts.length) {
        availableDistricts = allDistricts;
      }

      addToOutput([
        'Choose your district:',
        ...availableDistricts.map((d, i) => `${i + 1}. ${d}`)
      ]);

      setDistrictChoices(availableDistricts);
      setAwaitingDistrictChoice(true);

    } else if (cmd.match(/^[1-8]$/) && awaitingDistrictChoice) {
      const choice = parseInt(cmd) - 1;
      const district = districtChoices[choice];

      if (!district) {
        addToOutput('Invalid choice. Please choose a valid number.');
        return;
      }

      const updatedData = {
        ...playerData,
        currentDistrict: district,
        districtProgress: 0,
        hp: 100
      };
      await savePlayerData(updatedData);

      setAwaitingDistrictChoice(false);
      setDistrictChoices([]);

      addToOutput([
        `Welcome to ${district}!`,
        'Type "run" to start exploring.',
        '',
        'Commands:',
        '- run: Explore the district',
        '- attack: Fight enemies',
        '- heal: Use health potion',
        '- stats: View your stats',
        '- help: Show all commands'
      ]);
    } else if (cmd === 'run') {
      if (!playerData.currentDistrict) {
        addToOutput('Please use "start" command first to begin your adventure!');
        return;
      }

      // Progress calculation
      const progressIncrease = 5; // Fixed 5% progress per run
      const newProgress = Math.min(100, (playerData.districtProgress || 0) + progressIncrease);
      
      const updatedData = {
        ...playerData,
        districtProgress: newProgress
      };
      await savePlayerData(updatedData);

      addToOutput([
        `You've traveled deeper into the ${playerData.currentDistrict}...`,
        `District Progress: ${newProgress}%`
      ]);

      // Boss battle at 100%
      if (newProgress === 100) {
        const boss = generateBoss(playerData.currentDistrict);
        setCurrentEnemy(boss);
        setInBattle(true);
        addToOutput([
          '🔥 BOSS BATTLE! 🔥',
          `You've encountered ${boss.name}!`,
          boss.dialogue,
          `${boss.name} - HP: ${boss.hp}`,
          'Type "attack" to fight!'
        ]);
        return;
      }

      // Silently set up NPC at 10% intervals
      if (Math.abs(newProgress % 10) < 0.1 && newProgress > 0) {
        const npc = generateNPC();
        setCurrentNpc(npc);
        setCanTalkToNpc(true);
      }

      // Silently set up exploration spot at 25% intervals
      if (Math.abs(newProgress % 25) < 0.1 && newProgress > 0 && newProgress < 100) {
        const spot = generateExplorationSpot();
        setExplorationSpot(spot);
        setCanExplore(true);
      }

      // Random enemy encounters (30% chance)
      const encounterRoll = Math.random() * 100;
      if (encounterRoll < 30) {
        const enemy = generateEnemy(playerData.currentDistrict);
        setCurrentEnemy(enemy);
        setInBattle(true);
        addToOutput([
          `⚔️ A wild ${enemy.name} appears! ⚔️`,
          `${enemy.name} - HP: ${enemy.hp}`,
          'Type "attack" to fight!'
        ]);
      } else {
        // Nothing special happens
        const messages = [
          'You see glowing crystals in the distance...',
          'You discover an old mining cart...',
          'You find some interesting rock formations...',
          'You hear water dripping somewhere nearby...',
          'The tunnel opens into a larger cavern...',
          'Ancient mining tools litter the ground...',
          'A cool breeze blows through the tunnel...'
        ];
        addToOutput(messages[Math.floor(Math.random() * messages.length)]);
      }

    } else if (cmd === 'look') {
      if (!playerData.currentDistrict) {
        addToOutput('You must start your adventure first! Type "start" to begin.');
        return;
      }

      const progress = playerData.districtProgress || 0;
      
      // Silently set up NPC at 10% intervals
      if (Math.abs(progress % 10) < 0.1 && progress > 0) {
        const npc = generateNPC();
        setCurrentNpc(npc);
        setCanTalkToNpc(true);
      }
      
      addToOutput('You look around but find nothing of interest at the moment.');

    } else if (cmd === 'talk') {
      // Check if we're at a 10% interval
      const progress = playerData.districtProgress || 0;
      if (Math.abs(progress % 10) < 0.1 && progress > 0) {
        // Generate NPC if not already present
        if (!currentNpc) {
          const npc = generateNPC();
          setCurrentNpc(npc);
          setCanTalkToNpc(true);
        }
        
        if (currentNpc && canTalkToNpc) {
          const reward = Math.floor(Math.random() * 30) + 20; // 20-50 gold
          const updatedData = {
            ...playerData,
            gold: (playerData.gold || 0) + reward
          };
          await savePlayerData(updatedData);

          addToOutput([
            `👤 You meet ${currentNpc.name}!`,
            `"${currentNpc.greeting}"`,
            `${currentNpc.name} shares some mining wisdom with you...`,
            `"${currentNpc.advice}"`,
            `They reward you with ${reward} gold!`
          ]);

          setCurrentNpc(null);
          setCanTalkToNpc(false);
          return;
        }
      }
      
      addToOutput('There is no one to talk to here.');

    } else if (cmd === 'explore') {
      const progress = playerData.districtProgress || 0;
      
      // Check if we're at a 25% interval (25%, 50%, 75%)
      if (Math.abs(progress % 25) < 0.1 && progress > 0 && progress < 100) {
        // Generate exploration spot if not already present
        if (!explorationSpot) {
          const spot = generateExplorationSpot();
          setExplorationSpot(spot);
          setCanExplore(true);
        }

        if (canExplore) {
          const reward = Math.floor(Math.random() * 50) + 50; // 50-100 gold
          const updatedData = {
            ...playerData,
            gold: playerData.gold + reward
          };
          await savePlayerData(updatedData);

          addToOutput([
            `🔍 You discover ${explorationSpot.name}!`,
            explorationSpot.description,
            `You found ${reward} gold!`
          ]);

          setExplorationSpot(null);
          setCanExplore(false);
          return;
        }
      }

      addToOutput('There is nothing to explore here.');

    } else if (cmd === 'heal') {
      if (!playerData.inventory || !playerData.inventory.includes('Health Potion')) {
        addToOutput('You don\'t have any Health Potions!');
        return;
      }

      if (playerData.hp >= playerData.maxHp) {
        addToOutput('Your HP is already full!');
        return;
      }

      const healAmount = 50;
      const newHp = Math.min(playerData.maxHp, playerData.hp + healAmount);
      const updatedData = {
        ...playerData,
        hp: newHp,
        inventory: playerData.inventory.filter((item, index) => 
          index !== playerData.inventory.indexOf('Health Potion')
        )
      };
      await savePlayerData(updatedData);

      addToOutput([
        'You used a Health Potion!',
        `Recovered ${healAmount} HP!`,
        `Current HP: ${newHp}/${playerData.maxHp}`
      ]);

    } else if (cmd === 'store') {
      if (!playerData) {
        addToOutput('You must start your adventure first!');
        return;
      }

      const storeItems = [
        { name: 'Health Potion', price: 50 },
        { name: 'Strength Potion', price: 100 },
        { name: 'Defense Potion', price: 100 }
      ];

      addToOutput([
        '🏪 Welcome to the Store! 🏪',
        '-------------------------',
        ...storeItems.map(item => `${item.name}: ${item.price} gold`),
        '-------------------------',
        'To buy an item, type "buy <item name>"',
        `Your gold: ${playerData.gold || 0}`
      ]);

    } else if (cmd.startsWith('buy ')) {
      if (!playerData) {
        addToOutput('You must start your adventure first!');
        return;
      }

      const itemName = cmd.slice(4);
      const storeItems = {
        'health potion': { name: 'Health Potion', price: 50 },
        'strength potion': { name: 'Strength Potion', price: 100 },
        'defense potion': { name: 'Defense Potion', price: 100 }
      };

      const item = storeItems[itemName.toLowerCase()];
      if (!item) {
        addToOutput('Invalid item! Type "store" to see available items.');
        return;
      }

      if ((playerData.gold || 0) < item.price) {
        addToOutput('Not enough gold! Keep fighting to earn more.');
        return;
      }

      const inventory = [...(playerData.inventory || [])];
      inventory.push(item.name);

      const updatedData = {
        ...playerData,
        gold: playerData.gold - item.price,
        inventory
      };
      await savePlayerData(updatedData);

      addToOutput([
        `Bought ${item.name} for ${item.price} gold!`,
        `Remaining gold: ${updatedData.gold}`
      ]);

    } else if (cmd === 'trade') {
      if (!playerData.currentDistrict) {
        addToOutput('You need to be in a district to trade! Use "start" to begin.');
        return;
      }

      addToOutput([
        'Trading Options:',
        '1. Shop (buy items)',
        '2. Trade with Players',
        '3. Search Player by Wallet',
        '',
        'Type 1, 2, or 3 to choose',
        '',
        'Other commands:',
        '- trades: View your pending trades',
        '- accept <ID>: Accept a trade',
        '- decline <ID>: Decline a trade',
        '- stats: View your stats',
        '- inventory: View your items'
      ]);
      
      setAwaitingTradeType(true);
      setAwaitingTrade(false);
      setSelectedPlayer(null);
      setSearchMode(false);

    } else if (awaitingTradeType && (cmd === '1' || cmd === '2' || cmd === '3')) {
      const choice = cmd;
      setAwaitingTradeType(false);

      if (choice === '1') {
        // Show shop
        const storeItems = [
          { name: 'Health Potion', price: 50 },
          { name: 'Strength Potion', price: 100 },
          { name: 'Defense Potion', price: 100 }
        ];

        addToOutput([
          '🏪 Welcome to the Store! 🏪',
          '-------------------------',
          ...storeItems.map(item => `${item.name}: ${item.price} gold`),
          '-------------------------',
          'To buy an item, type "buy <item name>"',
          `Your gold: ${playerData.gold || 0}`
        ]);
      } else if (choice === '2') {
        // Show active players for trading
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        
        try {
          const snapshot = await get(usersRef);
          const users = snapshot.val() || {};
          
          const activePlayers = Object.entries(users)
            .filter(([address]) => address !== wallet)
            .map(([address, data]) => ({
              address,
              name: data.gameData?.name || 'Unknown Player'
            }));

          if (activePlayers.length === 0) {
            addToOutput('No other players are currently available for trading.');
            return;
          }

          setActivePlayers(activePlayers);
          addToOutput([
            'Available Players:',
            ...activePlayers.map((p, i) => `${i + 1}. ${p.name} (${p.address.slice(0, 6)}...)`),
            '',
            'Type the player number to trade with them (e.g., "select 1")',
            'Or search by name using "search_player <name>"'
          ]);
          setAwaitingTrade(true);
        } catch (error) {
          console.error('Error fetching players:', error);
          addToOutput('Failed to fetch players. Try again later.');
        }
      } else if (choice === '3') {
        addToOutput([
          'Enter the wallet address of the player you want to trade with.',
          'Format: search <wallet address>',
          'Or type "back" to return to trading options'
        ]);
        setSearchMode(true);
      }

    } else if (cmd.startsWith('search_player ')) {
      const searchTerm = cmd.slice(13).toLowerCase();
      if (!activePlayers || activePlayers.length === 0) {
        // Fetch players if not already loaded
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        
        try {
          const snapshot = await get(usersRef);
          const users = snapshot.val() || {};
          
          const allPlayers = Object.entries(users)
            .filter(([address]) => address !== wallet)
            .map(([address, data]) => ({
              address,
              name: data.gameData?.name || 'Unknown Player'
            }));
          
          setActivePlayers(allPlayers);
          
          const matchingPlayers = allPlayers.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.address.toLowerCase().includes(searchTerm)
          );

          if (matchingPlayers.length === 0) {
            addToOutput('No players found matching your search.');
            return;
          }

          addToOutput([
            'Matching Players:',
            ...matchingPlayers.map((p, i) => `${i + 1}. ${p.name} (${p.address.slice(0, 6)}...)`),
            '',
            'Type "select <number>" to choose a player',
            'Or search again with "search_player <name>"'
          ]);
          setActivePlayers(matchingPlayers);
          setAwaitingTrade(true);
        } catch (error) {
          console.error('Error fetching players:', error);
          addToOutput('Failed to fetch players. Try again later.');
        }
      } else {
        const matchingPlayers = activePlayers.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.address.toLowerCase().includes(searchTerm)
        );

        if (matchingPlayers.length === 0) {
          addToOutput('No players found matching your search.');
          return;
        }

        addToOutput([
          'Matching Players:',
          ...matchingPlayers.map((p, i) => `${i + 1}. ${p.name} (${p.address.slice(0, 6)}...)`),
          '',
          'Type "select <number>" to choose a player',
          'Or search again with "search_player <name>"'
        ]);
        setActivePlayers(matchingPlayers);
        setAwaitingTrade(true);
      }

    } else if (searchMode && cmd.startsWith('search ')) {
      const searchAddress = cmd.slice(7).toLowerCase();
      const db = getDatabase();
      const userRef = ref(db, `users/${searchAddress}`);
      
      try {
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        
        if (!userData) {
          addToOutput('No player found with that wallet address.');
          return;
        }

        const player = {
          address: searchAddress,
          name: userData.gameData?.name || 'Unknown Player'
        };

        setSelectedPlayer(player);
        setSearchMode(false);
        
        // Show trading options with the selected player
        addToOutput([
          `Trading with ${player.name}:`,
          'Your Inventory:',
          ...(playerData.inventory || []).map((item, i) => `${i + 1}. ${item}`),
          '',
          'Commands:',
          '- offer <item_number> <gold>: Offer an item and/or gold',
          '- cancel: Cancel trading',
          `Your gold: ${playerData.gold || 0}`
        ]);
      } catch (error) {
        console.error('Error searching for player:', error);
        addToOutput('Failed to search for player. Try again later.');
      }

    } else if (cmd === 'back' && searchMode) {
      setSearchMode(false);
      setAwaitingTradeType(true);
      addToOutput([
        'Trading Options:',
        '1. Shop (buy items)',
        '2. Trade with Players',
        '3. Search Player by Wallet',
        '',
        'Type 1, 2, or 3 to choose'
      ]);

    } else if (cmd.startsWith('select ') && awaitingTrade) {
      const playerNum = parseInt(cmd.slice(7)) - 1;
      if (isNaN(playerNum) || playerNum < 0 || playerNum >= activePlayers.length) {
        addToOutput('Invalid player number. Please try again.');
        return;
      }

      const selectedPlayer = activePlayers[playerNum];
      setSelectedPlayer(selectedPlayer);
      
      // Show trading options with the selected player
      addToOutput([
        `Trading with ${selectedPlayer.name}:`,
        'Your Inventory:',
        ...(playerData.inventory || []).map((item, i) => `${i + 1}. ${item}`),
        '',
        'Commands:',
        '- offer <item_number> <gold>: Offer an item and/or gold',
        '- cancel: Cancel trading',
        `Your gold: ${playerData.gold || 0}`
      ]);

    } else if (cmd === 'trades') {
      const db = getDatabase();
      const tradesRef = ref(db, 'trades');
      
      try {
        const snapshot = await get(tradesRef);
        const trades = snapshot.val() || {};
        
        const pendingTrades = Object.entries(trades)
          .filter(([_, trade]) => 
            trade.status === 'pending' && 
            (trade.from === wallet || trade.to === wallet)
          )
          .map(([id, trade]) => ({
            id,
            ...trade
          }));

        if (pendingTrades.length === 0) {
          addToOutput('No pending trades.');
          setPendingTradeIds([]);
          return;
        }

        // Store trade IDs for easy access
        setPendingTradeIds(pendingTrades.map(t => t.id));

        const tradeMessages = pendingTrades.map((trade, index) => {
          const isIncoming = trade.to === wallet;
          const otherParty = isIncoming ? trade.from : trade.to;
          const direction = isIncoming ? 'From' : 'To';
          
          let itemText = '';
          if (trade.itemIndex >= 0) {
            const inventory = isIncoming ? 
              allPlayers.find(p => p.address === trade.from)?.inventory : 
              playerData.inventory;
            const itemName = inventory?.[trade.itemIndex] || 'Unknown Item';
            itemText = `Item: ${itemName}`;
          }

          return `Trade #${index + 1} | ${direction}: ${otherParty.slice(0, 6)}... | ` +
                 `${itemText}${itemText && trade.goldAmount ? ' | ' : ''}` +
                 `${trade.goldAmount ? `Gold: ${trade.goldAmount}` : ''}` +
                 `${isIncoming ? ' | Type "accept ' + (index + 1) + '" to accept' : ''}`;
        });

        addToOutput([
          'Pending Trades:',
          ...tradeMessages,
          '',
          'Commands:',
          '- accept <number>: Accept a trade (e.g., "accept 1")',
          '- decline <number>: Decline a trade (e.g., "decline 1")'
        ]);

      } catch (error) {
        console.error('Error fetching trades:', error);
        addToOutput('Failed to fetch trades. Try again later.');
      }

    } else if (cmd.startsWith('decline ')) {
      const tradeNum = parseInt(cmd.split(' ')[1]);
      if (isNaN(tradeNum) || tradeNum < 1 || tradeNum > pendingTradeIds.length) {
        addToOutput('Please specify a valid trade number.');
        return;
      }

      const tradeId = pendingTradeIds[tradeNum - 1];
      const db = getDatabase();
      const tradeRef = ref(db, `trades/${tradeId}`);
      
      try {
        const snapshot = await get(tradeRef);
        const trade = snapshot.val();

        if (!trade || trade.status !== 'pending') {
          addToOutput('Trade not found or already completed.');
          return;
        }
        
        // Verify trade is for this player
        if (trade.to !== wallet && trade.from !== wallet) {
          addToOutput('This trade is not for you.');
          return;
        }
        
        await set(tradeRef, {
          ...trade,
          status: 'declined'
        });

        addToOutput('Trade declined successfully.');

      } catch (error) {
        console.error('Error declining trade:', error);
        addToOutput('Failed to decline trade. Try again later.');
      }

    } else if (cmd.startsWith('accept ')) {
      const tradeNum = parseInt(cmd.split(' ')[1]);
      if (isNaN(tradeNum) || tradeNum < 1 || tradeNum > pendingTradeIds.length) {
        addToOutput('Please specify a valid trade number.');
        return;
      }

      const tradeId = pendingTradeIds[tradeNum - 1];
      try {
        const result = await acceptTrade(tradeId, wallet);
        if (result.success) {
          addToOutput('Trade completed successfully!');
          // Refresh trades list
          const trades = document.createElement('div');
          trades.click();
        } else {
          addToOutput('Failed to complete trade: ' + (result.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Trade error:', error);
        addToOutput('Failed to accept trade. Try again later.');
      }

    } else if (cmd === 'inventory') {
      const inventory = playerData.inventory || [];
      if (inventory.length === 0) {
        addToOutput('Your inventory is empty. Use "trade" to buy items!');
      } else {
        addToOutput([
          'Your Inventory:',
          ...inventory.map((item, i) => `${i + 1}. ${item}`),
          '',
          'Gold: ' + (playerData.gold || 0)
        ]);
      }
    } else if (cmd === 'quit') {
      // Save progress before quitting
      if (playerData) {
        try {
          await savePlayerData(playerData);
          addToOutput('Progress saved!');
        } catch (error) {
          console.error('Error saving progress:', error);
        }
      }

      addToOutput([
        'Thanks for playing Enchanted Miners!',
        'Your progress has been saved.',
        'Refresh the page to start a new session.'
      ]);

      // Reset game state
      setWallet(null);
      setPlayerData(null);
      setCommand('');
      setOutput(['Welcome to Enchanted Miners! Connect your wallet to begin.']);
      setInBattle(false);
      setCurrentEnemy(null);
      setCurrentNpc(null);
      setCanTalkToNpc(false);
      setExplorationSpot(null);
      setCanExplore(false);
      setIsNewPlayer(false);
      setCharacterCreation({ step: 0, name: '', house: '' });
    } else if (cmd === 'leaderboard') {
      try {
        const db = getDatabase();
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        const users = snapshot.val();

        if (!users) {
          addToOutput('No players found on the leaderboard yet!');
          return;
        }

        // Transform the data and filter out invalid entries
        const leaderboardData = Object.entries(users)
          .filter(([_, userData]) => 
            userData && 
            userData.gameData && 
            userData.gameData.name && 
            userData.gameData.house && 
            typeof userData.gameData.level === 'number'
          )
          .map(([_, userData]) => ({
            name: userData.gameData.name,
            house: userData.gameData.house,
            level: userData.gameData.level,
            gold: userData.gameData.gold || 0,
            progress: userData.gameData.districtProgress || 0
          }))
          .sort((a, b) => {
            // Sort by level first, then by gold
            if (b.level !== a.level) {
              return b.level - a.level;
            }
            return b.gold - a.gold;
          })
          .slice(0, 5);

        if (leaderboardData.length === 0) {
          addToOutput('No valid player data found on the leaderboard yet!');
          return;
        }

        addToOutput([
          '🏆 Top Miners Leaderboard 🏆',
          '----------------------------',
          ...leaderboardData.map((player, index) => 
            `${index + 1}. ${player.name} (House ${player.house}) - Level ${player.level} - ${player.gold} Gold - ${player.progress}% Progress`
          ),
          '----------------------------',
          'Rankings based on level and gold earned.'
        ]);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        addToOutput([
          'Failed to fetch leaderboard.',
          'Error: ' + error.message,
          'Please try again later.'
        ]);
      }
    } else if (cmd === 'attack') {
      if (!inBattle || !currentEnemy) {
        addToOutput('There is nothing to fight here.');
        return;
      }

      const playerDamage = Math.floor(Math.random() * 20) + 10;
      const enemyHp = currentEnemy.hp - playerDamage;
      setCurrentEnemy({ ...currentEnemy, hp: enemyHp });

      const messages = [`You strike ${currentEnemy.name} for ${playerDamage} damage!`];

      if (enemyHp <= 0) {
        const reward = currentEnemy.reward || 50;
        const updatedData = {
          ...playerData,
          gold: (playerData.gold || 0) + reward
        };

        // Boss defeated
        if (playerData.districtProgress === 100) {
          const completedDistricts = [...(playerData.completedDistricts || []), playerData.currentDistrict];
          updatedData.completedDistricts = completedDistricts;
          updatedData.currentDistrict = null;
          updatedData.districtProgress = 0;
          
          // Level up if completing a district for the first time
          if (!playerData.completedDistricts?.includes(playerData.currentDistrict)) {
            updatedData.level = (playerData.level || 1) + 1;
            messages.push(
              `🎊 You've defeated ${currentEnemy.name}! 🎊`,
              `Earned ${reward} gold!`,
              '🌟 Level Up! 🌟',
              `You are now level ${updatedData.level}!`,
              'District completed! Use "start" to choose a new one.'
            );
          } else {
            messages.push(
              `🎊 You've defeated ${currentEnemy.name}! 🎊`,
              `Earned ${reward} gold!`,
              'District completed! Use "start" to choose a new one.'
            );
          }
        } else {
          messages.push(
            `Victory! ${currentEnemy.name} defeated!`,
            `Earned ${reward} gold!`
          );
        }

        await savePlayerData(updatedData);
        setCurrentEnemy(null);
        setInBattle(false);
      } else {
        messages.push(`${currentEnemy.name}'s HP: ${enemyHp}`);
        
        const enemyDamage = Math.floor(Math.random() * (currentEnemy.damage || 20));
        const playerHp = (playerData.hp || 100) - enemyDamage;
        
        messages.push(
          `${currentEnemy.name} hits you for ${enemyDamage} damage!`,
          `Your HP: ${playerHp}`
        );

        if (playerHp <= 0) {
          const goldLoss = Math.floor((playerData.gold || 0) * 0.1);
          const updatedData = {
            ...playerData,
            hp: 100,
            gold: Math.max(0, (playerData.gold || 0) - goldLoss),
            districtProgress: 0 // Reset to 0% on death
          };
          await savePlayerData(updatedData);

          messages.push(
            '💀 Defeated!',
            `Lost ${goldLoss} gold...`,
            'HP restored to 100.',
            'Progress reset to 0%...'
          );

          setCurrentEnemy(null);
          setInBattle(false);
        } else {
          await savePlayerData({
            ...playerData,
            hp: playerHp
          });
        }
      }

      addToOutput(messages);

    } else if (cmd === 'flee') {
      if (!inBattle || !currentEnemy) {
        addToOutput('There is nothing to flee from!');
        return;
      }

      const fleeChance = Math.random() * 100;
      if (fleeChance < 25) {
        const goldLoss = Math.floor((playerData.gold || 0) * 0.05); // 5% gold loss
        const progressLoss = playerData.districtProgress === 100 ? 25 : 10; // Lose more progress if fleeing from boss
        const updatedData = {
          ...playerData,
          gold: Math.max(0, (playerData.gold || 0) - goldLoss),
          districtProgress: Math.max(0, playerData.districtProgress - progressLoss)
        };
        await savePlayerData(updatedData);

        addToOutput([
          'You successfully fled from the battle!',
          `Lost ${goldLoss} gold for fleeing...`,
          `Lost ${progressLoss}% district progress...`
        ]);

        setCurrentEnemy(null);
        setInBattle(false);
      } else {
        const enemyDamage = Math.floor(Math.random() * (currentEnemy.damage || 20));
        const playerHp = (playerData.hp || 100) - enemyDamage;
        
        const messages = [
          'Failed to flee!',
          `${currentEnemy.name} hits you for ${enemyDamage} damage!`,
          `Your HP: ${playerHp}`
        ];

        if (playerHp <= 0) {
          const goldLoss = Math.floor((playerData.gold || 0) * 0.1);
          const updatedData = {
            ...playerData,
            hp: 100,
            gold: Math.max(0, (playerData.gold || 0) - goldLoss),
            districtProgress: 0 // Reset to 0% on death
          };
          await savePlayerData(updatedData);

          messages.push(
            '💀 Defeated!',
            `Lost ${goldLoss} gold...`,
            'HP restored to 100.',
            'Progress reset to 0%...'
          );

          setCurrentEnemy(null);
          setInBattle(false);
        } else {
          await savePlayerData({
            ...playerData,
            hp: playerHp
          });
        }

        addToOutput(messages);
      }
    } else if (cmd === 'cancel' && selectedPlayer) {
      setSelectedPlayer(null);
      setAwaitingTrade(false);
      setAwaitingTradeType(true);
      addToOutput([
        'Trading cancelled.',
        '',
        'Trading Options:',
        '1. Shop (buy items)',
        '2. Trade with Players',
        '3. Search Player by Wallet',
        '',
        'Type 1, 2, or 3 to choose'
      ]);

    } else if (cmd.startsWith('offer ') && selectedPlayer) {
      const parts = cmd.slice(6).trim().split(' ');
      let itemIndex = -1;
      let goldAmount = 0;

      // Parse item index and gold amount
      if (parts.length >= 1) {
        itemIndex = parseInt(parts[0]) - 1; // Convert to 0-based index
      }
      if (parts.length >= 2) {
        goldAmount = parseInt(parts[1]);
      }

      // Validate inputs
      if (parts.length === 0) {
        addToOutput('Please specify an item number and/or gold amount.');
        return;
      }

      if (!isNaN(itemIndex) && (itemIndex < -1 || itemIndex >= (playerData.inventory || []).length)) {
        addToOutput('Invalid item number. Please check your inventory and try again.');
        return;
      }

      if (!isNaN(goldAmount) && (goldAmount < 0 || goldAmount > (playerData.gold || 0))) {
        addToOutput('Invalid gold amount. You cannot offer more gold than you have.');
        return;
      }

      if (itemIndex === -1 && goldAmount === 0) {
        addToOutput('You must offer at least an item or some gold.');
        return;
      }

      // Create the trade
      try {
        const db = getDatabase();
        const newTradeRef = push(ref(db, 'trades'));
        const tradeData = {
          from: wallet,
          to: selectedPlayer.address,
          itemIndex: itemIndex,
          goldAmount: goldAmount,
          status: 'pending',
          timestamp: serverTimestamp()
        };

        await set(newTradeRef, tradeData);

        addToOutput([
          'Trade offer sent!',
          itemIndex >= 0 ? `Item: ${playerData.inventory[itemIndex]}` : '',
          goldAmount > 0 ? `Gold: ${goldAmount}` : '',
          '',
          'The other player will be notified of your offer.',
          'Type "trades" to view your pending trades.'
        ].filter(line => line !== ''));

        // Reset trading state
        setSelectedPlayer(null);
        setAwaitingTrade(false);
        setAwaitingTradeType(true);

      } catch (error) {
        console.error('Error creating trade:', error);
        addToOutput('Failed to create trade. Please try again later.');
      }
    }

    // ... rest of the code remains the same ...

    // Unknown command
    addToOutput('Unknown command. Type "help" for available commands.');
  }, [inBattle, currentEnemy, playerData, savePlayerData, addToOutput, isNewPlayer, characterCreation, wallet, districtChoices, awaitingDistrictChoice, awaitingTrade, tradeItems, selectedPlayer, awaitingTradeType, activePlayers, allPlayers, searchMode, pendingTradeIds]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (command.trim()) {
      addToOutput(`> ${command}`);
      handleCommand(command.toLowerCase().trim());
      setCommand('');
    }
  }, [command, addToOutput, handleCommand]);

  useEffect(() => {
    if (!wallet) return;

    const db = getDatabase();
    const playersRef = ref(db, 'players');
    
    // Update player's last active timestamp
    const updateActiveStatus = async () => {
      const playerRef = ref(db, `players/${wallet}`);
      await update(playerRef, {
        lastActive: serverTimestamp(),
        name: playerData?.name || 'Unknown Player',
        district: playerData?.currentDistrict || 'No District'
      });
    };

    // Update status every minute
    updateActiveStatus();
    const interval = setInterval(updateActiveStatus, 60000);

    // Listen for active players
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const players = snapshot.val() || {};
      const now = Date.now();
      const activePlayersList = Object.entries(players)
        .filter(([address, player]) => {
          // Consider players active if they've been online in the last 5 minutes
          const lastActive = player.lastActive ? new Date(player.lastActive).getTime() : 0;
          return address !== wallet && (now - lastActive) < 300000;
        })
        .map(([address, player]) => ({
          address,
          name: player.name || 'Unknown Player',
          district: player.district || 'No District'
        }));
      
      setActivePlayers(activePlayersList);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [wallet, playerData?.name, playerData?.currentDistrict]);

  useEffect(() => {
    if (!wallet) return;

    const db = getDatabase();
    const playersRef = ref(db, 'players');
    
    // Update player's data
    const updatePlayerData = async () => {
      const playerRef = ref(db, `players/${wallet}`);
      await update(playerRef, {
        lastActive: serverTimestamp(),
        name: playerData?.name || 'Unknown Player',
        district: playerData?.currentDistrict || 'No District'
      });
    };

    // Update status every minute
    updatePlayerData();
    const interval = setInterval(updatePlayerData, 60000);

    // Listen for all players
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const players = snapshot.val() || {};
      const now = Date.now();
      const playersList = Object.entries(players)
        .filter(([address]) => address !== wallet)
        .map(([address, player]) => {
          const lastActive = player.lastActive ? new Date(player.lastActive).getTime() : 0;
          const isOnline = (now - lastActive) < 300000; // 5 minutes
          return {
            address,
            name: player.name || 'Unknown Player',
            district: player.district || 'No District',
            isOnline
          };
        });
      
      setAllPlayers(playersList);
    });

    return () => {
      clearInterval(interval);
      unsubscribe();
    };
  }, [wallet, playerData?.name, playerData?.currentDistrict]);

  return (
    <div className="game-container min-h-screen bg-gray-900 text-green-400 p-4">
      {!wallet ? (
        <GameLogin onLogin={handleLogin} />
      ) : (
        <div className="game-interface max-w-4xl mx-auto">
          <div 
            ref={outputRef}
            className="game-output bg-black p-4 rounded-lg mb-4 h-[600px] overflow-y-auto font-mono"
          >
            {output.map((line, index) => (
              <div key={index} className="output-line whitespace-pre-wrap mb-1">{line}</div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Enter command..."
              className="w-full p-3 bg-black text-green-400 border-2 border-green-400 rounded-lg font-mono 
                       focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
                       placeholder-green-700"
            />
            <div className="absolute right-3 top-3 text-green-700 text-sm">
              Type 'help' for commands
            </div>
          </form>
          {playerData && (
            <div className="player-stats mt-4 bg-black p-4 rounded-lg font-mono">
              <h3 className="text-xl mb-2">Player Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <p>HP: {playerData.hp}/{playerData.maxHp}</p>
                <p>Level: {playerData.level}</p>
                <p>EXP: {playerData.exp}</p>
                <p>Gold: {playerData.gold}</p>
                <p>Attack: {playerData.attack}</p>
                <p>Defense: {playerData.defense}</p>
              </div>
              <div className="action-buttons mt-4">
                <button onClick={() => handleCommand('run')} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">Run</button>
                <button onClick={() => handleCommand('attack')} className="px-4 py-2 bg-red-500 text-white rounded">Attack</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnchantedRealm;
