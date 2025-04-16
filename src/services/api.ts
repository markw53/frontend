// src/services/api.ts
import { getIdToken } from './authService';
import { EventFormData, Event } from '../types/event';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Process event data to ensure it matches the Event interface
const processEventData = (data: any): Event => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    startTime: data.start_time || data.startTime, // Handle PostgreSQL snake_case
    endTime: data.end_time || data.endTime, // Handle PostgreSQL snake_case
    location: data.location,
    organiser: data.organiser_id || data.organiser, // Handle PostgreSQL field name
    organiserName: data.organiser_name || data.organiserName || 'Unknown', // Handle PostgreSQL field name
    name: data.title, // PostgreSQL backend uses title consistently
    category: data.category || 'General',
    imageUrl: data.image_url || data.imageUrl, // Handle PostgreSQL field name
    capacity: data.capacity,
    attendees: data.attendees || [],
    attendeeCount: data.attendee_count || 0, // New field from PostgreSQL backend
    isPublished: data.is_published !== undefined ? data.is_published : true, // Handle PostgreSQL field name
    isCancelled: data.is_cancelled || false, // Handle PostgreSQL field name
    createdAt: data.created_at || data.createdAt, // Handle PostgreSQL field name
    updatedAt: data.updated_at || data.updatedAt // Handle PostgreSQL field name
  };
};

// Helper function to make authenticated requests
const authFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const token = await getIdToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${token}`
    };
    
    console.log(`Making request to: ${API_URL}${endpoint}`);
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    if (!response.ok) {
      let errorMessage = 'Request failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Get all events
export const getEvents = async (
  page: number = 1, 
  limit: number = 10, 
  filters: { category?: string, search?: string } = {}
): Promise<{ events: Event[], pagination: any }> => {
  // Build query string with pagination and filters
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  if (filters.category) {
    queryParams.append('category', filters.category);
  }
  
  if (filters.search) {
    queryParams.append('search', filters.search);
  }
  
  const endpoint = `/events?${queryParams.toString()}`;
  const data = await authFetch(endpoint);
  
  // Handle the new response format from PostgreSQL backend
  return {
    events: Array.isArray(data.events) ? data.events.map(processEventData) : [],
    pagination: data.pagination || { total: 0, page, limit, pages: 0 }
  };
};

// Get event by ID
export const getEventById = async (id: string): Promise<Event> => {
  const data = await authFetch(`/events/${id}`);
  return processEventData(data);
};

// Create new event
export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  // Convert frontend field names to match backend expectations
  const backendEventData = {
    title: eventData.title,
    description: eventData.description,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    location: eventData.location,
    category: eventData.category,
    image_url: eventData.imageUrl,
    capacity: eventData.capacity,
    is_published: eventData.isPublished !== undefined ? eventData.isPublished : true
  };
  
  const data = await authFetch('/events', {
    method: 'POST',
    body: JSON.stringify(backendEventData)
  });
  
  return processEventData(data);
};

// Update event
export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  // Convert frontend field names to match backend expectations
  const backendEventData = {
    title: eventData.title,
    description: eventData.description,
    start_time: eventData.startTime,
    end_time: eventData.endTime,
    location: eventData.location,
    category: eventData.category,
    image_url: eventData.imageUrl,
    capacity: eventData.capacity,
    is_published: eventData.isPublished !== undefined ? eventData.isPublished : true,
    is_cancelled: eventData.isCancelled
  };
  
  const data = await authFetch(`/events/${id}`, {
    method: 'PUT',
    body: JSON.stringify(backendEventData)
  });
  
  return processEventData(data);
};

// Delete event
export const deleteEvent = async (id: string): Promise<void> => {
  await authFetch(`/events/${id}`, {
    method: 'DELETE'
  });
};

// Register for an event
export const registerForEvent = async (id: string): Promise<void> => {
  await authFetch(`/events/${id}/register`, {
    method: 'POST'
  });
};

// Unregister from an event
export const unregisterFromEvent = async (id: string): Promise<void> => {
  await authFetch(`/events/${id}/register`, {
    method: 'DELETE'
  });
};

// Get event attendees
export const getEventAttendees = async (id: string): Promise<any[]> => {
  const data = await authFetch(`/events/${id}/attendees`);
  return Array.isArray(data) ? data : [];
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
      let errorMessage = 'Image upload failed';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data.imageUrl || data.image_url; // Handle both camelCase and snake_case
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async (): Promise<any> => {
  return await authFetch('/users/profile');
};

// Update user profile
export const updateUserProfile = async (profileData: any): Promise<any> => {
  // Convert frontend field names to match backend expectations
  const backendProfileData = {
    display_name: profileData.displayName,
    bio: profileData.bio,
    photo_url: profileData.photoUrl
  };
  
  return await authFetch('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(backendProfileData)
  });
};

// Get user's registered events
export const getUserEvents = async (): Promise<{ organized: Event[], attending: Event[] }> => {
  const data = await authFetch('/users/events');
  
  return {
    organized: Array.isArray(data.organized) ? data.organized.map(processEventData) : [],
    attending: Array.isArray(data.attending) ? data.attending.map(processEventData) : []
  };
};

// Create a default export with all the API functions
const api = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventAttendees,
  uploadImage,
  getUserProfile,
  updateUserProfile,
  getUserEvents
};

export default api;