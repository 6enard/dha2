import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const storageService = {
  // Upload document to Firebase Storage
  async uploadDocument(file: File, type: 'resume' | 'coverLetter' | 'portfolio', userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `documents/${type}/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Upload profile picture
  async uploadProfilePicture(file: File, userId: string): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `profile-images/${userId}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
};