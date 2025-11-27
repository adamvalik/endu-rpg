import { User } from 'firebase/auth';

export interface SignUpOrLogInResponse {
  status: string;
  isNewUser: boolean;
  customToken: string;
  user: {
    uid: string;
    email: string;
    displayName?: string;
  };
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
}
