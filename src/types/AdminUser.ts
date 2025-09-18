// types/auth.ts
export interface AdminUser {
  id: string;
  username: string;
  password: string; // In production, this should be hashed
  createdAt: Date;
}

