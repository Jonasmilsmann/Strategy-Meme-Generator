import React from 'react';
import { FaTrash, FaUser } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { deleteMeme } from '../../services/storage';
import { COLORS } from '../../constants/branding';
import VoteButtons from './VoteButtons';

interface MemeCardProps {
  meme: {
    id: string;
    title: string;
    imageUrl: string;
    thumbnailUrl: string;
    userId: string;
    userEmail: string;
    createdAt: number;
  };
  votes: any[];
  onDelete?: () => void;
}

const MemeCard: React.FC<MemeCardProps> = ({ meme, votes, onDelete }) => {
  const { user } = useAuth();
  const [deleting, setDeleting] = React.useState(false);

  const isOwner = user?.id === meme.userId;
  const memeVotes = votes.filter(v => v.memeId === meme.id);

  const handleDelete = async () => {
    if (!isOwner || !confirm('Möchtest du dieses Meme wirklich löschen?')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteMeme(meme.id);
      onDelete?.();
    } catch (error) {
      console.error('Error deleting meme:', error);
      alert('Fehler beim Löschen des Memes');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-105">
      {/* Image */}
      <div className="relative aspect-square bg-gray-100">
        <img
          src={meme.thumbnailUrl || meme.imageUrl}
          alt={meme.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3
          className="font-semibold text-lg mb-2 truncate"
          style={{ color: COLORS.text }}
        >
          {meme.title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <FaUser size={12} />
          <span>{meme.userEmail}</span>
        </div>

        {/* Voting */}
        <div className="flex items-center justify-between">
          <VoteButtons memeId={meme.id} votes={memeVotes} />

          {/* Delete Button (only for owner) */}
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-2 rounded-md transition-all hover:bg-red-100 disabled:opacity-50"
              style={{ color: '#dc3545' }}
              title="Meme löschen"
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* Date */}
        <div className="text-xs text-gray-400 mt-3">
          {new Date(meme.createdAt).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  );
};

export default MemeCard;

