// src/services/userService.ts
import { 
    doc, 
    getDoc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    collection,
    query,
    where,
    getDocs
  } from 'firebase/firestore';
  import { db, auth } from '../config/firebase';
  import { User } from '../types/user';
  
  const USERS_COLLECTION = 'users';
  const USER_EVENTS_COLLECTION = 'userEvents';
  
  /**
   * Get the current user's ID
   * @returns The current user's ID or null if not authenticated
   */
  export const getCurrentUserId = (): string | null => {
    return auth.currentUser?.uid || null;
  };
  
  /**
   * Get a user by ID
   * @param userId The user ID
   * @returns The user data
   */
  export const getUserById = async (userId: string): Promise<User> => {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        throw new Error('User not found');
      }
      
      return {
        uid: userSnap.id,
        ...userSnap.data()
      } as User;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  };
  
  /**
   * Get the current user's data
   * @returns The current user's data
   */
  export const getCurrentUser = async (): Promise<User | null> => {
    const userId = getCurrentUserId();
    if (!userId) return null;
    
    try {
      return await getUserById(userId);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };
  
  /**
   * Create or update a user profile
   * @param userData The user data to save
   * @returns Promise that resolves when the operation is complete
   */
  export const saveUserProfile = async (userData: Partial<User>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        // Update existing user
        await updateDoc(userRef, {
          ...userData,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create new user
        await setDoc(userRef, {
          uid: userId,
          email: auth.currentUser?.email || '',
          displayName: auth.currentUser?.displayName || '',
          photoURL: auth.currentUser?.photoURL || null,
          role: 'user', // Default role
          interests: [],
          registeredEvents: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...userData
        });
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };
  
  /**
   * Update a user's interests
   * @param interests Array of interests
   * @returns Promise that resolves when the operation is complete
   */
  export const updateUserInterests = async (interests: string[]): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        interests,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw error;
    }
  };
  
  /**
   * Get a user's interests
   * @param userId The user ID
   * @returns Array of user interests
   */
  export const getUserInterests = async (userId: string): Promise<string[]> => {
    try {
      const user = await getUserById(userId);
      return user.interests || [];
    } catch (error) {
      console.error('Error getting user interests:', error);
      return [];
    }
  };
  
  /**
   * Register a user for an event
   * @param eventId The event ID
   * @returns Promise that resolves when the operation is complete
   */
  export const registerForEvent = async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      // Add event to user's registered events
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        registeredEvents: arrayUnion(eventId),
        updatedAt: new Date().toISOString()
      });
      
      // Create a record in userEvents collection
      const userEventRef = doc(db, USER_EVENTS_COLLECTION, `${userId}_${eventId}`);
      await setDoc(userEventRef, {
        userId,
        eventId,
        registeredAt: new Date().toISOString(),
        status: 'registered'
      });
      
      // Increment event registration count
      // This would typically be done in a Cloud Function to ensure atomicity
      // For now, we'll just log that this should happen
      console.log(`Event ${eventId} registration count should be incremented`);
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  };
  
  /**
   * Unregister a user from an event
   * @param eventId The event ID
   * @returns Promise that resolves when the operation is complete
   */
  export const unregisterFromEvent = async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      // Remove event from user's registered events
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        registeredEvents: arrayRemove(eventId),
        updatedAt: new Date().toISOString()
      });
      
      // Update the record in userEvents collection
      const userEventRef = doc(db, USER_EVENTS_COLLECTION, `${userId}_${eventId}`);
      await updateDoc(userEventRef, {
        status: 'unregistered',
        unregisteredAt: new Date().toISOString()
      });
      
      // Decrement event registration count
      // This would typically be done in a Cloud Function to ensure atomicity
      console.log(`Event ${eventId} registration count should be decremented`);
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  };
  
  /**
   * Check if a user is registered for an event
   * @param eventId The event ID
   * @returns Boolean indicating if the user is registered
   */
  export const isUserRegisteredForEvent = async (eventId: string): Promise<boolean> => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    try {
      const user = await getUserById(userId);
      return user.registeredEvents?.includes(eventId) || false;
    } catch (error) {
      console.error('Error checking event registration:', error);
      return false;
    }
  };
  
  /**
   * Get all events a user is registered for
   * @param userId The user ID
   * @returns Array of event IDs
   */
  export const getUserRegisteredEvents = async (userId: string): Promise<string[]> => {
    try {
      const user = await getUserById(userId);
      return user.registeredEvents || [];
    } catch (error) {
      console.error('Error getting user registered events:', error);
      return [];
    }
  };
  
  /**
   * Get all users registered for an event
   * @param eventId The event ID
   * @returns Array of user IDs
   */
  export const getUsersRegisteredForEvent = async (eventId: string): Promise<string[]> => {
    try {
      const q = query(
        collection(db, USER_EVENTS_COLLECTION),
        where("eventId", "==", eventId),
        where("status", "==", "registered")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data().userId);
    } catch (error) {
      console.error('Error getting users registered for event:', error);
      return [];
    }
  };
  
  /**
   * Add an event to user's favorites
   * @param eventId The event ID
   * @returns Promise that resolves when the operation is complete
   */
  export const addEventToFavorites = async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        favoriteEvents: arrayUnion(eventId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding event to favorites:', error);
      throw error;
    }
  };
  
  /**
   * Remove an event from user's favorites
   * @param eventId The event ID
   * @returns Promise that resolves when the operation is complete
   */
  export const removeEventFromFavorites = async (eventId: string): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        favoriteEvents: arrayRemove(eventId),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error removing event from favorites:', error);
      throw error;
    }
  };
  
  /**
   * Check if an event is in user's favorites
   * @param eventId The event ID
   * @returns Boolean indicating if the event is in favorites
   */
  export const isEventInFavorites = async (eventId: string): Promise<boolean> => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    try {
      const user = await getUserById(userId);
      return user.favoriteEvents?.includes(eventId) || false;
    } catch (error) {
      console.error('Error checking if event is in favorites:', error);
      return false;
    }
  };
  
  /**
   * Get user's favorite events
   * @returns Array of event IDs
   */
  export const getUserFavoriteEvents = async (): Promise<string[]> => {
    const userId = getCurrentUserId();
    if (!userId) return [];
    
    try {
      const user = await getUserById(userId);
      return user.favoriteEvents || [];
    } catch (error) {
      console.error('Error getting user favorite events:', error);
      return [];
    }
  };
  
  /**
   * Update user's notification preferences
   * @param preferences Notification preferences object
   * @returns Promise that resolves when the operation is complete
   */
  export const updateNotificationPreferences = async (preferences: Record<string, boolean>): Promise<void> => {
    const userId = getCurrentUserId();
    if (!userId) throw new Error('User not authenticated');
    
    try {
      const userRef = doc(db, USERS_COLLECTION, userId);
      await updateDoc(userRef, {
        notificationPreferences: preferences,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  };
  
  /**
   * Get user's notification preferences
   * @returns Notification preferences object
   */
  export const getNotificationPreferences = async (): Promise<Record<string, boolean>> => {
    const userId = getCurrentUserId();
    if (!userId) return {};
    
    try {
      const user = await getUserById(userId);
      return user.notificationPreferences || {};
    } catch (error) {
      console.error('Error getting notification preferences:', error);
      return {};
    }
  };
  
  /**
   * Check if a user has admin role
   * @returns Boolean indicating if the user is an admin
   */
  export const isUserAdmin = async (): Promise<boolean> => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    try {
      const user = await getUserById(userId);
      return user.role === 'admin';
    } catch (error) {
      console.error('Error checking if user is admin:', error);
      return false;
    }
  };
  
  /**
   * Check if a user has staff role
   * @returns Boolean indicating if the user is staff
   */
  export const isUserStaff = async (): Promise<boolean> => {
    const userId = getCurrentUserId();
    if (!userId) return false;
    
    try {
      const user = await getUserById(userId);
      return user.role === 'staff' || user.role === 'admin';
    } catch (error) {
      console.error('Error checking if user is staff:', error);
      return false;
    }
  };
  
  const userService = {
    getCurrentUserId,
    getUserById,
    getCurrentUser,
    saveUserProfile,
    updateUserInterests,
    getUserInterests,
    registerForEvent,
    unregisterFromEvent,
    isUserRegisteredForEvent,
    getUserRegisteredEvents,
    getUsersRegisteredForEvent,
    addEventToFavorites,
    removeEventFromFavorites,
    isEventInFavorites,
    getUserFavoriteEvents,
    updateNotificationPreferences,
    getNotificationPreferences,
    isUserAdmin,
    isUserStaff
  };
  
  export default userService;