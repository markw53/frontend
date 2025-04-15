// src/data/sampleEvents.ts
import { Event } from '../types/event';
import { EventTag } from '../enums/EventTag';
import { User } from '../types/user';

// Helper function to create dates relative to today
const createDate = (daysFromNow: number, hours: number = 18): Date => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hours, 0, 0, 0);
  return date;
};

// Example usage of createDate
const exampleDate = createDate(5); // Creates a date 5 days from now
console.log('Example Date:', exampleDate);

// Format date for event data
const formatEventDate = (date: Date): string => {
  return date.toISOString();
};

// Example usage of formatEventDate
console.log('Formatted Example Date:', formatEventDate(exampleDate));

export const sampleEvents: Event[] = [
  // All your sample events as before
];

// Sample user with interests
export const sampleUser: User = {
  uid: 'user123',
  email: 'user@example.com',
  displayName: 'Test User',
  role: 'user',
  photoURL: null,
  interests: ['Technology', 'Education', EventTag.BEGINNER_FRIENDLY, EventTag.FREE],
  registeredEvents: ['5', '9'] // User has registered for events with IDs 5 and 9
};