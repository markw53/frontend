import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Event, EventFormData } from '../types/event';

// Create API base URL from environment variable or default to localhost
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor for authentication tokens
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to the request headers
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401)
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Event API calls
export const getEvents = async (): Promise<Event[]> => {
  try {
    const response = await api.get('/api/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id: string): Promise<Event> => {
  try {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: EventFormData): Promise<Event> => {
  try {
    const response = await api.post('/api/events', eventData);
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id: string, eventData: EventFormData): Promise<Event> => {
  try {
    const response = await api.put(`/api/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/events/${id}`);
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
};

// User authentication API calls
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/auth/login', { email, password });
    // Store token in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (email: string, password: string, displayName: string) => {
  try {
    const response = await api.post('/api/auth/register', { email, password, displayName });
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
};

// Event signup API calls
export const signupForEvent = async (eventId: string) => {
  try {
    const response = await api.post(`/api/events/${eventId}/signup`);
    return response.data;
  } catch (error) {
    console.error(`Error signing up for event with id ${eventId}:`, error);
    throw error;
  }
};

export const cancelEventSignup = async (eventId: string) => {
  try {
    const response = await api.delete(`/api/events/${eventId}/signup`);
    return response.data;
  } catch (error) {
    console.error(`Error canceling signup for event with id ${eventId}:`, error);
    throw error;
  }
};

// User profile API calls
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/users/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (profileData: any) => {
  try {
    const response = await api.put('/api/users/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Export the api instance for direct use if needed
export default api;