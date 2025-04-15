// src/types/user.ts
export interface User {
    uid: string;
    email: string | null; // Allow null
    displayName: string | null; // Allow null
    role: 'user' | 'staff' | 'admin';
    photoURL?: string | null; // Optional and allow null
    interests?: string[];
    registeredEvents?: string[];
    favoriteEvents?: string[];
    notificationPreferences?: Record<string, boolean>;
    createdAt?: string;
    updatedAt?: string;
    // Add other user properties as needed
  }