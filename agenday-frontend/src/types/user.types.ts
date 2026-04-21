export type UserRole = 'PROFESSIONAL' | 'CLIENT';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
