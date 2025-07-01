import React, { useState } from "react";
import { fakeForgotPasswordApi } from "./fakeForgotPasswordApi";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (pw1 !== pw2) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      await fakeForgotPasswordApi.resetPassword(pw1);
      navigate("/forgot-password/success");
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
        <h2 className="text-xl font-bold text-center mb-4">Password Change</h2>
        <input
          type="password"
          placeholder="Set new Password"
          className="w-full border px-3 py-2 rounded mb-2"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm new Password"
          className="w-full border px-3 py-2 rounded mb-2"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? "Changing..." : "Change password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
