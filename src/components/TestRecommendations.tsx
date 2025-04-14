// src/components/TestRecommendations.tsx
import React, { useEffect, useState } from 'react';
import { Event } from '../types/event';
import { sampleEvents, sampleUser } from '../data/sampleEvents';
import { 
  getRecommendedEvents, 
  getPopularEvents, 
  getSimilarEvents,
  getUpcomingEvents
} from '../services/recommendationService';
import EventRecommendations from './EventRecommendations';
import './EventRecommendations.css';

const TestRecommendations: React.FC = () => {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [popularEvents, setPopularEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [similarEvents, setSimilarEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Get recommended events for the sample user
    const recommended = getRecommendedEvents(sampleEvents, sampleUser);
    setRecommendedEvents(recommended);

    // Get popular events
    const popular = getPopularEvents(sampleEvents);
    setPopularEvents(popular);

    // Get upcoming events in the next 7 days
    const upcoming = getUpcomingEvents(sampleEvents, 7);
    setUpcomingEvents(upcoming);

    // Get events similar to the first technology event
    const techEvent = sampleEvents.find((event: Event) => event.category === 'Technology');
    if (techEvent) {
      const similar = getSimilarEvents(techEvent, sampleEvents);
      setSimilarEvents(similar);
    }
  }, []);

  return (
    <div className="test-recommendations-container">
      <h1>Event Recommendations Test</h1>
      
      <div className="user-info">
        <h2>Sample User</h2>
        <p><strong>Name:</strong> {sampleUser.displayName}</p>
        <p><strong>Interests:</strong> {(sampleUser.interests ?? []).join(', ')}</p>
        <p><strong>Registered Events:</strong> {(sampleUser.registeredEvents ?? []).length}</p>
      </div>
      
      <EventRecommendations 
        title="Recommended for You" 
        events={recommendedEvents}
        emptyMessage="No personalized recommendations available."
      />
      
      <EventRecommendations 
        title="Popular Events" 
        events={popularEvents}
        emptyMessage="No popular events available."
      />
      
      <EventRecommendations 
        title="Upcoming This Week" 
        events={upcomingEvents}
        emptyMessage="No events coming up this week."
      />
      
      {similarEvents.length > 0 && (
        <EventRecommendations 
          title={`Similar to "${sampleEvents.find((event: Event) => event.category === 'Technology')?.title}"`}
          events={similarEvents}
          emptyMessage="No similar events found."
        />
      )}
    </div>
  );
};

export default TestRecommendations;