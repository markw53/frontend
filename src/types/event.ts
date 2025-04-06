// Event interface represents a complete event object as returned from the API
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
  
  // EventFormData interface represents the data needed to create or update an event
  export interface EventFormData {
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    location: string;
    imageUrl?: string;
  }
  
  // EventSignup interface represents a user's signup for an event
  export interface EventSignup {
    id: string;
    eventId: string;
    userId: string;
    userName: string;
    signupDate: string;
    status: 'confirmed' | 'waitlisted' | 'cancelled';
  }
  
  // CalendarEvent interface represents an event formatted for calendar integration
  export interface CalendarEvent {
    summary: string;
    description: string;
    location: string;
    start: {
      dateTime: string;
      timeZone: string;
    };
    end: {
      dateTime: string;
      timeZone: string;
    };
  }
  
  // EventFilter interface represents filters that can be applied to event listings
  export interface EventFilter {
    startDate?: string;
    endDate?: string;
    location?: string;
    searchTerm?: string;
  }
  
  // EventSortOption type represents the ways events can be sorted
  export type EventSortOption = 'date-asc' | 'date-desc' | 'title-asc' | 'title-desc';
  
  // EventCategory enum represents categories that events can belong to
  export enum EventCategory {
    COMMUNITY = 'community',
    EDUCATION = 'education',
    SOCIAL = 'social',
    SPORTS = 'sports',
    ARTS = 'arts',
    OTHER = 'other'
  }