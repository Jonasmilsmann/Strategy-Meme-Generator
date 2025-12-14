import React from 'react';
import { FaSave, FaDownload, FaImage, FaTicketAlt, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../constants/branding';

interface AppHeaderProps {
  onSave?: () => void;
  onDownload?: () => void;
  canSave?: boolean;
  currentPage?: 'generator' | 'feed' | 'invites';
  onNavigate?: (page: 'generator' | 'feed' | 'invites') => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ 
  onSave, 
  onDownload, 
  canSave = false,
  currentPage = 'generator',
  onNavigate 
}) => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    if (confirm('Möchtest du dich wirklich abmelden?')) {
      await signOut();
    }
  };

  return (
    <header 
      className="flex items-center justify-between px-6 py-4 shadow-md"
      style={{ backgroundColor: COLORS.white, borderBottomColor: COLORS.accent, borderBottomWidth: '2px' }}
    >
      {/* Logo & Brand */}
      <div className="flex items-center gap-4">
        <img 
          src="/strategy-logo.svg" 
          alt="Strategy Logo" 
          className="h-10 w-10"
        />
        <h1 
          className="text-2xl font-bold"
          style={{ color: COLORS.primary }}
        >
          Strategy Meme Generator
        </h1>
      </div>

      {/* Navigation */}
      {onNavigate && (
        <nav className="flex gap-2">
          <button
            onClick={() => onNavigate('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              currentPage === 'generator'
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: currentPage === 'generator' ? COLORS.primary : 'transparent',
            }}
          >
            <FaImage />
            Generator
          </button>
          <button
            onClick={() => onNavigate('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              currentPage === 'feed'
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: currentPage === 'feed' ? COLORS.primary : 'transparent',
            }}
          >
            📱
            Feed
          </button>
          <button
            onClick={() => onNavigate('invites')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
              currentPage === 'invites'
                ? 'text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={{
              backgroundColor: currentPage === 'invites' ? COLORS.primary : 'transparent',
            }}
          >
            <FaTicketAlt />
            Invite-Codes
          </button>
        </nav>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        {/* Save & Download (only on generator page) */}
        {currentPage === 'generator' && onSave && onDownload && (
          <>
            <button
              onClick={onSave}
              disabled={!canSave}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 disabled:opacity-50"
              style={{ 
                backgroundColor: COLORS.primary, 
                color: COLORS.white 
              }}
            >
              <FaSave />
              <span className="hidden md:inline">Speichern</span>
            </button>
            <button
              onClick={onDownload}
              disabled={!canSave}
              className="flex items-center gap-2 px-4 py-2 rounded-md font-medium border transition-all hover:bg-gray-50 disabled:opacity-50"
              style={{ 
                borderColor: COLORS.primary, 
                color: COLORS.primary 
              }}
            >
              <FaDownload />
              <span className="hidden md:inline">Download</span>
            </button>
          </>
        )}

        {/* User Email */}
        {user && (
          <div className="hidden md:block text-sm text-gray-600">
            {user.email}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:bg-red-50"
          style={{ color: '#dc3545' }}
          title="Abmelden"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;
