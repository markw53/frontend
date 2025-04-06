import api from './api';

// Get Google OAuth URL
export const getGoogleAuthUrl = async () => {
  try {
    const response = await api.get('/api/google-calendar/auth-url');
    return response.data.url;
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    throw error;
  }
};

// Add event to Google Calendar
export const addEventToGoogleCalendar = async (eventId: string, tokens: any) => {
  try {
    const response = await api.post(`/api/google-calendar/add-event/${eventId}`, { tokens });
    return response.data;
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    throw error;
  }
};

// List user's calendar events
export const listGoogleCalendarEvents = async (tokens: any) => {
  try {
    const response = await api.post('/api/google-calendar/events', { tokens });
    return response.data;
  } catch (error) {
    console.error('Error listing Google Calendar events:', error);
    throw error;
  }
};