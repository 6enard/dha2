import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Job } from '../types';

const COLLECTION_NAME = 'jobs';

export const jobService = {
  // Create a new job
  async createJob(jobData: Omit<Job, 'id' | 'createdDate'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...jobData,
        createdDate: Timestamp.now(),
        status: 'active'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  // Get all jobs
  async getAllJobs(): Promise<Job[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('createdDate', 'desc'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdDate: doc.data().createdDate?.toDate() || new Date()
      })) as Job[];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Update job
  async updateJob(jobId: string, updates: Partial<Job>): Promise<void> {
    try {
      const jobRef = doc(db, COLLECTION_NAME, jobId);
      await updateDoc(jobRef, updates);
    } catch (error) {
      console.error('Error updating job:', error);
      throw error;
    }
  },

  // Delete job
  async deleteJob(jobId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
};