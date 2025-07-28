// Date utility functions for validation and formatting

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Get a date string in YYYY-MM-DD format without timezone conversion
 */
export const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Validate birthdate - must be in the past and reasonable
 */
export const validateBirthdate = (dateString) => {
  if (!dateString) return { isValid: false, error: "Birthdate is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 150); // Max 150 years old

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // Check if date is in the future
  if (inputDate >= today) {
    return {
      isValid: false,
      error: "Birthdate cannot be today or in the future",
    };
  }

  // Check if date is too far in the past
  if (inputDate < minDate) {
    return {
      isValid: false,
      error: "Birthdate cannot be more than 150 years ago",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate schedule date - can be today or future, but reasonable
 * For medication schedules by nurses, this should always be today
 */
export const validateScheduleDate = (dateString, isMedicationSchedule = false) => {
  if (!dateString)
    return { isValid: false, error: "Schedule date is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  const todayString = getTodayString();

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // For medication schedules, force today only
  if (isMedicationSchedule) {
    if (dateString !== todayString) {
      return { 
        isValid: false, 
        error: "Medication schedule date must be today only" 
      };
    }
    return { isValid: true, error: null };
  }

  // For other schedules, allow future dates up to 5 years
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5); // Max 5 years in future

  // Check if date is too far in the future
  if (inputDate > maxDate) {
    return {
      isValid: false,
      error: "Schedule date cannot be more than 5 years in the future",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate expiry date - must be within 6 months past to 6 months future
 */
export const validateExpiryDate = (dateString) => {
  if (!dateString) return { isValid: false, error: "Expiry date is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  const minDate = new Date();
  const maxDate = new Date();
  
  // Set range: 6 months in the past to 6 months in the future
  minDate.setMonth(today.getMonth() - 6);
  maxDate.setMonth(today.getMonth() + 6);

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // Check if date is too far in the past (more than 6 months ago)
  if (inputDate < minDate) {
    return { isValid: false, error: "Expiry date cannot be more than 6 months in the past" };
  }

  // Check if date is too far in the future (more than 6 months ahead)
  if (inputDate > maxDate) {
    return {
      isValid: false,
      error: "Expiry date cannot be more than 6 months in the future",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate incident date - only allows today's date
 */
export const validateIncidentDate = (dateString) => {
  if (!dateString)
    return { isValid: false, error: "Incident date is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  
  // Normalize dates to compare only year, month, day (ignore time)
  const inputDateOnly = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // Check if date is not today
  if (inputDateOnly.getTime() !== todayOnly.getTime()) {
    return { isValid: false, error: "Incident date must be today only" };
  }

  return { isValid: true, error: null };
};

/**
 * Validate medication schedule time - must be today and time cannot be in the past
 */
export const validateMedicationScheduleTime = (timeString, dateString = null) => {
  if (!timeString) {
    return { isValid: false, error: "Schedule time is required" };
  }

  const now = new Date();
  const today = getTodayString();
  
  // Force date to be today for medication schedules
  const scheduleDate = dateString || today;
  
  // Check if the provided date is today
  if (scheduleDate !== today) {
    return { isValid: false, error: "Medication schedule must be for today only" };
  }

  // Parse the time string (format: HH:MM in 24-hour format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(timeString)) {
    return { isValid: false, error: "Please enter a valid time in 24-hour format (HH:MM)" };
  }

  const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
  
  // Create a date object for the scheduled time today
  const scheduledDateTime = new Date();
  scheduledDateTime.setHours(hours, minutes, 0, 0);

  // Check if the scheduled time is in the past (only if it's today)
  if (scheduledDateTime <= now) {
    return { 
      isValid: false, 
      error: "Schedule time cannot be in the past. Please select a future time." 
    };
  }

  return { isValid: true, error: null };
};

/**
 * Get current time in HH:MM format (24-hour)
 */
export const getCurrentTime = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Get minimum time for medication schedule (current time + 1 minute) in 24-hour format
 */
export const getMinScheduleTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1); // Add 1 minute to current time
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format time to 24-hour format display
 */
export const formatTimeTo24Hour = (timeString) => {
  if (!timeString) return '';
  
  // If already in HH:MM format, return as is
  if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':');
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  return timeString;
};

/**
 * Get max date for birthdate input (today)
 */
export const getMaxBirthdate = () => {
  return getTodayString();
};

/**
 * Get min date for birthdate input (150 years ago)
 */
export const getMinBirthdate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 150);
  return formatDateForInput(date);
};

/**
 * Get min date for schedule input (today)
 */
export const getMinScheduleDate = () => {
  return getTodayString();
};

/**
 * Get medication schedule date (always today for nurses)
 */
export const getMedicationScheduleDate = () => {
  return getTodayString();
};

/**
 * Get max date for schedule input (5 years from now)
 */
export const getMaxScheduleDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() + 5);
  return formatDateForInput(date);
};

/**
 * Get min date for expiry input (6 months ago)
 */
export const getMinExpiryDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 6);
  return formatDateForInput(date);
};

/**
 * Get max date for expiry input (6 months from now)
 */
export const getMaxExpiryDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() + 6);
  return formatDateForInput(date);
};

/**
 * Get max date for incident input (today only)
 */
export const getMaxIncidentDate = () => {
  return getTodayString();
};

/**
 * Get min date for incident input (today only)
 */
export const getMinIncidentDate = () => {
  return getTodayString();
};

/**
 * Calculate age from birthdate
 */
export const calculateAge = (birthdate) => {
  if (!birthdate) return null;

  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

/**
 * Format date for display
 */
export const formatDateForDisplay = (dateString, options = {}) => {
  if (!dateString) return "N/A";

  const defaultOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...options,
  };

  return new Date(dateString).toLocaleDateString("en-US", defaultOptions);
};
