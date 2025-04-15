// src/utils/seedDatabase.ts
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { sampleEvents } from '../data/sampleEvents';

export const seedEvents = async (): Promise<void> => {
  try {
    // Check if events already exist
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    if (!snapshot.empty) {
      console.log('Database already has events. Skipping seed.');
      return;
    }
    
    // Add sample events to Firestore
    const promises = sampleEvents.map(event => {
      // Remove the id as Firestore will generate one
      const { id, ...eventData } = event;
      return addDoc(collection(db, 'events'), {
        ...eventData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });
    
    await Promise.all(promises);
    console.log('Database seeded successfully with sample events!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};