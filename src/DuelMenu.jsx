import React from 'react';

const DuelMenu = ({ onClose }) => {
  return (
    <div className="duel-menu">
      <h2>Duel Options</h2>
      <button onClick={onClose}>Close Menu</button>
      {/* Add more options here */}
      <button onClick={() => alert('Start Duel!')}>Start Duel</button>
      <button onClick={() => alert('View Duel History')}>Duel History</button>
    </div>
  );
};

export default DuelMenu;
