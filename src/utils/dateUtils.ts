// src/utils/dateUtils.ts

/**
 * Formats a date string or Date object into a readable format
 * @param date - Date string or Date object to format
 * @param includeTime - Whether to include the time in the formatted string
 * @returns Formatted date string
 */
export const formatDate = (date: string | Date, includeTime: boolean = true): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return dateObj.toLocaleDateString(undefined, options);
  };
  
  /**
   * Formats a date range from two date strings or Date objects
   * @param startDate - Start date string or Date object
   * @param endDate - End date string or Date object
   * @returns Formatted date range string
   */
  export const formatDateRange = (startDate: string | Date, endDate: string | Date): string => {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 'Invalid date range';
    }
    
    // Check if dates are on the same day
    const sameDay = 
      start.getDate() === end.getDate() && 
      start.getMonth() === end.getMonth() && 
      start.getFullYear() === end.getFullYear();
    
    if (sameDay) {
      // Format: "Monday, January 1, 2023, 2:00 PM - 4:00 PM"
      const dateStr = start.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const startTimeStr = start.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const endTimeStr = end.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      return `${dateStr}, ${startTimeStr} - ${endTimeStr}`;
    } else {
      // Format: "Monday, January 1, 2023, 2:00 PM - Tuesday, January 2, 2023, 4:00 PM"
      const startStr = formatDate(start, true);
      const endStr = formatDate(end, true);
      
      return `${startStr} - ${endStr}`;
    }
  };
  
  /**
   * Checks if a date is in the past
   * @param date - Date string or Date object to check
   * @returns Boolean indicating if the date is in the past
   */
  export const isDatePast = (date: string | Date): boolean => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    return dateObj < now;
  };
  
  /**
   * Formats a date for use in datetime-local input fields
   * @param date - Date string or Date object
   * @returns Formatted date string (YYYY-MM-DDThh:mm)
   */
  export const formatDateForInput = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return '';
    }
    
    // Format: YYYY-MM-DDThh:mm
    return dateObj.toISOString().slice(0, 16);
  };
  
  /**
   * Returns a relative time string (e.g., "2 days ago", "in 3 hours")
   * @param date - Date string or Date object
   * @returns Relative time string
   */
  export const getRelativeTimeString = (date: string | Date): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }
    
    const diffInSeconds = Math.floor((dateObj.getTime() - now.getTime()) / 1000);
    const absoluteDiff = Math.abs(diffInSeconds);
    
    // Define time units in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;
    
    let result: string;
    
    if (absoluteDiff < minute) {
      result = 'just now';
    } else if (absoluteDiff < hour) {
      const minutes = Math.floor(absoluteDiff / minute);
      result = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (absoluteDiff < day) {
      const hours = Math.floor(absoluteDiff / hour);
      result = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (absoluteDiff < week) {
      const days = Math.floor(absoluteDiff / day);
      result = `${days} day${days > 1 ? 's' : ''}`;
    } else if (absoluteDiff < month) {
      const weeks = Math.floor(absoluteDiff / week);
      result = `${weeks} week${weeks > 1 ? 's' : ''}`;
    } else if (absoluteDiff < year) {
      const months = Math.floor(absoluteDiff / month);
      result = `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(absoluteDiff / year);
      result = `${years} year${years > 1 ? 's' : ''}`;
    }
    
    // Add "ago" or "from now" suffix
    if (diffInSeconds < 0) {
      return `${result} ago`;
    } else if (diffInSeconds > 0 && result !== 'just now') {
      return `in ${result}`;
    }
    
    return result;
  };