import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { ref, onValue, set, remove } from 'firebase/database';

const AdminDashboard = () => {
  const [votes, setVotes] = useState([]);
  const [newVote, setNewVote] = useState({
    title: '',
    description: '',
    endDate: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (!isAdmin) {
      navigate('/admin');
      return;
    }

    // Load votes
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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const vote = {
        title: newVote.title,
        description: newVote.description,
        endDate: new Date(newVote.endDate).toISOString(),
        timestamp: Date.now(),
        votes: {
          yes: {},
          no: {}
        }
      };
      
      // Add to Firebase
      const voteRef = ref(db, `votes/${Date.now()}`);
      await set(voteRef, vote);
      
      // Reset form
      setNewVote({
        title: '',
        description: '',
        endDate: '',
      });
      setError('');
    } catch (error) {
      setError('Failed to create vote: ' + error.message);
    }
  };

  const handleDeleteVote = async (voteId) => {
    try {
      await remove(ref(db, `votes/${voteId}`));
    } catch (error) {
      setError('Failed to delete vote: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mine-crystal">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 text-red-300 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Create new vote */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold text-mine-crystal mb-4">Create New Vote</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Vote Title"
              value={newVote.title}
              onChange={(e) => setNewVote({ ...newVote, title: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              required
            />
            <textarea
              placeholder="Description"
              value={newVote.description}
              onChange={(e) => setNewVote({ ...newVote, description: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white h-32"
              required
            />
            <input
              type="datetime-local"
              value={newVote.endDate}
              onChange={(e) => setNewVote({ ...newVote, endDate: e.target.value })}
              className="w-full bg-gray-700 rounded px-4 py-2 text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-mine-green/20 hover:bg-mine-green/30 text-mine-crystal rounded px-4 py-2 transition-colors"
            >
              Create Vote
            </button>
          </form>
        </div>

        {/* List of votes */}
        <div className="space-y-4">
          {votes.map((vote) => (
            <div key={vote.id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-mine-crystal">{vote.title}</h3>
                  <p className="text-gray-400">Created: {new Date(vote.timestamp).toLocaleString()}</p>
                  <p className="text-gray-400">Ends: {new Date(vote.endDate).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDeleteVote(vote.id)}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
              <p className="text-gray-300 mb-4">{vote.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-700 rounded">
                  <div className="text-2xl font-bold text-green-400">{vote.yesCount}</div>
                  <div className="text-gray-400">Yes Votes</div>
                </div>
                <div className="text-center p-4 bg-gray-700 rounded">
                  <div className="text-2xl font-bold text-red-400">{vote.noCount}</div>
                  <div className="text-gray-400">No Votes</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
