import axios from "./axiosInstance";

export const forgotPasswordApi = {
  sendOtp: async (email) => {
    try {
      await axios.post("/api/password-recovery/send-otp", { email });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Email không hợp lệ hoặc không tồn tại."
      );
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      await axios.post("/api/password-recovery/verify-otp", { email, otp });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "OTP không đúng hoặc đã hết hạn."
      );
    }
  },
  resetPassword: async (email, otp, newPassword, confirmPassword) => {
    try {
      await axios.post("/api/password-recovery/reset", {
        email,
        otp,
        newPassword,
        confirmPassword,
      });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Có lỗi khi đổi mật khẩu."
      );
    }
  },
};
