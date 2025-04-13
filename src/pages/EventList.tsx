import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import { Event } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import { EventCategory, EventTag } from '../enums';
import { formatDate } from '../utils/dateUtils';
import SearchBar from '../components/common/SearchBar';
import './EventList.css';

const EventList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<EventTag[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

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

  // const formatDate = (dateString: string) => {
  //   const options: Intl.DateTimeFormatOptions = {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //     hour: '2-digit',
  //     minute: '2-digit'
  //   };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleTagToggle = (tag: EventTag) => {
      setSelectedTags(prev => 
        prev.includes(tag) 
          ? prev.filter(t => t !== tag) 
          : [...prev, tag]
      );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedTags([]);
    setSearchQuery('');
  };

  // Filter and search events
  const filteredEvents = events.filter(event => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        event.title.toLowerCase().includes(query) || 
        event.description.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query);
      
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (selectedCategory && event.category !== selectedCategory) {
      return false;
    }
    
    // Tags filter
    if (selectedTags.length > 0) {
      if (!event.tags) return false;
      return selectedTags.every((tag: EventTag) => event.tags?.includes(tag));
    }
    
    return true;
  });

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
        <div className="event-list-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {currentUser?.role === 'staff' && (
            <Link to="/events/create" className="btn btn-primary">
              Create New Event
            </Link>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <SearchBar 
          onSearch={handleSearch} 
          initialValue={searchQuery}
          placeholder="Search by title, description, or location..."
        />
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="event-filters">
          <div className="filter-section">
            <h3>Filter by Category</h3>
            <div className="category-filters">
              <button
                className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => handleCategoryChange(null)}
              >
                All Categories
              </button>
              {Object.values(EventCategory).map(category => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Filter by Tags</h3>
            <div className="tag-filters">
              {['Tag1', 'Tag2', 'Tag3'].map(tag => (
                <button
                  key={tag}
                  className={`filter-btn ${selectedTags.includes(tag as EventTag) ? 'active' : ''}`}
                  onClick={() => handleTagToggle(tag as EventTag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {(selectedCategory || selectedTags.length > 0) && (
            <button 
              className="clear-filters-btn"
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {(selectedCategory || selectedTags.length > 0 || searchQuery) && (
        <div className="active-filters">
          <span>Active Filters:</span>
          {searchQuery && (
            <span className="filter-tag">
              Search: {searchQuery}
              <button onClick={() => setSearchQuery('')}>×</button>
            </span>
          )}
          {selectedCategory && (
            <span className="filter-tag">
              {selectedCategory}
              <button onClick={() => setSelectedCategory(null)}>×</button>
            </span>
          )}
          {selectedTags.map(tag => (
            <span key={tag} className="filter-tag">
              {tag}
              <button onClick={() => handleTagToggle(tag)}>×</button>
            </span>
          ))}
        </div>
      )}

      {filteredEvents.length === 0 ? (
        <div className="no-events">
          {selectedCategory || selectedTags.length > 0 ? (
            <>
              <p>No events found matching your filters.</p>
              <button 
                className="btn btn-secondary"
                onClick={clearAllFilters}
              >
                Clear All Filters
              </button>
            </>
          ) : (
            <>
              <p>No events found. Check back later for upcoming events!</p>
              {currentUser?.role === 'staff' && (
                <Link to="/events/create" className="btn btn-primary">
                  Create the first event
                </Link>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="event-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img 
                  src={event.imageUrl || 'https://via.placeholder.com/300x180?text=No+Image'} 
                  alt={event.title} 
                />
              </div>
              <div className="event-content">
                <h3>{event.title}</h3>
                <p className="event-date">
                  <strong>When:</strong> {formatDate(event.startTime)}
                </p>
                <p className="event-location">
                  <strong>Where:</strong> {event.location}
                </p>
                <div className="event-category">
                  <span className="category-badge">{event.category}</span>
                </div>
                {event.tags && event.tags.length > 0 && (
                  <div className="event-tags">
                    {event.tags.map(tag => (
                      <span key={String(tag)} className="tag-badge">{String(tag)}</span>
                    ))}
                  </div>
                )}
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
    </div>
  );
};

export default EventList;