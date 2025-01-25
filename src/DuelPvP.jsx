import React, { useState } from 'react';
import './DuelPvP.css';

const DuelPvP = ({ mode, onClose }) => {
    const [searchingMatch, setSearchingMatch] = useState(false);
    const [matchFound, setMatchFound] = useState(false);
    const [opponent, setOpponent] = useState(null);

    const startMatchmaking = () => {
        setSearchingMatch(true);
        // Simulated matchmaking - would be replaced with actual matchmaking logic
        setTimeout(() => {
            setSearchingMatch(false);
            setMatchFound(true);
            setOpponent({
                name: "Player" + Math.floor(Math.random() * 1000),
                level: Math.floor(Math.random() * 20) + 1
            });
        }, 3000);
    };

    return (
        <div className="duel-pvp">
            <div className="pvp-header">
                <h2>{mode === '1v1' ? '1v1 Battle' : '2v2 Battle'}</h2>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="pvp-content">
                {!searchingMatch && !matchFound ? (
                    <div className="pvp-start">
                        <h3>Ready to Battle?</h3>
                        <p>Find a {mode === '1v1' ? 'worthy opponent' : 'team battle'} to test your skills!</p>
                        <button className="start-match-button" onClick={startMatchmaking}>
                            Start Matchmaking
                        </button>
                    </div>
                ) : searchingMatch ? (
                    <div className="searching-match">
                        <div className="loading-spinner"></div>
                        <p>Searching for {mode === '1v1' ? 'opponent' : 'players'}...</p>
                    </div>
                ) : (
                    <div className="match-found">
                        <h3>Match Found!</h3>
                        <p>Opponent: {opponent.name} (Level {opponent.level})</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DuelPvP;
