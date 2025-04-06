import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data);
        setError(null);
      } catch (err) {
        setError('Failed to load events. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="loading">Loading events...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h1>Community Events</h1>
        {currentUser?.role === 'staff' && (
          <Link to="/events/create" className="btn btn-primary">
            Create New Event
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="no-events">
          <p>No events found. Check back later for upcoming events!</p>
          {currentUser?.role === 'staff' && (
            <Link to="/events/create" className="btn btn-primary">
              Create the first event
            </Link>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              {event.imageUrl && (
                <div className="event-image">
                  <img src={event.imageUrl} alt={event.title} />
                </div>
              )}
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">
                  <strong>When:</strong> {formatDate(event.startTime)}
                </p>
                <p className="event-location">
                  <strong>Where:</strong> {event.location}
                </p>
                <p className="event-description">
                  {event.description.length > 100
                    ? `${event.description.substring(0, 100)}...`
                    : event.description}
                </p>
                <div className="event-card-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-secondary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="event-list-filters">
        {/* You can add filters here in the future */}
      </div>
    </div>
  );
};

export default EventList;