import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from '../types';

const COLLECTION_NAME = 'users';

export const userService = {
  // Get user profile
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, COLLECTION_NAME, uid));
      
      if (userDoc.exists()) {
        return {
          uid,
          ...userDoc.data()
        } as User;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Create or update user profile
  async createOrUpdateUserProfile(user: User): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTION_NAME, user.uid), {
        email: user.email,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt || new Date()
      });
    } catch (error) {
      console.error('Error creating/updating user profile:', error);
      throw error;
    }
  },

  // Check if user is admin
  isAdmin(email: string): boolean {
    const adminEmails = ['6enard@gmail.com'];
    return adminEmails.includes(email.toLowerCase());
  }
};