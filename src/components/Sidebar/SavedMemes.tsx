import React, { useState, useEffect } from 'react';
import { FaTrash, FaDownload, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import { fabric } from 'fabric';
import { useMeme } from '../../contexts/MemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { loadUserMemes, deleteMeme, downloadImage, SavedMeme } from '../../services/storage';
import { COLORS } from '../../constants/branding';

const SavedMemes: React.FC = () => {
  const { canvas } = useMeme();
  const { isConfigured } = useAuth();
  const [memes, setMemes] = useState<SavedMeme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadMemes = async () => {
    if (!isConfigured) return;
    
    setLoading(true);
    setError('');
    
    try {
      const loadedMemes = await loadUserMemes();
      setMemes(loadedMemes);
    } catch (err) {
      console.error('Error loading memes:', err);
      setError('Fehler beim Laden der Memes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMemes();
  }, [isConfigured]);

  const handleLoadMeme = (meme: SavedMeme) => {
    if (!canvas) return;

    fabric.Image.fromURL(meme.imageUrl, (img) => {
      const maxWidth = 800;
      const maxHeight = 600;
      
      const scale = Math.min(
        maxWidth / (img.width || 1),
        maxHeight / (img.height || 1)
      );

      canvas.setWidth((img.width || maxWidth) * scale);
      canvas.setHeight((img.height || maxHeight) * scale);

      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        scaleX: scale,
        scaleY: scale,
      });
    }, { crossOrigin: 'anonymous' });
  };

  const handleDeleteMeme = async (memeId: string) => {
    if (!confirm('Möchtest du dieses Meme wirklich löschen?')) return;

    try {
      await deleteMeme(memeId);
      setMemes(memes.filter(m => m.id !== memeId));
    } catch (err) {
      console.error('Error deleting meme:', err);
      alert('Fehler beim Löschen des Memes');
    }
  };

  const handleDownloadMeme = async (meme: SavedMeme) => {
    try {
      // Download von URL
      const response = await fetch(meme.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      downloadImage(url, `${meme.title}.png`);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading meme:', err);
      alert('Fehler beim Herunterladen des Memes');
    }
  };

  if (!isConfigured) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
          Gespeicherte Memes
        </h3>
        <div 
          className="p-4 rounded-md flex gap-3"
          style={{ backgroundColor: '#fff3cd', color: '#856404' }}
        >
          <FaExclamationTriangle className="flex-shrink-0 mt-1" />
          <div className="text-sm">
            <strong>Firebase nicht konfiguriert</strong>
            <p className="mt-1">
              Bitte füge deine Firebase-Credentials in <code>src/services/firebase.ts</code> hinzu, um gespeicherte Memes anzuzeigen.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
          Gespeicherte Memes
        </h3>
        <button
          onClick={loadMemes}
          disabled={loading}
          className="p-2 rounded-md transition-all hover:bg-gray-100 disabled:opacity-50"
          style={{ color: COLORS.primary }}
          title="Aktualisieren"
        >
          <FaSync className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {error && (
        <div 
          className="p-3 rounded-md text-sm"
          style={{ backgroundColor: '#f8d7da', color: '#721c24' }}
        >
          {error}
        </div>
      )}

      {loading && memes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Lädt...
        </div>
      )}

      {!loading && memes.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">Noch keine gespeicherten Memes</p>
          <p className="text-xs mt-2">Erstelle ein Meme und speichere es in der Cloud</p>
        </div>
      )}

      {/* Meme Grid */}
      <div className="grid grid-cols-1 gap-4">
        {memes.map((meme) => (
          <div
            key={meme.id}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-all"
            style={{ borderColor: '#e0e0e0' }}
          >
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleLoadMeme(meme)}
            >
              <img
                src={meme.thumbnailUrl}
                alt={meme.title}
                className="w-full h-40 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                <span className="text-white font-medium opacity-0 group-hover:opacity-100">
                  Laden
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-white">
              <h4 className="font-medium text-sm truncate" style={{ color: COLORS.text }}>
                {meme.title}
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                {meme.createdAt.toDate().toLocaleDateString('de-DE')}
              </p>
              
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleDownloadMeme(meme)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-md text-xs font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: COLORS.lightGray, color: COLORS.text }}
                  title="Herunterladen"
                >
                  <FaDownload />
                  Download
                </button>
                <button
                  onClick={() => handleDeleteMeme(meme.id!)}
                  className="px-3 py-2 rounded-md text-xs font-medium transition-all hover:opacity-80"
                  style={{ backgroundColor: '#dc3545', color: COLORS.white }}
                  title="Löschen"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedMemes;

