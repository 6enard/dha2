import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

export const storageService = {
  // Upload document to Firebase Storage
  async uploadDocument(file: File, type: 'resume' | 'coverLetter' | 'portfolio', userId: string): Promise<string> {
    try {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 10MB');
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload PDF, DOC, DOCX, or TXT files only');
      }

      const timestamp = Date.now();
      // Clean filename to avoid issues
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${timestamp}_${cleanFileName}`;
      const storageRef = ref(storage, `applications/${userId}/${type}/${fileName}`);
      
      console.log('Uploading file to:', `applications/${userId}/${type}/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          uploadedBy: userId,
          uploadedAt: new Date().toISOString()
        }
      });
      
      console.log('File uploaded successfully, getting download URL...');
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('storage/unauthorized')) {
          throw new Error('You do not have permission to upload files. Please sign in and try again.');
        } else if (error.message.includes('storage/canceled')) {
          throw new Error('Upload was canceled. Please try again.');
        } else if (error.message.includes('storage/unknown')) {
          throw new Error('An unknown error occurred during upload. Please try again.');
        } else if (error.message.includes('storage/invalid-format')) {
          throw new Error('Invalid file format. Please upload PDF, DOC, DOCX, or TXT files only.');
        } else if (error.message.includes('storage/object-not-found')) {
          throw new Error('Upload failed. Please try again.');
        } else if (error.message.includes('CORS')) {
          throw new Error('Upload configuration error. Please contact support.');
        }
        throw error;
      }
      
      throw new Error('Failed to upload document. Please try again.');
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