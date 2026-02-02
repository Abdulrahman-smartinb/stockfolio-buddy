export interface User {
  _id: string;
  fullName: string;
  phone: string;
  email?: string;
  country: String;
  active: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
