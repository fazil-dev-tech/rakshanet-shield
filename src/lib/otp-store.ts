// Prevents Next.js hot-reloads from wiping the in-memory map
const globalForOtp = globalThis as unknown as { otpStore: Map<string, { otp: string; expiresAt: number }> };
export const otpStore = globalForOtp.otpStore || new Map();
if (process.env.NODE_ENV !== 'production') globalForOtp.otpStore = otpStore;
