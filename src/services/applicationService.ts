import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Application } from '../types';

const COLLECTION_NAME = 'applications';

export const applicationService = {
  // Create a new application
  async createApplication(applicationData: Omit<Application, 'id' | 'appliedDate'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...applicationData,
        appliedDate: serverTimestamp(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  // Get all applications
  async getAllApplications(): Promise<Application[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('appliedDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: doc.data().appliedDate?.toDate() || new Date()
      })) as Application[];
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Get applications by status
  async getApplicationsByStatus(status: string): Promise<Application[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('status', '==', status),
        orderBy('appliedDate', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        appliedDate: doc.data().appliedDate?.toDate() || new Date()
      })) as Application[];
    } catch (error) {
      console.error('Error fetching applications by status:', error);
      throw error;
    }
  },

  // Update application status
  async updateApplicationStatus(applicationId: string, status: Application['status'], notes?: string): Promise<void> {
    try {
      const applicationRef = doc(db, COLLECTION_NAME, applicationId);
      const updateData: any = { status };
      
      if (notes) {
        updateData.notes = notes;
      }
      
      await updateDoc(applicationRef, updateData);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Update application
  async updateApplication(applicationId: string, updates: Partial<Application>): Promise<void> {
    try {
      const applicationRef = doc(db, COLLECTION_NAME, applicationId);
      await updateDoc(applicationRef, updates);
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  },

  // Delete application
  async deleteApplication(applicationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, applicationId));
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
};