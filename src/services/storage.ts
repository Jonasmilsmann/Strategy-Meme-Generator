import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, doc, deleteDoc, query, orderBy, Timestamp } from 'firebase/firestore';
import { storage, db, auth } from './firebase';

export interface SavedMeme {
  id?: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Upload Bild zu Firebase Storage
export const uploadImage = async (file: File, folder: string = 'uploads'): Promise<string> => {
  try {
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, filename);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Speichere Meme in Firestore
export const saveMemeToCloud = async (
  title: string,
  imageBlob: Blob,
  thumbnailBlob: Blob
): Promise<string> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Upload Bilder
    const timestamp = Date.now();
    const imageFile = new File([imageBlob], `meme_${timestamp}.png`, { type: 'image/png' });
    const thumbnailFile = new File([thumbnailBlob], `thumb_${timestamp}.png`, { type: 'image/png' });

    const imageUrl = await uploadImage(imageFile, 'memes');
    const thumbnailUrl = await uploadImage(thumbnailFile, 'thumbnails');

    // Speichere Metadaten in Firestore
    const memeData: Omit<SavedMeme, 'id'> = {
      title,
      imageUrl,
      thumbnailUrl,
      userId: user.uid,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'memes'), memeData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving meme:', error);
    throw error;
  }
};

// Lade alle Memes des aktuellen Benutzers
export const loadUserMemes = async (): Promise<SavedMeme[]> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const q = query(
      collection(db, 'memes'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const memes: SavedMeme[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data() as Omit<SavedMeme, 'id'>;
      if (data.userId === user.uid) {
        memes.push({
          id: doc.id,
          ...data,
        });
      }
    });
    
    return memes;
  } catch (error) {
    console.error('Error loading memes:', error);
    throw error;
  }
};

// Lösche Meme
export const deleteMeme = async (memeId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'memes', memeId));
  } catch (error) {
    console.error('Error deleting meme:', error);
    throw error;
  }
};

// Lokaler Download
export const downloadImage = (dataUrl: string, filename: string): void => {
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

