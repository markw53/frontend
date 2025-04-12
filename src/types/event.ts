// src/types/event.ts
export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: string;
  category: string;
  imageUrl?: string;
  capacity?: number;
  attendees: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventFormData {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: string;
  imageUrl?: string;
  capacity?: number;
}