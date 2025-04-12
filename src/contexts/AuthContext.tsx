import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  getIdToken as firebaseGetIdToken
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User, AuthContextType } from '../types/auth';

// Create context with default values
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Sign up function
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
        
        // Here you would typically also store user role in your database
        // For now, we'll just set it as 'user' by default
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile function
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      setError(null);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName, photoURL: photoURL || null });
        
        // Update local user state
        setCurrentUser(prev => {
          if (prev) {
            return { ...prev, displayName, photoURL: photoURL || null };
          }
          return prev;
        });
      }
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Get ID token function for authenticated requests
  const getIdToken = async (): Promise<string> => {
    try {
      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }
      
      return await firebaseGetIdToken(auth.currentUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // For now, we'll set all users as 'user' role
        // In a real app, you'd fetch the role from your database
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'user', // Default role
          photoURL: user.photoURL
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUserProfile,
    getIdToken // Add the new function to the context value
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};