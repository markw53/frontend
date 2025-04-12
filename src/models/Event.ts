// src/models/Event.ts
export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    location: string;
    imageUrl?: string;
    organizer: string;
    category: string;
    tags?: string[]; // Add tags field
    capacity?: number;
  }