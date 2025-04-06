import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      <section className="hero">
        <h1>Welcome to Community Events</h1>
        <p>Discover and participate in events happening in your community</p>
        
        <div className="cta-buttons">
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
          
          {!currentUser ? (
            <Link to="/register" className="btn btn-secondary">
              Join the Community
            </Link>
          ) : currentUser.role === 'staff' ? (
            <Link to="/events/create" className="btn btn-secondary">
              Create Event
            </Link>
          ) : null}
        </div>
      </section>
      
      <section className="features">
        <div className="feature">
          <h3>Discover Events</h3>
          <p>Browse through upcoming events in your community</p>
        </div>
        
        <div className="feature">
          <h3>Join Events</h3>
          <p>Sign up for events that interest you</p>
        </div>
        
        <div className="feature">
          <h3>Calendar Integration</h3>
          <p>Add events to your personal calendar</p>
        </div>
      </section>
      
      {currentUser ? (
        <section className="welcome-back">
          <h2>Welcome back, {currentUser.displayName || 'User'}!</h2>
          <p>Check out the latest events or view your profile.</p>
          
          <div className="cta-buttons">
            <Link to="/events" className="btn btn-primary">
              Latest Events
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              Your Profile
            </Link>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default Home;