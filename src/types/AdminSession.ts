export interface AdminSession {
  id: string;
  userId: string;
  username: string;
  createdAt: Date;
  expiresAt: Date;
  lastActivity: Date;
}