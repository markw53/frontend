// src/services/googleCalendarService.ts
import { getIdToken } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function for making authenticated requests
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

// Get Google Auth URL
export const getGoogleAuthUrl = async () => {
  try {
    const response = await authFetch('/google-calendar/auth-url');
    return response.url;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

// Handle Google OAuth callback
export const handleGoogleCallback = async (code: string) => {
  try {
    const response = await authFetch('/google-calendar/callback', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
    return response;
  } catch (error) {
    console.error('Error handling Google callback:', error);
    throw error;
  }
};

// Add event to Google Calendar
export const addEventToGoogleCalendar = async (eventId: string, tokens?: any) => {
  try {
    // If tokens are provided, include them in the request body
    const requestBody = tokens ? { tokens } : {};
    
    const response = await authFetch(`/google-calendar/events/${eventId}/add`, {
      method: 'POST',
      body: JSON.stringify(requestBody)
    });
    return response;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
};

// Get user's Google Calendar events
export const getGoogleCalendarEvents = async () => {
  try {
    const response = await authFetch('/google-calendar/events');
    return response;
  } catch (error) {
    console.error('Error getting Google Calendar events:', error);
    throw error;
  }
};

// Disconnect Google Calendar
export const disconnectGoogleCalendar = async () => {
  try {
    const response = await authFetch('/google-calendar/disconnect', {
      method: 'DELETE'
    });
    return response;
  } catch (error) {
    console.error('Error disconnecting Google Calendar:', error);
    throw error;
  }
};