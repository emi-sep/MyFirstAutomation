export const AccountEndpoints = {
  authorized: '/Account/v1/Authorized',
  generateToken: '/Account/v1/GenerateToken',
  users: '/Account/v1/User',
  user: (userId: string): string => `/Account/v1/User/${encodeURIComponent(userId)}`
} as const;
