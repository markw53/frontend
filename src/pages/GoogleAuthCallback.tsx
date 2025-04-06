import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAuthCallback: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Parse the URL to get the authorization code
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Send the code to the parent window
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_AUTH_SUCCESS',
          code
        }, window.location.origin);
        
        // Close this window after sending the message
        window.close();
      }
    }
  }, [location]);

  return (
    <div className="google-auth-callback">
      <h2>Google Authentication</h2>
      <p>Processing authentication... This window will close automatically.</p>
    </div>
  );
};

export default GoogleAuthCallback;