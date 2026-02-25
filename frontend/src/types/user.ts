export interface User {
  id: string;
  username: string;
  email: string;
  hashed_password?: string;
  created_at: string;
  updated_at: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}