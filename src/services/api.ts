// src/services/api.ts
import { getIdToken } from './authService';
import { EventFormData, Event } from '../types/event';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make authenticated requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getIdToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || 'Request failed');
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Get all events
export const getEvents = async (): Promise<Event[]> => {
  return authFetch('/events');
};

// Get event by ID
export const getEventById = async (id: string): Promise<Event> => {
  return authFetch(`/events/${id}`);
};

// Create new event
export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  return authFetch('/events', {
    method: 'POST',
    body: JSON.stringify(eventData)
  });
};

// Update event
export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  return authFetch(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(eventData)
  });
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  return authFetch(`/events/${id}`, {
    method: 'DELETE'
  });
};

// Register for an event
export const registerForEvent = async (id: string): Promise<void> => {
  return authFetch(`/events/${id}/register`, {
    method: 'POST'
  });
};

// Upload image
export const uploadImage = async (file: File, type: 'event' | 'profile'): Promise<string> => {
  try {
    const token = await getIdToken();
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_URL}/images/${type === 'event' ? 'events' : 'profile'}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(error.message || 'Image upload failed');
    }
    
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};