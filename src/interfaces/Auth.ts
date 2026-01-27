export interface User {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  active: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
