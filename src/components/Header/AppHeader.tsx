import React from 'react';
import { FaSave, FaDownload } from 'react-icons/fa';
import { BRANDING, COLORS } from '../../constants/branding';

interface AppHeaderProps {
  onSave: () => void;
  onDownload: () => void;
  canSave: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSave, onDownload, canSave }) => {
  return (
    <header 
      className="h-16 flex items-center justify-between px-6"
      style={{ backgroundColor: COLORS.black }}
    >
      {/* Logo */}
      <div className="flex items-center gap-4">
        <img 
          src="/strategy-logo.svg" 
          alt="Strategy&" 
          className="h-12"
          style={{ filter: 'brightness(0) invert(1)' }}
        />
        <div className="hidden sm:block h-8 w-px opacity-30" style={{ backgroundColor: COLORS.gray }} />
        <div className="hidden sm:block text-white text-base font-normal">
          Meme Generator
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDownload}
          disabled={!canSave}
          className="flex items-center gap-2 px-4 py-2 font-light text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-70"
          style={{
            color: COLORS.white,
          }}
        >
          <FaDownload size={14} />
          <span className="hidden sm:inline">Download</span>
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="flex items-center gap-2 px-5 py-2 font-light text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
          style={{
            backgroundColor: canSave ? COLORS.primary : '#666',
            color: COLORS.white,
          }}
        >
          <FaSave size={14} />
          <span className="hidden sm:inline">Speichern</span>
        </button>
      </div>
    </header>
  );
};

export default AppHeader;

