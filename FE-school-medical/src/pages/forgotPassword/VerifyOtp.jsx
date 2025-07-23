import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../api/forgotPasswordApi";
import logo from "../../assets/img/1.png";
import backgroundImg from "../../assets/img/back.png";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");
  const handleResendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setResendMsg("");
    try {
      await forgotPasswordApi.sendOtp(email);
      setResendMsg("New OTP code has been sent to your email.");
    } catch {
      setError("Unable to resend OTP code. Please try again later.");
    }
  };
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  if (!email) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPasswordApi.verifyOtp(email, otp);
      navigate("/forgot-password/reset", { state: { email, otp } });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20"></div>
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-white/20 rounded-full backdrop-blur-sm mb-4">
              <img
                alt="Logo"
                src={logo}
                className="h-16 w-16 rounded-full shadow-lg"
              />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Enter verification code
            </h2>
            <p className="text-white/80">
              Enter the OTP code sent to your email
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Enter OTP code"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent transition-all duration-300"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="mb-2">
              <a
                href="#"
                className="font-semibold underline text-blue-800 hover:text-blue-100 transition-colors"
                onClick={handleResendOtp}
              >
                Resend OTP code
              </a>
              {resendMsg && (
                <div className="w-full py-3 px-4 mt-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg text-center">
                  {resendMsg}
                </div>
              )}
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
