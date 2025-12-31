export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  role: UserRole;
  password: string;
}

export interface TimeEntry {
  id: string;
  userId: string;
  date: string;
  project: string;
  hours: number;
  description: string;
}
