import axios from "./axiosInstance";

export const forgotPasswordApi = {
  sendOtp: async (email) => {
    try {
      await axios.post("/api/password-recovery/send-otp", { email });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Invalid email or email does not exist."
      );
    }
  },
  verifyOtp: async (email, otp) => {
    try {
      await axios.post("/api/password-recovery/verify-otp", { email, otp });
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Invalid OTP or OTP has expired."
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
        err.response?.data?.message || "Error occurred while changing password."
      );
    }
  },
};
