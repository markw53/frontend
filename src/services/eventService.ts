// src/services/eventService.ts
import { collection, addDoc, updateDoc, doc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Event } from '../models/Event';

const EVENTS_COLLECTION = 'events';

export const createEvent = async (event: Partial<Event>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...event,
      startDate: event.startDate?.toISOString(),
      endDate: event.endDate?.toISOString(),
      createdAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, EVENTS_COLLECTION));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: new Date(doc.data().startDate),
      endDate: new Date(doc.data().endDate),
    } as Event));
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// New function to get events by category
export const getEventsByCategory = async (category: string): Promise<Event[]> => {
  try {
    const q = query(collection(db, EVENTS_COLLECTION), where("category", "==", category));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startDate: new Date(doc.data().startDate),
      endDate: new Date(doc.data().endDate),
    } as Event));
  } catch (error) {
    console.error('Error getting events by category:', error);
    throw error;
  }
};

// Other functions remain the same