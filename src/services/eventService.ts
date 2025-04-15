// src/services/eventService.ts
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  getDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event } from '../types/event';

const EVENTS_COLLECTION = 'events';

// Create a new event
export const createEvent = async (eventData: Omit<Event, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, EVENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Get a single event by ID
export const getEventById = async (id: string): Promise<Event> => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Event not found');
    }
    
    return {
      id: docSnap.id,
      ...docSnap.data()
    } as Event;
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

// Update an event
export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<void> => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...eventData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

// Delete an event
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

// Get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION), 
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting events by category:', error);
    throw error;
  }
};

// Get upcoming events
export const getUpcomingEvents = async (eventLimit: number = 10): Promise<Event[]> => {
  try {
    const now = new Date().toISOString();
    const q = query(
      collection(db, EVENTS_COLLECTION),
      where("startTime", ">=", now),
      orderBy("startTime"),
      limit(eventLimit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting upcoming events:', error);
    throw error;
  }
};

// Get popular events
export const getPopularEvents = async (eventLimit: number = 10): Promise<Event[]> => {
  try {
    const q = query(
      collection(db, EVENTS_COLLECTION),
      orderBy("registrationCount", "desc"),
      limit(eventLimit)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error('Error getting popular events:', error);
    throw error;
  }
};