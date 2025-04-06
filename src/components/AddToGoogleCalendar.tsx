import React, { useState } from 'react';
import { getGoogleAuthUrl, addEventToGoogleCalendar } from '../services/googleCalendarService';

interface AddToGoogleCalendarProps {
  eventId: string;
}

const AddToGoogleCalendar: React.FC<AddToGoogleCalendarProps> = ({ eventId }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if we have Google tokens in localStorage
  const hasTokens = (): boolean => {
    const tokensString = localStorage.getItem('googleTokens');
    return !!tokensString;
  };

  // Get tokens from localStorage
  const getTokens = (): any => {
    const tokensString = localStorage.getItem('googleTokens');
    return tokensString ? JSON.parse(tokensString) : null;
  };

  // Handle Google authentication
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the Google OAuth URL
      const authUrl = await getGoogleAuthUrl();
      
      // Open a new window for authentication
      const authWindow = window.open(authUrl, '_blank', 'width=800,height=600');
      
      // Listen for messages from the auth window
      window.addEventListener('message', async (event) => {
        // Make sure the message is from our application
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS' && event.data.tokens) {
          // Store tokens in localStorage
          localStorage.setItem('googleTokens', JSON.stringify(event.data.tokens));
          
          // Close the auth window
          if (authWindow) authWindow.close();
          
          // Add the event to Google Calendar
          await addToCalendar();
        }
      });
    } catch (err) {
      setError('Failed to authenticate with Google. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Add event to Google Calendar
  const addToCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const tokens = getTokens();
      
      if (!tokens) {
        setError('No authentication tokens found. Please try again.');
        return;
      }
      
      await addEventToGoogleCalendar(eventId, tokens);
      setSuccess(true);
    } catch (err) {
      setError('Failed to add event to Google Calendar. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle button click
  const handleClick = async () => {
    if (hasTokens()) {
      await addToCalendar();
    } else {
      await handleGoogleAuth();
    }
  };

  return (
    <div className="add-to-calendar">
      {success ? (
        <div className="success-message">
          Event added to your Google Calendar!
        </div>
      ) : (
        <>
          {error && <div className="error-message">{error}</div>}
          <button 
            onClick={handleClick} 
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? 'Processing...' : 'Add to Google Calendar'}
          </button>
        </>
      )}
    </div>
  );
};

export default AddToGoogleCalendar;