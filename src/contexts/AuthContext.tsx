import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService } from '../services/userService';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: { firstName: string; lastName: string; phone?: string; role: 'applicant' | 'hr' }) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, userData: { firstName: string; lastName: string; phone?: string; role: 'applicant' | 'hr' }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Update the display name
    await updateProfile(firebaseUser, {
      displayName: `${userData.firstName} ${userData.lastName}`
    });

    // Create user profile in Firestore
    const userProfile: User = {
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      displayName: `${userData.firstName} ${userData.lastName}`,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      createdAt: new Date()
    };

    await userService.createOrUpdateUserProfile(userProfile);
  };

  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Check if user profile exists in Firestore
          let userProfile = await userService.getUserProfile(firebaseUser.uid);
          
          if (!userProfile) {
            // Create new user profile
            const role = userService.isAdmin(firebaseUser.email || '') ? 'admin' : 'hr';
            userProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              role,
              createdAt: new Date()
            };
            
            await userService.createOrUpdateUserProfile(userProfile);
          }
          
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Error setting up user profile:', error);
          // Fallback to basic user data
          const role = userService.isAdmin(firebaseUser.email || '') ? 'admin' : 'hr';
          setCurrentUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
            role,
            createdAt: new Date()
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};