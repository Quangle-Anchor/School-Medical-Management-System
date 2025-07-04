export const forgotPasswordApi = {
  sendOtp: async (email) => {
    // Gọi API gửi OTP về email
    // throw new Error("Email không hợp lệ") nếu lỗi
  },
  verifyOtp: async (email, otp) => {
    // Gọi API xác thực OTP
    // throw new Error("OTP không đúng") nếu lỗi
  },
  resetPassword: async (email, newPassword) => {
    // Gọi API đổi mật khẩu
    // throw new Error("Có lỗi khi đổi mật khẩu") nếu lỗi
  },
};
