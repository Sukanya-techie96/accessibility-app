export interface User {
  id: string;
  fullName: string;
  email: string;
}

export type AuthMode = 'login' | 'signup';