import React, { useState, useEffect } from 'react';
import { getEvents } from '../services/api';
import { Event } from '../types/event';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendedEvents, getPopularEvents } from '../services/recommendationService';
import EventRecommendations from '../components/EventRecommendations';
// import './Home.css';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }
  , []);
 
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
      
      <section className="events-list">
        <h2>Upcoming Events</h2>
        {loading ? (
          <p>Loading events...</p>
        ) : events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No events available at the moment.</p>
        )}
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