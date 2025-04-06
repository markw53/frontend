export interface Event {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface User {
    id: string;
    email: string;
    displayName?: string;
    role: 'user' | 'staff';
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
  }