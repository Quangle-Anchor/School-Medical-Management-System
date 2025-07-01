import React from "react";
import { useNavigate } from "react-router-dom";

const RecoverySuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Password changed
        </h2>
        <div className="text-2xl font-bold text-green-600 mb-2">Successful</div>
        <p className="mb-4 text-gray-600">
          Your password has been successfully changed, you will be able to login
          with your new password
        </p>
        <button
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
          onClick={() => navigate("/login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
};

export default RecoverySuccess;
