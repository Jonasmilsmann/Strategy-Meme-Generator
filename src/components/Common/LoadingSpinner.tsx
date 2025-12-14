import React from 'react';
import { COLORS } from '../../constants/branding';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'medium', message }) => {
  const sizeMap = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeMap[size]} border-4 border-gray-200 rounded-full animate-spin`}
        style={{ borderTopColor: COLORS.primary }}
      />
      {message && (
        <p className="text-sm" style={{ color: COLORS.text }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

