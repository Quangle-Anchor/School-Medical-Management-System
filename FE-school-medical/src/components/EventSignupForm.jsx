import React, { useState, useEffect } from 'react';
import { eventSignupAPI } from '../api/eventSignupApi';
import { studentAPI } from '../api/studentsApi';
import { X, Calendar, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const EventSignupForm = ({ isOpen, onClose, event, onSignupSuccess, signupAllMode = false }) => {
  const [formData, setFormData] = useState({
    eventId: '',
    studentId: ''
  });
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState('');
  const [existingSignups, setExistingSignups] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        eventId: event.eventId,
        studentId: ''
      });
      fetchStudents();
      fetchExistingSignups();
      
      // If in signup all mode, initially select all available students
      if (signupAllMode) {
        setSelectedStudents([]);
      }
    }
  }, [isOpen, event, signupAllMode]);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      const studentsData = await studentAPI.getMyStudents();
      const studentsArray = Array.isArray(studentsData) ? studentsData : [];
      setStudents(studentsArray);
      
      // If in signup all mode, select all students that aren't already signed up
      if (signupAllMode && studentsArray.length > 0) {
        // Wait for existing signups to be fetched first
        setTimeout(() => {
          const eligibleStudents = studentsArray.filter(student => 
            !isStudentAlreadySignedUp(student.studentId)
          );
          setSelectedStudents(eligibleStudents.map(student => student.studentId.toString()));
        }, 100);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load your children. Please try again.');
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchExistingSignups = async () => {
    try {
      if (event?.eventId) {
        const signups = await eventSignupAPI.getSignupsByEvent(event.eventId);
        setExistingSignups(Array.isArray(signups) ? signups : []);
      }
    } catch (error) {
      console.error('Error fetching existing signups:', error);
      setExistingSignups([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStudentToggle = (studentId) => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  const toggleSelectAll = () => {
    const eligibleStudents = students.filter(student => 
      !isStudentAlreadySignedUp(student.studentId)
    );
    
    if (selectedStudents.length === eligibleStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(eligibleStudents.map(student => student.studentId.toString()));
    }
  };

  const isStudentAlreadySignedUp = (studentId) => {
    return existingSignups.some(signup => 
      signup.studentId === parseInt(studentId) && 
      (signup.status === 'PENDING' || signup.status === 'APPROVED')
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (signupAllMode) {
        // Handle multiple student signups
        if (selectedStudents.length === 0) {
          setError('Please select at least one student to sign up for this event.');
          setLoading(false);
          return;
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const studentId of selectedStudents) {
          try {
            const signupData = {
              eventId: parseInt(formData.eventId),
              studentId: parseInt(studentId)
            };
            await eventSignupAPI.createSignup(signupData);
            successCount++;
          } catch (error) {
            errorCount++;
            const student = students.find(s => s.studentId.toString() === studentId);
            errors.push(`${student?.fullName || 'Student'}: ${error.message}`);
          }
        }

        if (successCount > 0) {
          showSuccess(`Successfully signed up ${successCount} student(s) for the event!`);
        }
        
        if (errorCount > 0) {
          showError(`Failed to sign up ${errorCount} student(s). ${errors.join(', ')}`);
        }

        if (successCount > 0) {
          // Reset form and call success callback
          setFormData({ eventId: event?.eventId || '', studentId: '' });
          setSelectedStudents([]);
          if (onSignupSuccess) onSignupSuccess();
          onClose();
        }
      } else {
        // Handle single student signup
        if (!formData.studentId) {
          setError('Please select a student to sign up for this event.');
          setLoading(false);
          return;
        }

        // Check if student is already signed up
        if (isStudentAlreadySignedUp(formData.studentId)) {
          setError('This student is already signed up for this event.');
          setLoading(false);
          return;
        }

        const signupData = {
          eventId: parseInt(formData.eventId),
          studentId: parseInt(formData.studentId)
        };

        await eventSignupAPI.createSignup(signupData);

        // Show success message
        showSuccess('Successfully signed up for the event!');

        // Reset form
        setFormData({ eventId: event?.eventId || '', studentId: '' });
        if (onSignupSuccess) onSignupSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error signing up for event:', error);
      setError(error.message || 'Failed to sign up for the event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !event) return null;

  const eventDate = new Date(event.scheduleDate);
  const isEventPast = eventDate < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
            Sign Up for Event
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Event Information */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">{event.title || event.eventName}</h3>
          <p className="text-blue-700 text-sm mb-2">{event.description}</p>
          <div className="flex flex-wrap gap-4 text-sm text-blue-600">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {eventDate.toLocaleDateString()} at {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {event.location && (
              <span>📍 {event.location}</span>
            )}
            {event.category && (
              <span className="bg-blue-100 px-2 py-1 rounded text-xs font-medium">
                {event.category}
              </span>
            )}
          </div>
        </div>

        {isEventPast ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            This event has already occurred. You cannot sign up for past events.
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  {signupAllMode ? 'Select Children to Sign Up' : 'Select Student'} <span className="text-red-500">*</span>
                </label>
                {loadingStudents ? (
                  <div className="flex items-center py-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    <span className="text-sm text-gray-600">Loading your children...</span>
                  </div>
                ) : students.length > 0 ? (
                  signupAllMode ? (
                    /* Bulk Mode - Show checkboxes for multiple selection */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          {selectedStudents.length} of {students.filter(s => !isStudentAlreadySignedUp(s.studentId)).length} students selected
                        </span>
                        <button
                          type="button"
                          onClick={toggleSelectAll}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {selectedStudents.length === students.filter(s => !isStudentAlreadySignedUp(s.studentId)).length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-md">
                        {students.map(student => {
                          const isAlreadySignedUp = isStudentAlreadySignedUp(student.studentId);
                          return (
                            <div 
                              key={student.studentId} 
                              className={`flex items-center p-3 border-b border-gray-100 last:border-b-0 ${
                                isAlreadySignedUp ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                id={`student-${student.studentId}`}
                                checked={selectedStudents.includes(student.studentId.toString())}
                                onChange={() => handleStudentToggle(student.studentId.toString())}
                                disabled={isAlreadySignedUp}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <label 
                                htmlFor={`student-${student.studentId}`}
                                className={`ml-3 flex-1 cursor-pointer ${isAlreadySignedUp ? 'text-gray-500' : ''}`}
                              >
                                <div className="text-sm font-medium">
                                  {student.fullName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Code: {student.studentCode || student.studentId} - {student.className || 'No Class'}
                                  {isAlreadySignedUp && ' - Already signed up'}
                                </div>
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Single Mode - Show dropdown */
                    <select
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Choose a student</option>
                      {students.map(student => {
                        const isAlreadySignedUp = isStudentAlreadySignedUp(student.studentId);
                        return (
                          <option 
                            key={student.studentId} 
                            value={student.studentId}
                            disabled={isAlreadySignedUp}
                          >
                            {student.fullName} (Code: {student.studentCode || student.studentId}) - {student.className || 'No Class'}
                            {isAlreadySignedUp ? ' - Already signed up' : ''}
                          </option>
                        );
                      })}
                    </select>
                  )
                ) : (
                  <div className="text-gray-500 p-4 border border-gray-200 rounded-md">
                    No students found. Please add your children to your account first.
                  </div>
                )}
              </div>

              {/* Existing Signups Info */}
              {existingSignups.length > 0 && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Students already signed up:</h4>
                  <div className="space-y-1">
                    {existingSignups.map(signup => (
                      <div key={signup.signupId} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{signup.studentName}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          signup.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          signup.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {signup.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || students.length === 0 || isEventPast || (signupAllMode && selectedStudents.length === 0)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {signupAllMode ? 'Signing up students...' : 'Signing up...'}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {signupAllMode ? `Sign Up ${selectedStudents.length} Student${selectedStudents.length !== 1 ? 's' : ''}` : 'Sign Up'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EventSignupForm;
