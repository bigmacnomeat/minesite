import React from 'react';
import './DuelModeSelect.css';

const DuelModeSelect = ({ onModeSelect, onClose }) => {
    const modes = [
        {
            id: 'campaign',
            name: 'Campaign',
            description: 'Journey through the crypto realms, battle unique enemies, and grow stronger',
            icon: '🏰'
        },
        {
            id: '1v1',
            name: '1v1 Battle',
            description: 'Challenge other players in intense one-on-one duels',
            icon: '⚔️'
        },
        {
            id: '2v2',
            name: '2v2 Battle',
            description: 'Team up with an ally to face off against other duos',
            icon: '👥'
        }
    ];

    return (
        <div className="duel-mode-select">
            <div className="duel-mode-header">
                <h2>Select Battle Mode</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="duel-modes">
                {modes.map(mode => (
                    <div 
                        key={mode.id}
                        className="duel-mode-card"
                        onClick={() => onModeSelect(mode.id)}
                    >
                        <div className="mode-icon">{mode.icon}</div>
                        <h3>{mode.name}</h3>
                        <p>{mode.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DuelModeSelect;
