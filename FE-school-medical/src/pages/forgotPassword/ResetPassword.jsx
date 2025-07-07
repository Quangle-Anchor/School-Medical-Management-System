import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { forgotPasswordApi } from "../../api/forgotPasswordApi";
import logo from "../../assets/img/1.png";
import backgroundImg from "../../assets/img/back.png";

const ResetPassword = () => {
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const otp = location.state?.otp;

  if (!email || !otp) {
    navigate("/forgot-password");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    // Validate password
    if (pw1.length < 8) {
      setError("Mật khẩu phải có ít nhất 8 ký tự.");
      return;
    }
    if (!/\d/.test(pw1) || !/[a-zA-Z]/.test(pw1)) {
      setError("Mật khẩu phải chứa cả chữ và số.");
      return;
    }
    if (pw1 !== pw2) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setLoading(true);
    try {
      await forgotPasswordApi.resetPassword(email, otp, pw1, pw2);
      navigate("/forgot-password/success");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.");
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
              Reset password
            </h2>
            <p className="text-white/80">
              Vui lòng nhập mã OTP mà chúng tôi đã gửi cho bạn qua Email
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative mb-2">
              <input
                type={showPw1 ? "text" : "password"}
                placeholder="Mật khẩu mới"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none"
                value={pw1}
                onChange={(e) => setPw1(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowPw1((v) => !v)}
                tabIndex={0}
              >
                {showPw1 ? "🙈" : "👁️"}
              </span>
            </div>
            <div className="relative mb-2">
              <input
                type={showPw2 ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 backdrop-blur-sm focus:outline-none"
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                required
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-300"
                onClick={() => setShowPw2((v) => !v)}
                tabIndex={0}
              >
                {showPw2 ? "🙈" : "👁️"}
              </span>
            </div>
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 backdrop-blur-sm"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi"}
            </button>
            <div className="text-center mt-4 text-white/80">
              Muốn quay trở lại?{" "}
              <span
                className="text-blue-800 hover:text-blue-100 font-semibold transition-colors cursor-pointer"
                onClick={() => navigate("/login")}
              >
                Đăng nhập
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
