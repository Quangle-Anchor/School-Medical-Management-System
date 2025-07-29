/**
 * Shared utility functions for dashboard components
 */

/**
 * Formats a date string for display in dashboard events
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatEventDate = (dateString) => {
  if (!dateString) return 'No date';
  
  try {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Check if the date is today
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    // Check if the date is tomorrow
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    
    // Otherwise, format as readable date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

/**
 * Returns appropriate styling classes for event categories
 * @param {string} category - Event category
 * @returns {object} Object containing background and text color classes
 */
export const getCategoryStyle = (category) => {
  if (!category) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800'
    };
  }

  const categoryLower = category.toLowerCase();
  
  switch (categoryLower) {
    case 'vaccination':
    case 'vaccines':
    case 'immunization':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800'
      };
    case 'checkup':
    case 'check-up':
    case 'health check':
    case 'general checkup':
    case 'routine checkup':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800'
      };
    case 'emergency':
    case 'urgent':
    case 'urgent care':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800'
      };
    case 'other':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800'
      };
  }
};

/**
 * Formats medication request status for display
 * @param {string} status - Medication request status
 * @returns {object} Object containing status styling and display text
 */
export const getMedicationStatusStyle = (status) => {
  if (!status) {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      display: 'Unknown'
    };
  }

  const statusLower = status.toLowerCase();
  
  switch (statusLower) {
    case 'pending':
      return {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        display: 'Pending'
      };
    case 'confirmed':
    case 'approved':
      return {
        bg: 'bg-green-100',
        text: 'text-green-800',
        display: 'Confirmed'
      };
    case 'rejected':
    case 'denied':
      return {
        bg: 'bg-red-100',
        text: 'text-red-800',
        display: 'Rejected'
      };
    case 'completed':
    case 'administered':
      return {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        display: 'Completed'
      };
    case 'cancelled':
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        display: 'Cancelled'
      };
    default:
      return {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        display: status
      };
  }
};

/**
 * Formats time for display
 * @param {string} timeString - Time string (HH:mm format)
 * @returns {string} Formatted time string
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  
  try {
    const [hours, minutes] = timeString.split(':');
    const time = new Date();
    time.setHours(parseInt(hours), parseInt(minutes));
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Calculates age from birth date
 * @param {string} birthDate - Birth date string
 * @returns {number} Age in years
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null;
  
  try {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error('Error calculating age:', error);
    return null;
  }
};

/**
 * Safely handles null/undefined values for display
 * @param {any} value - Value to display
 * @param {string} fallback - Fallback text
 * @returns {string} Safe display value
 */
export const safeDisplay = (value, fallback = 'N/A') => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  return String(value);
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
