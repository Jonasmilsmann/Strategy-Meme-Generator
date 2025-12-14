import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { db, calculateMemeScore } from '../../services/instantdb';
import { id } from '@instantdb/react';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/branding';

interface VoteButtonsProps {
  memeId: string;
  votes: any[];
}

const VoteButtons: React.FC<VoteButtonsProps> = ({ memeId, votes }) => {
  const { user } = useAuth();
  const [voting, setVoting] = useState(false);

  // Calculate current score
  const { score, upvotes, downvotes } = calculateMemeScore(votes);

  // Check user's current vote
  const userVote = votes.find((v: any) => v.userId === user?.id);
  const currentVote = userVote?.value || 0;

  const handleVote = async (value: number) => {
    if (!user || voting) return;

    setVoting(true);
    try {
      if (userVote) {
        // Update existing vote
        if (currentVote === value) {
          // Remove vote if clicking the same button
          await db.transact([db.tx.votes[userVote.id].delete()]);
        } else {
          // Change vote
          await db.transact([
            db.tx.votes[userVote.id].update({
              value,
            }),
          ]);
        }
      } else {
        // Create new vote
        await db.transact([
          db.tx.votes[id()].update({
            memeId,
            userId: user.id,
            value,
          }),
        ]);
      }
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Upvote Button */}
      <button
        onClick={() => handleVote(1)}
        disabled={voting}
        className={`p-2 rounded-md transition-all hover:bg-opacity-80 disabled:opacity-50 ${
          currentVote === 1 ? 'text-white' : 'text-gray-600'
        }`}
        style={{
          backgroundColor: currentVote === 1 ? '#28a745' : '#f0f0f0',
        }}
        title="Upvote"
      >
        <FaArrowUp size={18} />
      </button>

      {/* Score Display */}
      <div className="flex flex-col items-center px-3">
        <div
          className="text-2xl font-bold"
          style={{
            color: score > 0 ? '#28a745' : score < 0 ? '#dc3545' : COLORS.text,
          }}
        >
          {score > 0 ? '+' : ''}
          {score}
        </div>
        <div className="text-xs text-gray-500">
          {upvotes} ↑ {downvotes} ↓
        </div>
      </div>

      {/* Downvote Button */}
      <button
        onClick={() => handleVote(-1)}
        disabled={voting}
        className={`p-2 rounded-md transition-all hover:bg-opacity-80 disabled:opacity-50 ${
          currentVote === -1 ? 'text-white' : 'text-gray-600'
        }`}
        style={{
          backgroundColor: currentVote === -1 ? '#dc3545' : '#f0f0f0',
        }}
        title="Downvote"
      >
        <FaArrowDown size={18} />
      </button>
    </div>
  );
};

export default VoteButtons;
