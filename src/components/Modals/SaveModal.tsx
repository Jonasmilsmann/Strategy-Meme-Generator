import React, { useState } from 'react';
import { FaTimes, FaSave, FaExclamationTriangle } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { saveMemeToCloud, isCloudinaryConfigured } from '../../services/storage';
import { isInstantDBConfigured } from '../../services/instantdb';
import { COLORS } from '../../constants/branding';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSaved }) => {
  const { canvas } = useMeme();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isConfigured = isInstantDBConfigured();

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!canvas || !title.trim()) {
      setError('Bitte gib einen Titel ein');
      return;
    }

    if (!isConfigured || !user) {
      setError('InstantDB ist nicht konfiguriert oder du bist nicht angemeldet.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Erstelle Thumbnail (kleiner)
      const thumbnailDataUrl = canvas.toDataURL({
        format: 'png',
        quality: 0.8,
        multiplier: 0.3,
      });

      // Erstelle Full-Size Bild
      const fullDataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 1,
      });

      // Konvertiere DataURL zu Blob
      const thumbnailBlob = await (await fetch(thumbnailDataUrl)).blob();
      const fullBlob = await (await fetch(fullDataUrl)).blob();

      // Speichere in InstantDB
      await saveMemeToCloud(title, fullBlob, thumbnailBlob, user.id, user.email || 'Unknown');

      setSaving(false);
      setTitle('');
      onSaved();
      onClose();
    } catch (err: any) {
      console.error('Error saving meme:', err);
      setError(err.message || 'Fehler beim Speichern. Bitte versuche es erneut.');
      setSaving(false);
    }
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
            Meme in der Cloud speichern
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100"
            style={{ color: COLORS.text }}
            disabled={saving}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {!isConfigured && (
            <div 
              className="p-3 rounded-md flex gap-3"
              style={{ backgroundColor: '#fff3cd', color: '#856404' }}
            >
              <FaExclamationTriangle className="flex-shrink-0 mt-1" />
              <div className="text-sm">
                <strong>InstantDB nicht konfiguriert</strong>
                <p className="mt-1">
                  Bitte füge deine InstantDB App ID in der <code>.env</code> Datei hinzu.
                </p>
              </div>
            </div>
          )}

          {!isCloudinaryConfigured() && isConfigured && (
            <div 
              className="p-3 rounded-md flex gap-3"
              style={{ backgroundColor: '#d1ecf1', color: '#0c5460' }}
            >
              <div className="text-sm">
                ℹ️ Cloudinary nicht konfiguriert. Bilder werden als Base64 gespeichert (nicht empfohlen für Produktion).
              </div>
            </div>
          )}

          {/* Titel */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.text }}>
              Titel für dein Meme
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              className="w-full p-3 border rounded-md"
              style={{ borderColor: error ? '#dc3545' : '#e0e0e0' }}
              placeholder="z.B. Lustiges Meeting-Meme"
              disabled={saving || !isConfigured}
              autoFocus
            />
            {error && (
              <p className="text-sm mt-1" style={{ color: '#dc3545' }}>
                {error}
              </p>
            )}
          </div>

          {/* Info */}
          <div 
            className="p-3 rounded-md text-sm"
            style={{ backgroundColor: COLORS.lightGray, color: COLORS.text }}
          >
            Dein Meme wird in InstantDB gespeichert und erscheint im öffentlichen Feed.
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 px-4 py-2 rounded-md font-medium border transition-all hover:bg-gray-50 disabled:opacity-50"
            style={{ borderColor: '#e0e0e0', color: COLORS.text }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !title.trim() || !isConfigured}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: COLORS.primary, color: COLORS.white }}
          >
            <FaSave />
            {saving ? 'Speichert...' : 'Speichern'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;

