// Minimal user type to avoid firebase dependency in shared
export interface MinimalUser {
  uid: string;
  email: string | null;
  displayName?: string | null;
}

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
  user: any | null; // Using any to avoid firebase dependency
  loading: boolean;
  isAuthenticated: boolean;
}
