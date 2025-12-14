import React, { useState } from 'react';
import { FaFire, FaClock, FaStar } from 'react-icons/fa';
import { db, calculateMemeScore } from '../../services/instantdb';
import { COLORS } from '../../constants/branding';
import LoadingSpinner from '../Common/LoadingSpinner';
import MemeCard from './MemeCard';

type SortOption = 'top' | 'new' | 'trending';

const MemeFeed: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortOption>('top');

  // Query memes and votes
  const { data, isLoading, error } = db.useQuery({
    memes: {},
    votes: {},
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div
          className="p-4 rounded-md"
          style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
        >
          Fehler beim Laden der Memes: {error.message}
        </div>
      </div>
    );
  }

  const memes = data?.memes || [];
  const votes = data?.votes || [];

  // Sort memes based on selected option
  const sortedMemes = [...memes].sort((a: any, b: any) => {
    switch (sortBy) {
      case 'top': {
        const scoreA = calculateMemeScore(votes.filter((v: any) => v.memeId === a.id)).score;
        const scoreB = calculateMemeScore(votes.filter((v: any) => v.memeId === b.id)).score;
        return scoreB - scoreA; // Highest score first
      }
      case 'new':
        return b.createdAt - a.createdAt; // Newest first
      case 'trending': {
        // Trending: Score weighted by recency (last 7 days)
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        
        const getTrendingScore = (meme: any) => {
          const age = now - meme.createdAt;
          const recencyWeight = Math.max(0, 1 - age / sevenDays);
          const score = calculateMemeScore(votes.filter((v: any) => v.memeId === meme.id)).score;
          return score * recencyWeight;
        };
        
        return getTrendingScore(b) - getTrendingScore(a);
      }
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: COLORS.primary }}
          >
            Meme Feed
          </h1>
          <p className="text-gray-600">
            Entdecke und bewerte die besten Memes der Community
          </p>
        </div>

        {/* Sort Options */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setSortBy('top')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              sortBy === 'top'
                ? 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: sortBy === 'top' ? COLORS.primary : undefined,
            }}
          >
            <FaStar />
            Top
          </button>
          <button
            onClick={() => setSortBy('new')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              sortBy === 'new'
                ? 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: sortBy === 'new' ? COLORS.primary : undefined,
            }}
          >
            <FaClock />
            Neu
          </button>
          <button
            onClick={() => setSortBy('trending')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              sortBy === 'trending'
                ? 'text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: sortBy === 'trending' ? COLORS.primary : undefined,
            }}
          >
            <FaFire />
            Trending
          </button>
        </div>

        {/* Memes Grid */}
        {sortedMemes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-xl text-gray-500">
              Noch keine Memes vorhanden. Sei der Erste und erstelle ein Meme!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedMemes.map((meme: any) => (
              <MemeCard key={meme.id} meme={meme} votes={votes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemeFeed;
