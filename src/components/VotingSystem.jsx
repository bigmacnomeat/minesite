import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { ref, onValue, set, get } from 'firebase/database';

const VotingSystem = () => {
  const [votes, setVotes] = useState([]);
  const [userWallet, setUserWallet] = useState('');
  const [error, setError] = useState('');

  // Load and listen to votes from Firebase
  useEffect(() => {
    const votesRef = ref(db, 'votes');
    
    const unsubscribe = onValue(votesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const votesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
          yesCount: Object.values(value.votes?.yes || {}).length,
          noCount: Object.values(value.votes?.no || {}).length,
        }))
        .sort((a, b) => b.timestamp - a.timestamp);
        setVotes(votesArray);
      } else {
        setVotes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const castVote = async (voteId, choice) => {
    try {
      if (!userWallet) {
        setError('Please enter your wallet address to vote');
        return;
      }

      // Check if wallet has already voted
      const voteRef = ref(db, `votes/${voteId}/votes`);
      const snapshot = await get(voteRef);
      const voteData = snapshot.val() || { yes: {}, no: {} };
      
      // Check both yes and no votes for the wallet
      if (Object.keys(voteData.yes).includes(userWallet) || 
          Object.keys(voteData.no).includes(userWallet)) {
        setError('This wallet has already voted');
        return;
      }

      // Add the vote
      await set(ref(db, `votes/${voteId}/votes/${choice}/${userWallet}`), true);
      setError('');
    } catch (error) {
      setError('Failed to cast vote: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-500/20 text-red-300 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-800 rounded-xl p-6">
        {/* Wallet Input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={userWallet}
            onChange={(e) => setUserWallet(e.target.value)}
            className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white mb-2"
          />
        </div>

        {/* List of votes */}
        <div className="space-y-4">
          {votes.map((vote) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-700 rounded-lg p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-mine-crystal">{vote.title}</h3>
                <div className="text-sm text-gray-400">
                  Ends: {new Date(vote.endDate).toLocaleString()}
                </div>
              </div>
              <p className="text-gray-300 mb-4">{vote.description}</p>
              
              {/* Vote counts */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-green-400 text-2xl font-bold">{vote.yesCount}</div>
                  <div className="text-gray-400">Yes Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-red-400 text-2xl font-bold">{vote.noCount}</div>
                  <div className="text-gray-400">No Votes</div>
                </div>
              </div>

              {/* Voting buttons */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => castVote(vote.id, 'yes')}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-300 px-6 py-2 rounded-lg transition-colors"
                >
                  Vote Yes
                </button>
                <button
                  onClick={() => castVote(vote.id, 'no')}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-6 py-2 rounded-lg transition-colors"
                >
                  Vote No
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VotingSystem;
