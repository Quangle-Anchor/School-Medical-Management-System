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
 */
export const validateScheduleDate = (dateString) => {
  if (!dateString)
    return { isValid: false, error: "Schedule date is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  const maxDate = new Date();
  maxDate.setFullYear(today.getFullYear() + 5); // Max 5 years in future

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

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
 * Validate incident date - can be past or today, but not future
 */
export const validateIncidentDate = (dateString) => {
  if (!dateString)
    return { isValid: false, error: "Incident date is required" };

  const inputDate = new Date(dateString);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 10); // Max 10 years ago

  // Check if date is valid
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: "Please enter a valid date" };
  }

  // Check if date is in the future
  if (inputDate > today) {
    return { isValid: false, error: "Incident date cannot be in the future" };
  }

  // Check if date is too far in the past
  if (inputDate < minDate) {
    return {
      isValid: false,
      error: "Incident date cannot be more than 10 years ago",
    };
  }

  return { isValid: true, error: null };
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
 * Get max date for incident input (today)
 */
export const getMaxIncidentDate = () => {
  return getTodayString();
};

/**
 * Get min date for incident input (10 years ago)
 */
export const getMinIncidentDate = () => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 10);
  return formatDateForInput(date);
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
