// src/components/EventCard.tsx
import React from 'react';
import { Event } from '../models/Event';
import { formatDate } from '../utils/dateUtils';

interface EventCardProps {
  event: Event;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  return (
    <div 
      className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {event.imageUrl && (
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold">{event.title}</h3>
        <div className="text-sm text-gray-500 mt-1">
          {formatDate(event.startDate)}
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {event.location}
        </div>
        
        {/* Category badge */}
        <div className="mt-2">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
            {event.category}
          </span>
        </div>
        
        {/* Tags section */}
        {event.tags && event.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {event.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;