// Prevents Next.js hot-reloads from wiping the in-memory map
export interface UserProfile {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  createdAt: number;
}

const globalForUsers = globalThis as unknown as { userStore: Map<string, UserProfile> };
export const userStore = globalForUsers.userStore || new Map<string, UserProfile>();
if (process.env.NODE_ENV !== 'production') globalForUsers.userStore = userStore;
