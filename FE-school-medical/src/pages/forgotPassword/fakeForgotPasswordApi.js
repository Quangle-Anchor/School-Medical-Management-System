export const fakeForgotPasswordApi = {
  sendRecoveryEmail: async (email) => {
    // Fake delay
    await new Promise((r) => setTimeout(r, 1000));
    // Giả lập thành công
    if (email) return { success: true };
    throw new Error("Email không tồn tại!");
  },
  resetPassword: async (newPassword) => {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true };
  },
};
