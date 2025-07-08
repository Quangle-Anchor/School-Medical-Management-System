import React from "react";

const UserDetailModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">User Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-md transition-colors"
          >
            <span className="text-xl">×</span>
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <b>Full Name:</b> {user.fullName}
          </div>
          <div>
            <b>Email:</b> {user.email}
          </div>
          <div>
            <b>Phone:</b> {user.phone}
          </div>
          <div>
            <b>Username:</b> {user.username}
          </div>
          <div>
            <b>Role:</b> {user.role || "N/A"}
          </div>
          {user.id && (
            <div>
              <b>User ID:</b> {user.id}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailModal;
