import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEventById, deleteEvent } from '../services/api';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import AddToGoogleCalendar from '../components/AddToGoogleCalendar';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
        setError(null);
      } catch (err) {
        setError('Failed to load event details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDeleteEvent = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      await deleteEvent(id);
      navigate('/events');
    } catch (err) {
      setError('Failed to delete event. Please try again later.');
      console.error(err);
    }
  };

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
    return <div className="loading">Loading event details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!event) {
    return <div className="not-found">Event not found</div>;
  }

  return (
    <div className="event-detail-container">
      <div className="event-detail-header">
        <h1>{event.title}</h1>
        {currentUser?.role === 'staff' && (
          <div className="event-actions">
            <Link to={`/events/edit/${event.id}`} className="btn btn-secondary">
              Edit Event
            </Link>
            <button onClick={handleDeleteEvent} className="btn btn-danger">
              Delete Event
            </button>
          </div>
        )}
      </div>

      <div className="event-detail-content">
        {event.imageUrl ? (
          <div className="event-detail-image">
            <img src={event.imageUrl} alt={event.title} />
          </div>
        ) : (
          <div className="event-detail-image no-image">
            <div className="placeholder-text">No image available</div>
          </div>
      )}

        <div className="event-detail-info">
          <div className="info-item">
            <h3>When</h3>
            <p>{formatDate(event.startTime)} - {formatDate(event.endTime)}</p>
          </div>

          <div className="info-item">
            <h3>Where</h3>
            <p>{event.location}</p>
          </div>

          <div className="info-item">
            <h3>Description</h3>
            <p>{event.description}</p>
          </div>

          <div className="event-detail-actions">
            <button className="btn btn-primary">Sign Up for Event</button>
            <AddToGoogleCalendar eventId={event.id} />
          </div>
        </div>
      </div>
      
      <div className="event-detail-meta">
        <p>Created by: {event.createdBy}</p>
        <p>Created: {formatDate(event.createdAt)}</p>
        {event.updatedAt !== event.createdAt && (
          <p>Last updated: {formatDate(event.updatedAt)}</p>
        )}
      </div>
      
      <div className="event-detail-navigation">
        <Link to="/events" className="btn btn-secondary">
          Back to Events
        </Link>
      </div>
    </div>
  );
};

export default EventDetail;