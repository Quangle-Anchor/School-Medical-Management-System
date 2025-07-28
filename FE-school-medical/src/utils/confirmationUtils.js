/**
 * Two-step confirmation utility for actions that require verification
 * This utility provides a reusable modal-based confirmation system
 */

import { useState } from 'react';

/**
 * Custom hook for managing two-step confirmation process
 * @param {Function} onConfirm - Callback function to execute after confirmation
 * @param {Function} showSuccessToast - Toast function for success messages
 * @param {Function} showErrorToast - Toast function for error messages
 * @returns {Object} - Hook state and functions
 */
export const useConfirmation = (onConfirm, showSuccessToast, showErrorToast) => {
  const [showModal, setShowModal] = useState(false);
  const [itemToConfirm, setItemToConfirm] = useState(null);
  const [confirmingItems, setConfirmingItems] = useState(new Set());

  /**
   * Step 1: Show confirmation modal
   * @param {Object} item - Item to confirm (student, medical request, etc.)
   */
  const handleConfirmClick = (item) => {
    setItemToConfirm(item);
    setShowModal(true);
  };

  /**
   * Step 2: Execute actual confirmation
   * @param {Object} item - Item to confirm
   * @param {Object} options - Additional options for confirmation
   */
  const handleConfirm = async (item, options = {}) => {
    const itemId = options.getItemId ? options.getItemId(item) : item.id;
    
    if (!itemId) {
      showErrorToast(options.invalidIdMessage || 'Cannot confirm: Invalid item ID');
      return;
    }

    setConfirmingItems(prev => new Set([...prev, itemId]));
    
    try {
      await onConfirm(item, options);
      
      // Close confirmation modal
      setShowModal(false);
      setItemToConfirm(null);
      
      // Show success message
      const itemName = options.getItemName ? options.getItemName(item) : 'Item';
      showSuccessToast(options.successMessage || `${itemName} has been confirmed successfully!`);
      
    } catch (error) {
      console.error('Error confirming item:', error);
      showErrorToast(options.errorMessage || `Failed to confirm: ${error.message}`);
    } finally {
      setConfirmingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  /**
   * Cancel confirmation process
   */
  const cancelConfirm = () => {
    setShowModal(false);
    setItemToConfirm(null);
  };

  /**
   * Check if an item is currently being confirmed
   * @param {string} itemId - ID of the item to check
   * @returns {boolean}
   */
  const isConfirming = (itemId) => {
    return confirmingItems.has(itemId);
  };

  return {
    showModal,
    itemToConfirm,
    confirmingItems,
    handleConfirmClick,
    handleConfirm,
    cancelConfirm,
    isConfirming
  };
};

/**
 * Generate confirmation modal configuration for different types
 * @param {string} type - Type of confirmation ('student', 'medical-request', etc.)
 * @param {Object} item - Item being confirmed
 * @returns {Object} - Modal configuration
 */
export const getConfirmationConfig = (type, item) => {
  const configs = {
    'student': {
      title: 'Confirm Student',
      subtitle: 'This will mark the student as confirmed',
      warningNote: 'Once confirmed, this student will be marked as verified in the system. This action cannot be undone.',
      iconColor: 'green',
      getItemName: (student) => student.fullName || student.studentCode || 'Unknown',
      getItemId: (student) => student.studentId,
      getDisplayInfo: (student) => ({
        primary: student.fullName || 'Unknown',
        secondary: `Code: ${student.studentCode || student.studentId || 'N/A'}`
      })
    },
    'medical-request': {
      title: 'Confirm Medical Request',
      subtitle: 'This will approve the medical request',
      warningNote: 'Once confirmed, this medical request will be approved and processed. This action cannot be undone.',
      iconColor: 'blue',
      getItemName: (request) => `Medical Request #${request.id || request.requestId || 'Unknown'}`,
      getItemId: (request) => request.id || request.requestId,
      getDisplayInfo: (request) => ({
        primary: `Medical Request #${request.id || request.requestId || 'Unknown'}`,
        secondary: `Patient: ${request.studentName || request.patientName || 'Unknown'}`
      })
    },
    'medication-schedule': {
      title: 'Confirm Medication Schedule',
      subtitle: 'This will approve the medication schedule',
      warningNote: 'Once confirmed, this medication schedule will be active and cannot be undone.',
      iconColor: 'purple',
      getItemName: (schedule) => `Medication Schedule for ${schedule.studentName || 'Unknown'}`,
      getItemId: (schedule) => schedule.id || schedule.scheduleId,
      getDisplayInfo: (schedule) => ({
        primary: `Medication: ${schedule.medicationName || 'Unknown'}`,
        secondary: `Patient: ${schedule.studentName || 'Unknown'}`
      })
    },
    'event-signup': {
      title: 'Confirm Event Signup',
      subtitle: 'This will approve the event signup request',
      warningNote: 'Once confirmed, the student will be registered for this event. This action cannot be undone.',
      iconColor: 'blue',
      getItemName: (signup) => `Event signup for ${signup.studentName || 'Unknown'}`,
      getItemId: (signup) => signup.signupId,
      getDisplayInfo: (signup) => ({
        primary: `${signup.eventTitle || 'Unknown Event'}`,
        secondary: `Student: ${signup.studentName || 'Unknown'} (${signup.studentCode || 'N/A'})`
      })
    },
    'event-signup-reject': {
      title: 'Reject Event Signup',
      subtitle: 'This will reject the event signup request',
      warningNote: 'Once rejected, the student will not be registered for this event. This action cannot be undone.',
      iconColor: 'red',
      getItemName: (signup) => `Event signup for ${signup.studentName || 'Unknown'}`,
      getItemId: (signup) => signup.signupId,
      getDisplayInfo: (signup) => ({
        primary: `${signup.eventTitle || 'Unknown Event'}`,
        secondary: `Student: ${signup.studentName || 'Unknown'} (${signup.studentCode || 'N/A'})`
      })
    }
  };

  return configs[type] || configs['student']; // Default to student config
};

/**
 * Bulk confirmation utility
 * @param {Array} items - Array of items to confirm
 * @param {Function} confirmFunction - Function to confirm individual items
 * @param {Object} options - Confirmation options
 * @returns {Promise}
 */
export const handleBulkConfirmation = async (items, confirmFunction, options = {}) => {
  const { 
    showConfirm = true, 
    confirmMessage = 'Are you sure you want to confirm all items? This action cannot be undone.',
    showSuccessToast,
    showErrorToast 
  } = options;

  // Show browser confirmation for bulk actions
  if (showConfirm) {
    const confirmed = window.confirm(confirmMessage);
    if (!confirmed) return;
  }

  try {
    // Execute confirmations sequentially to avoid overwhelming the server
    let successCount = 0;
    let errorCount = 0;

    for (const item of items) {
      try {
        await confirmFunction(item);
        successCount++;
      } catch (error) {
        console.error('Error confirming item:', error);
        errorCount++;
      }
    }

    if (successCount > 0) {
      showSuccessToast(`Successfully confirmed ${successCount} items!`);
    }
    
    if (errorCount > 0) {
      showErrorToast(`${errorCount} confirmations failed. Please check individual item statuses.`);
    }

  } catch (error) {
    console.error('Bulk confirmation error:', error);
    showErrorToast('Bulk confirmation failed. Please try again.');
  }
};
