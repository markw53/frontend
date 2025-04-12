// src/types/auth.ts
export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'user' | 'staff' | 'admin';
  photoURL: string | null;
}

export interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>;
  getIdToken: () => Promise<string>; // Add this line
}