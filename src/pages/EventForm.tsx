import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, getEventById, updateEvent } from '../services/api';
import { EventFormData } from '../types/event';
import { useAuth } from '../contexts/AuthContext';
import ImageUpload from '../components/common/ImageUpload';
import './EventForm.css';

const EventForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'General', // Default category
    imageUrl: '',
    capacity: undefined
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  useEffect(() => {
    // If we're in edit mode, fetch the event data
    if (isEditMode && id) {
      const fetchEvent = async () => {
        try {
          setLoading(true);
          const eventData = await getEventById(id);
          
          // Format dates for datetime-local input
          const formatDateForInput = (dateString: string) => {
            const date = new Date(dateString);
            return date.toISOString().slice(0, 16);
          };
          
          setFormData({
            title: eventData.title,
            description: eventData.description,
            startTime: formatDateForInput(eventData.startTime),
            endTime: formatDateForInput(eventData.endTime),
            location: eventData.location,
            category: eventData.category || 'General',
            imageUrl: eventData.imageUrl || '',
            capacity: eventData.capacity
          });
          
          setError(null);
        } catch (err) {
          setError('Failed to load event data. Please try again later.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchEvent();
    }
  }, [id, isEditMode]);

  // Check if user is staff
  useEffect(() => {
    if (currentUser && currentUser.role !== 'staff') {
      navigate('/events');
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? (value ? parseInt(value) : undefined) : value 
    }));
  };

  const handleImageUploaded = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, imageUrl }));
    setImageUploading(false);
  };

  const validateForm = (): boolean => {
    // Check if end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      setError('End time must be after start time');
      return false;
    }
    
    // Check if start time is in the future
    if (new Date(formData.startTime) < new Date()) {
      setError('Start time must be in the future');
      return false;
    }
    
    // Check if image upload is still in progress
    if (imageUploading) {
      setError('Please wait for image upload to complete');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    
    if (!currentUser || currentUser.role !== 'staff') {
      setError('You do not have permission to perform this action.');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      if (isEditMode && id) {
        await updateEvent(id, formData);
      } else {
        await createEvent(formData);
      }
      
      navigate('/events');
    } catch (err) {
      setError(`Failed to ${isEditMode ? 'update' : 'create'} event. Please try again later.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return <div className="loading">Loading event data...</div>;
  }

  // Available event categories
  const categories = [
    'General',
    'Workshop',
    'Conference',
    'Meetup',
    'Social',
    'Sports',
    'Arts',
    'Education',
    'Technology',
    'Other'
  ];

  return (
    <div className="event-form-container">
      <h1>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="event-form">
        <div className="form-group">
          <label htmlFor="title">Event Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className={formSubmitted && !formData.title ? 'invalid' : ''}
          />
          {formSubmitted && !formData.title && (
            <div className="field-error">Title is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            required
            className={formSubmitted && !formData.description ? 'invalid' : ''}
          />
          {formSubmitted && !formData.description && (
            <div className="field-error">Description is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category*</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className={formSubmitted && !formData.category ? 'invalid' : ''}
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {formSubmitted && !formData.category && (
            <div className="field-error">Category is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="startTime">Start Time*</label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className={formSubmitted && !formData.startTime ? 'invalid' : ''}
          />
          {formSubmitted && !formData.startTime && (
            <div className="field-error">Start time is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="endTime">End Time*</label>
          <input
            type="datetime-local"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className={formSubmitted && !formData.endTime ? 'invalid' : ''}
          />
          {formSubmitted && !formData.endTime && (
            <div className="field-error">End time is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="location">Location*</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className={formSubmitted && !formData.location ? 'invalid' : ''}
          />
          {formSubmitted && !formData.location && (
            <div className="field-error">Location is required</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="capacity">Capacity (optional)</label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity || ''}
            onChange={handleChange}
            min="1"
            placeholder="Leave blank for unlimited"
          />
          <small className="form-text">
            Maximum number of attendees. Leave blank for unlimited capacity.
          </small>
        </div>
        
        <div className="form-group">
          <label>Event Image</label>
          <ImageUpload 
            onImageUploaded={handleImageUploaded}
            currentImage={formData.imageUrl}
            type="event"
            onUploadStart={() => setImageUploading(true)}
          />
          <small className="form-text">
            Upload an image for your event. Recommended size: 1200x630 pixels.
          </small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || imageUploading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/events')}
          >
            Cancel
          </button>
        </div>
        
        <div className="form-note">
          <small>* Required fields</small>
        </div>
      </form>
    </div>
  );
};

export default EventForm;