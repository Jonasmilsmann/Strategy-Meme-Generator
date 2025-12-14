import React, { useState } from 'react';
import { fabric } from 'fabric';
import { FaImage } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { COLORS } from '../../constants/branding';

interface CanvasDropZoneProps {
  children: React.ReactNode;
}

const CanvasDropZone: React.FC<CanvasDropZoneProps> = ({ children }) => {
  const { canvas } = useMeme();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nur aktivieren wenn Dateien gezogen werden
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Nur deaktivieren wenn wir den Hauptbereich verlassen
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!canvas) return;

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        
        fabric.Image.fromURL(imageUrl, (img) => {
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
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  return (
    <div
      className="relative w-full h-full"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {children}
      
      {/* Drag Overlay */}
      {isDragging && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          style={{ backgroundColor: 'rgba(163, 32, 32, 0.1)' }}
        >
          <div 
            className="flex flex-col items-center gap-3 p-8 rounded-lg"
            style={{ 
              backgroundColor: COLORS.white,
              border: `3px dashed ${COLORS.primary}`,
            }}
          >
            <FaImage size={48} style={{ color: COLORS.primary }} />
            <p className="text-xl font-medium" style={{ color: COLORS.primary }}>
              Bild hier ablegen
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasDropZone;

