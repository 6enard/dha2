import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const storageService = {
  // Upload document to Firestore as base64
  async uploadDocument(file: File, type: 'resume' | 'coverLetter' | 'portfolio', userId: string): Promise<string> {
    try {
      // Validate file size (5MB limit for Firestore)
      const maxSize = 5 * 1024 * 1024; // 5MB (reduced from 10MB due to Firestore limits)
      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
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

      console.log('Converting file to base64...');
      
      // Convert file to base64
      const base64Data = await this.fileToBase64(file);
      
      const timestamp = Date.now();
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const documentId = `${userId}_${type}_${timestamp}`;
      
      // Store document data in Firestore
      const documentData = {
        id: documentId,
        userId,
        type,
        fileName: cleanFileName,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64Data,
        uploadedAt: new Date(),
        uploadedBy: userId
      };

      console.log('Storing document in Firestore...');
      
      // Store in documents collection
      await setDoc(doc(db, 'documents', documentId), documentData);
      
      console.log('Document stored successfully with ID:', documentId);
      
      // Return the document ID as the "URL"
      return documentId;
    } catch (error) {
      console.error('Error uploading document:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('File size')) {
          throw error;
        } else if (error.message.includes('file format')) {
          throw error;
        }
        throw new Error(`Upload failed: ${error.message}`);
      }
      
      throw new Error('Failed to upload document. Please try again.');
    }
  },

  // Convert file to base64
  async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  },

  // Get document data from Firestore
  async getDocument(documentId: string): Promise<{
    fileName: string;
    fileType: string;
    base64Data: string;
    originalName: string;
  } | null> {
    try {
      const docRef = doc(db, 'documents', documentId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          fileName: data.fileName,
          fileType: data.fileType,
          base64Data: data.base64Data,
          originalName: data.originalName
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  },

  // Create download URL for base64 data
  createDownloadUrl(base64Data: string, fileType: string): string {
    const blob = this.base64ToBlob(base64Data, fileType);
    return URL.createObjectURL(blob);
  },

  // Convert base64 to blob
  base64ToBlob(base64Data: string, fileType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: fileType });
  },

  // Upload profile picture (keeping for compatibility)
  async uploadProfilePicture(file: File, userId: string): Promise<string> {
    try {
      // For profile pictures, we'll use the same Firestore approach
      const maxSize = 2 * 1024 * 1024; // 2MB for images
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 2MB');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload JPEG, PNG, GIF, or WebP images only');
      }

      const base64Data = await this.fileToBase64(file);
      const timestamp = Date.now();
      const documentId = `${userId}_profile_${timestamp}`;
      
      const imageData = {
        id: documentId,
        userId,
        type: 'profile',
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        base64Data,
        uploadedAt: new Date()
      };

      await setDoc(doc(db, 'documents', documentId), imageData);
      return documentId;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    }
  }
};