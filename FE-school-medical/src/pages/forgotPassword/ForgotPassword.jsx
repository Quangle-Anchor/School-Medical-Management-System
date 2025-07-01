import React, { useState } from "react";
import { fakeForgotPasswordApi } from "./fakeForgotPasswordApi";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await fakeForgotPasswordApi.sendRecoveryEmail(email);
      navigate("/forgot-password/reset");
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold text-center mb-4">Account Recovery</h2>
        <p className="text-center text-gray-600 mb-4">
          To get a verification code, first confirm the email address you added
          to your account
        </p>
        <input
          type="email"
          placeholder="Enter e-mail address"
          className="w-full border px-3 py-2 rounded mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
