import React from 'react';
import { X, UserCheck, CheckCircle, FileCheck, Calendar, XCircle } from 'lucide-react';

/**
 * Reusable confirmation modal component
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Function} props.onConfirm - Confirmation callback
 * @param {Function} props.onCancel - Cancel callback
 * @param {Object} props.item - Item being confirmed
 * @param {Object} props.config - Modal configuration
 * @param {boolean} props.isConfirming - Whether confirmation is in progress
 * @returns {JSX.Element}
 */
const ConfirmationModal = ({ 
  show, 
  onConfirm, 
  onCancel, 
  item, 
  config, 
  isConfirming = false 
}) => {
  if (!show || !item) return null;

  const getIcon = () => {
    const iconProps = { className: "w-5 h-5" };
    const iconColor = config.iconColor || 'green';
    
    const colorClasses = {
      green: `text-green-600`,
      blue: `text-blue-600`,
      purple: `text-purple-600`,
      yellow: `text-yellow-600`,
      red: `text-red-600`
    };

    switch (config.type || 'default') {
      case 'medical-request':
        return <FileCheck {...iconProps} className={`w-5 h-5 ${colorClasses[iconColor]}`} />;
      case 'medication-schedule':
        return <Calendar {...iconProps} className={`w-5 h-5 ${colorClasses[iconColor]}`} />;
      case 'event-signup':
        return <CheckCircle {...iconProps} className={`w-5 h-5 ${colorClasses[iconColor]}`} />;
      case 'event-signup-reject':
        return <XCircle {...iconProps} className={`w-5 h-5 ${colorClasses[iconColor]}`} />;
      case 'student':
      default:
        return <UserCheck {...iconProps} className={`w-5 h-5 ${colorClasses[iconColor]}`} />;
    }
  };

  const getBgColor = () => {
    const colorClasses = {
      green: 'bg-green-100',
      blue: 'bg-blue-100',
      purple: 'bg-purple-100',
      yellow: 'bg-yellow-100',
      red: 'bg-red-100'
    };
    return colorClasses[config.iconColor] || 'bg-green-100';
  };

  const getButtonColor = () => {
    const colorClasses = {
      green: 'bg-green-600 hover:bg-green-700',
      blue: 'bg-blue-600 hover:bg-blue-700',
      purple: 'bg-purple-600 hover:bg-purple-700',
      yellow: 'bg-yellow-600 hover:bg-yellow-700',
      red: 'bg-red-600 hover:bg-red-700'
    };
    return colorClasses[config.iconColor] || 'bg-green-600 hover:bg-green-700';
  };

  const displayInfo = config.getDisplayInfo ? config.getDisplayInfo(item) : {
    primary: 'Item',
    secondary: 'Unknown'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.title || 'Confirm Action'}
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isConfirming}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-10 h-10 ${getBgColor()} rounded-full flex items-center justify-center`}>
              {getIcon()}
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-900">
                {config.title || 'Confirmation'}
              </h4>
              <p className="text-sm text-gray-500">
                {config.subtitle || 'This action requires confirmation'}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-gray-700">
            Are you sure you want to confirm <strong>{displayInfo.primary}</strong>
            {displayInfo.secondary && (
              <span> ({displayInfo.secondary})</span>
            )}?
          </p>
          
          {config.warningNote && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                <strong>Note:</strong> {config.warningNote}
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isConfirming}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item)}
            className={`px-4 py-2 text-white rounded-md transition-colors flex items-center ${getButtonColor()}`}
            disabled={isConfirming}
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirming...
              </>
            ) : (
              <>
                {getIcon()}
                <span className="ml-2">
                  {config.confirmButtonText || 'Confirm'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
