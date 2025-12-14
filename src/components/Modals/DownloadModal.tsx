import React, { useState } from 'react';
import { FaTimes, FaDownload } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { downloadImage } from '../../services/storage';
import { COLORS } from '../../constants/branding';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ isOpen, onClose }) => {
  const { canvas } = useMeme();
  const [filename, setFilename] = useState('meme');
  const [format, setFormat] = useState<'png' | 'jpg'>('png');
  const [quality, setQuality] = useState(1.0);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!canvas) return;

    const dataUrl = canvas.toDataURL({
      format: format === 'png' ? 'png' : 'jpeg',
      quality: quality,
      multiplier: 1,
    });

    const fullFilename = `${filename}.${format}`;
    downloadImage(dataUrl, fullFilename);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Meme herunterladen
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
            style={{ color: COLORS.text }}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Dateiname */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Dateiname
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full p-2 border rounded-md"
              style={{ borderColor: '#e0e0e0' }}
              placeholder="meme"
            />
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Format
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('png')}
                className="flex-1 p-3 rounded-md border-2 font-medium transition-all"
                style={{
                  borderColor: format === 'png' ? COLORS.primary : '#e0e0e0',
                  backgroundColor: format === 'png' ? COLORS.primary : 'transparent',
                  color: format === 'png' ? COLORS.white : COLORS.text,
                }}
              >
                PNG
                <div className="text-xs opacity-80 mt-1">Hohe Qualität</div>
              </button>
              <button
                onClick={() => setFormat('jpg')}
                className="flex-1 p-3 rounded-md border-2 font-medium transition-all"
                style={{
                  borderColor: format === 'jpg' ? COLORS.primary : '#e0e0e0',
                  backgroundColor: format === 'jpg' ? COLORS.primary : 'transparent',
                  color: format === 'jpg' ? COLORS.white : COLORS.text,
                }}
              >
                JPG
                <div className="text-xs opacity-80 mt-1">Kleinere Datei</div>
              </button>
            </div>
          </div>

          {/* Qualität (nur bei JPG) */}
          {format === 'jpg' && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                Qualität: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.05"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Vorschau-Info */}
          <div 
            className="p-3 rounded-md text-sm"
            style={{ backgroundColor: COLORS.lightGray, color: COLORS.text }}
          >
            <strong>Datei:</strong> {filename}.{format}
            <br />
            <strong>Format:</strong> {format.toUpperCase()}
            {format === 'jpg' && (
              <>
                <br />
                <strong>Qualität:</strong> {Math.round(quality * 100)}%
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md font-medium border transition-all hover:bg-gray-50"
            style={{ borderColor: '#e0e0e0', color: COLORS.text }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:opacity-90"
            style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
          >
            <FaDownload />
            Herunterladen
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;

