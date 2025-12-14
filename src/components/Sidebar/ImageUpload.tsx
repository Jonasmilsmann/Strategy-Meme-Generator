import React, { useRef, useState } from 'react';
import { fabric } from 'fabric';
import { FaUpload, FaImage } from 'react-icons/fa';
import { useMeme } from '../../contexts/MemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { uploadImage } from '../../services/storage';
import { COLORS } from '../../constants/branding';

const ImageUpload: React.FC = () => {
  const { canvas } = useMeme();
  const { isConfigured } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const loadImageToCanvas = async (file: File) => {
    if (!canvas) return;

    setLoading(true);

    try {
      // Bild lokal laden
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

          setUploadedImages(prev => [imageUrl, ...prev]);
          setLoading(false);
        });
      };
      reader.readAsDataURL(file);

      // Optional: In Firebase hochladen wenn konfiguriert
      if (isConfigured) {
        try {
          const cloudUrl = await uploadImage(file);
          console.log('Image uploaded to cloud:', cloudUrl);
        } catch (error) {
          console.error('Cloud upload failed:', error);
        }
      }
    } catch (error) {
      console.error('Error loading image:', error);
      setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await loadImageToCanvas(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Drag & Drop Handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (imageFile) {
      await loadImageToCanvas(imageFile);
    }
  };

  const loadUploadedImage = (imageUrl: string) => {
    if (!canvas) return;

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

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg" style={{ color: COLORS.text }}>
        Eigenes Bild hochladen
      </h3>

      {/* Upload Area with Drag & Drop */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="w-full flex flex-col items-center justify-center gap-3 p-6 border-2 border-dashed transition-all cursor-pointer disabled:opacity-50"
        style={{
          borderColor: isDragging ? COLORS.primary : COLORS.gray,
          backgroundColor: isDragging ? '#f9f9f9' : COLORS.white,
          color: COLORS.gray,
        }}
      >
        <FaUpload 
          className="text-3xl transition-all" 
          style={{ color: isDragging ? COLORS.primary : COLORS.gray }} 
        />
        <div className="text-center">
          <p className="font-medium" style={{ color: isDragging ? COLORS.primary : COLORS.text }}>
            {loading ? 'Lädt...' : isDragging ? 'Bild hier ablegen' : 'Bild hierher ziehen'}
          </p>
          <p className="text-xs mt-1" style={{ color: COLORS.gray }}>
            oder klicken zum Auswählen
          </p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <p className="text-xs text-gray-500">
        Unterstützte Formate: JPG, PNG, GIF
      </p>

      {/* Hochgeladene Bilder */}
      {uploadedImages.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2" style={{ color: COLORS.text }}>
            Hochgeladene Bilder
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {uploadedImages.map((imageUrl, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden border-2 transition-all hover:shadow-lg"
                style={{ borderColor: COLORS.gray }}
                onClick={() => loadUploadedImage(imageUrl)}
              >
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                  <FaImage className="text-white text-2xl opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;

