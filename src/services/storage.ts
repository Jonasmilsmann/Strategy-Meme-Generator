import { db } from './instantdb';
import { id } from '@instantdb/react';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export interface SavedMeme {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  userId: string;
  userEmail: string;
  createdAt: number;
}

// Check if Cloudinary is configured
export const isCloudinaryConfigured = (): boolean => {
  return (
    CLOUDINARY_CLOUD_NAME !== undefined &&
    CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    CLOUDINARY_UPLOAD_PRESET !== undefined &&
    CLOUDINARY_UPLOAD_PRESET !== 'your_cloudinary_upload_preset'
  );
};

// Upload image to Cloudinary
export const uploadToCloudinary = async (blob: Blob, filename: string): Promise<string> => {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary ist nicht konfiguriert. Bitte füge deine Credentials in der .env Datei hinzu.');
  }

  const formData = new FormData();
  formData.append('file', blob, filename);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload fehlgeschlagen');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Fallback: Convert blob to base64 for direct storage in InstantDB
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Save meme to InstantDB (with Cloudinary or base64)
export const saveMemeToCloud = async (
  title: string,
  imageBlob: Blob,
  thumbnailBlob: Blob,
  userId: string,
  userEmail: string
): Promise<string> => {
  try {
    let imageUrl: string;
    let thumbnailUrl: string;

    // Try Cloudinary first, fallback to base64
    if (isCloudinaryConfigured()) {
      const timestamp = Date.now();
      imageUrl = await uploadToCloudinary(imageBlob, `meme_${timestamp}.png`);
      thumbnailUrl = await uploadToCloudinary(thumbnailBlob, `thumb_${timestamp}.png`);
    } else {
      console.warn('Cloudinary not configured, using base64 storage (not recommended for production)');
      imageUrl = await blobToBase64(imageBlob);
      thumbnailUrl = await blobToBase64(thumbnailBlob);
    }

    // Save to InstantDB
    const memeId = id();
    await db.transact([
      db.tx.memes[memeId].update({
        title,
        imageUrl,
        thumbnailUrl,
        userId,
        userEmail,
        createdAt: Date.now(),
      }),
    ]);

    return memeId;
  } catch (error) {
    console.error('Error saving meme:', error);
    throw error;
  }
};

// Load all memes for public feed (using query)
export const loadAllMemes = async (): Promise<SavedMeme[]> => {
  try {
    const data = await db.queryOnce({
      memes: {
        $: {
          order: {
            serverCreatedAt: 'desc',
          },
        },
      },
    });

    return (data?.memes || []) as SavedMeme[];
  } catch (error) {
    console.error('Error loading memes:', error);
    throw error;
  }
};

// Load user's memes (using query)
export const loadUserMemes = async (userId: string): Promise<SavedMeme[]> => {
  try {
    const data = await db.queryOnce({
      memes: {
        $: {
          where: {
            userId,
          },
          order: {
            serverCreatedAt: 'desc',
          },
        },
      },
    });

    return (data?.memes || []) as SavedMeme[];
  } catch (error) {
    console.error('Error loading user memes:', error);
    throw error;
  }
};

// Delete meme
export const deleteMeme = async (memeId: string): Promise<void> => {
  try {
    await db.transact([db.tx.memes[memeId].delete()]);
  } catch (error) {
    console.error('Error deleting meme:', error);
    throw error;
  }
};

// Local download
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
