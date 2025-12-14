import { init } from '@instantdb/react';

// Get App ID from environment variables
const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID;

if (!APP_ID || APP_ID === 'your_instantdb_app_id_here') {
  console.warn('⚠️ InstantDB App ID not configured. Please add VITE_INSTANTDB_APP_ID to your .env file.');
}

// Initialize InstantDB without type parameter (simpler approach)
export const db = init({ appId: APP_ID || 'placeholder' });

// Helper function to check if InstantDB is configured
export const isInstantDBConfigured = (): boolean => {
  return APP_ID !== undefined && APP_ID !== 'your_instantdb_app_id_here';
};

// Helper function to generate invite codes
export const generateInviteCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Helper function to calculate meme score
export const calculateMemeScore = (votes: any[]): { score: number; upvotes: number; downvotes: number } => {
  const upvotes = votes.filter((v: any) => v.value === 1).length;
  const downvotes = votes.filter((v: any) => v.value === -1).length;
  const score = upvotes - downvotes;
  return { score, upvotes, downvotes };
};

export default db;
