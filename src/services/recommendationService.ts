// src/services/recommendationService.ts
import { Event } from '../types/event';
import { User } from '../types/user';

/**
 * Get recommended events for a user based on their interests and past attendance
 * @param events All available events
 * @param user Current user
 * @param limit Maximum number of recommendations to return
 * @returns Array of recommended events
 */
export const getRecommendedEvents = (
  events: Event[],
  user: User | null,
  limit: number = 3
): Event[] => {
  if (!user || events.length === 0) {
    return [];
  }

  // Get user's interests (tags or categories they've shown interest in)
  const userInterests = user.interests || [];
  
  // Get events the user has already registered for
  const userEventIds = user.registeredEvents || [];
  
  // Filter out events the user is already registered for
  const availableEvents = events.filter(event => !userEventIds.includes(event.id));
  
  if (availableEvents.length === 0) {
    return [];
  }
  
  // Score each event based on how well it matches the user's interests
  const scoredEvents = availableEvents.map(event => {
    let score = 0;
    
    // Score based on category match
    if (userInterests.includes(event.category)) {
      score += 3;
    }
    
    // Score based on tag matches
    if (event.tags) {
      event.tags.forEach(tag => {
        if (userInterests.includes(tag)) {
          score += 2;
        }
      });
    }
    
    // Boost score for upcoming events (within the next week)
    const eventDate = new Date(event.startTime);
    const now = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    
    if (eventDate > now && eventDate.getTime() - now.getTime() < oneWeek) {
      score += 1;
    }
    
    return { event, score };
  });
  
  // Sort by score (highest first) and take the top 'limit' events
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.event);
};

/**
 * Get popular events based on registration count or recent creation
 * @param events All available events
 * @param limit Maximum number of events to return
 * @returns Array of popular events
 */
export const getPopularEvents = (
  events: Event[],
  limit: number = 3
): Event[] => {
  if (events.length === 0) {
    return [];
  }
  
  // Sort events by registration count (if available) or just return recent ones
  return [...events]
    .sort((a, b) => {
      // If we have registration counts, use them
      const countA = a.registrationCount || 0;
      const countB = b.registrationCount || 0;
      
      if (countA !== countB) {
        return countB - countA;
      }
      
      // Otherwise sort by date (most recent first)
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    })
    .slice(0, limit);
};

/**
 * Get events similar to a specific event
 * @param targetEvent The event to find similar events for
 * @param allEvents All available events
 * @param limit Maximum number of similar events to return
 * @returns Array of similar events
 */
export const getSimilarEvents = (
  targetEvent: Event,
  allEvents: Event[],
  limit: number = 3
): Event[] => {
  if (!targetEvent || allEvents.length <= 1) {
    return [];
  }
  
  // Filter out the target event itself
  const otherEvents = allEvents.filter(event => event.id !== targetEvent.id);
  
  // Score each event based on similarity
  const scoredEvents = otherEvents.map(event => {
    let score = 0;
    
    // Same category
    if (event.category === targetEvent.category) {
      score += 3;
    }
    
    // Shared tags
    if (event.tags && targetEvent.tags) {
      event.tags.forEach(tag => {
        if (targetEvent.tags?.includes(tag)) {
          score += 2;
        }
      });
    }
    
    // Similar time frame (within 2 weeks)
    const eventDate = new Date(event.startTime);
    const targetDate = new Date(targetEvent.startTime);
    const twoWeeks = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    
    if (Math.abs(eventDate.getTime() - targetDate.getTime()) < twoWeeks) {
      score += 1;
    }
    
    // Same location
    if (event.location === targetEvent.location) {
      score += 1;
    }
    
    return { event, score };
  });
  
  // Sort by score (highest first) and take the top 'limit' events
  return scoredEvents
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.event);
};

/**
 * Get upcoming events within a specified time frame
 * @param events All available events
 * @param days Number of days to look ahead
 * @param limit Maximum number of events to return
 * @returns Array of upcoming events
 */
export const getUpcomingEvents = (
  events: Event[],
  days: number = 7,
  limit: number = 5
): Event[] => {
  if (events.length === 0) {
    return [];
  }
  
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  // Filter events that are happening within the specified time frame
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= now && eventDate <= futureDate;
  });
  
  // Sort by start time (earliest first)
  return upcomingEvents
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, limit);
};