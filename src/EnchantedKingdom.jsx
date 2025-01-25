import React, { useState } from 'react';

const EnchantedKingdom = () => {
    const levels = [
        "Level 1: You find yourself in a dark forest. What do you do? (type 'explore' to search the forest)",
        "Level 2: You encounter a mysterious creature. What will you say? (type 'talk' to communicate)",
        "Level 3: The creature offers you a challenge. Accept? (type 'accept' or 'decline')",
        // Add more levels up to Level 15
    ];

    const [currentLevel, setCurrentLevel] = useState(0);
    const [inventory, setInventory] = useState([]);
    const [output, setOutput] = useState('');
    const [command, setCommand] = useState('');

    const displayPrompt = () => {
        return levels[currentLevel];
    };

    const displayInventory = () => {
        return inventory.length === 0 ? 'Your inventory is empty.' : `Inventory: ${inventory.join(', ')}`;
    };

    const handleCommand = (e) => {
        e.preventDefault();
        let newOutput = '';
        switch (command.toLowerCase()) {
            case 'explore':
                if (currentLevel === 0) {
                    newOutput = 'You explore the forest and find a hidden path.';
                    setInventory([...inventory, 'Hidden Path']);
                    setCurrentLevel(currentLevel + 1);
                } else {
                    newOutput = 'You wander around but find nothing new.';
                }
                break;
            case 'run':
                newOutput = 'You run through the area, searching for something exciting!';
                break;
            case 'talk':
                if (currentLevel === 1) {
                    newOutput = 'The creature listens to you.';
                    setCurrentLevel(currentLevel + 1);
                } else {
                    newOutput = 'You cannot talk to anyone here.';
                }
                break;
            case 'fight':
                newOutput = 'You prepare for a fight!';
                break;
            case 'inventory':
                newOutput = displayInventory();
                break;
            case 'accept':
                if (currentLevel === 2) {
                    newOutput = 'You accepted the challenge!';
                    setCurrentLevel(currentLevel + 1);
                } else {
                    newOutput = 'There is no challenge to accept here.';
                }
                break;
            case 'decline':
                if (currentLevel === 2) {
                    newOutput = 'You declined the challenge and escaped.';
                    setCurrentLevel(currentLevel + 1);
                } else {
                    newOutput = 'There is no challenge to decline here.';
                }
                break;
            default:
                newOutput = 'Unknown command.';
                break;
        }
        setOutput(newOutput);
        setCommand('');
    };

    return (
        <div>
            <h1>Enchanted Kingdom</h1>
            <p>{displayPrompt()}</p>
            <form onSubmit={handleCommand}>
                <input 
                    type="text" 
                    value={command} 
                    onChange={(e) => setCommand(e.target.value)} 
                    placeholder="Enter command..."
                />
                <button type="submit">Submit</button>
            </form>
            <p>{output}</p>
        </div>
    );
};

export default EnchantedKingdom;
