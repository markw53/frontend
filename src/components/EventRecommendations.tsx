// src/components/EventRecommendations.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Event } from '../types/event';
import { formatDate } from '../utils/dateUtils';
import './EventRecommendations.css';

interface EventRecommendationsProps {
  title: string;
  events: Event[];
  emptyMessage?: string;
}

const EventRecommendations: React.FC<EventRecommendationsProps> = ({ 
  title, 
  events,
  emptyMessage = 'No recommendations available at this time.'
}) => {
  if (events.length === 0) {
    return null;
  }

  return (
    <div className="event-recommendations">
      <h2>{title}</h2>
      
      {events.length === 0 ? (
        <p className="empty-message">{emptyMessage}</p>
      ) : (
        <div className="recommendation-cards">
          {events.map(event => (
            <div key={event.id} className="recommendation-card">
              <div className="recommendation-image">
                <img 
                  src={event.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} 
                  alt={event.title} 
                />
              </div>
              <div className="recommendation-content">
                <h3>{event.title}</h3>
                <p className="recommendation-date">{formatDate(event.startTime)}</p>
                <Link to={`/events/${event.id}`} className="recommendation-link">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventRecommendations;