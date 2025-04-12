// src/services/authService.ts
import { getAuth, getIdToken as firebaseGetIdToken } from 'firebase/auth';

// Get the current user's ID token
export const getIdToken = async (): Promise<string> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  try {
    const token = await firebaseGetIdToken(user);
    // Optionally store in localStorage for reuse
    localStorage.setItem('authToken', token);
    return token;
  } catch (error) {
    console.error('Error getting ID token:', error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const auth = getAuth();
  return !!auth.currentUser;
};

// Get current user ID
export const getCurrentUserId = (): string | null => {
  const auth = getAuth();
  return auth.currentUser?.uid || null;
};