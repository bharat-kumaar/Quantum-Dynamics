// src/types/auth.ts

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: any;
  message?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}