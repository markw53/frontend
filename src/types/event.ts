// src/types/event.ts
import { EventTag } from '../enums/EventTag';
import { EventCategory } from '../enums/EventCategory';

export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  organiser: string;
  organiserName?: string;
  category: string;
  imageUrl?: string;
  capacity?: number;
  tags?: EventTag[];
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
  tags?: EventTag[];
}