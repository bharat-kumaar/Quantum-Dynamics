import api from "@/lib/axios";
import { LoginRequest, LoginResponse, ApiResponse } from "@/types/auth";
import { RegisterFormData } from "@/validation/auth.schema";

export const AuthService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const cleanCredentials = {
      email: credentials.email ? credentials.email.trim().toLowerCase() : '',
      password: credentials.password
    };
    const response = await api.post<any>('/auth/login', cleanCredentials);
    const data = response.data;
    
    const token = data?.token || data?.data?.token;
    const user = data?.user || data?.data?.user || (data?.data ? { name: data.data.name, email: data.data.email, role: data.data.role, department: data.data.department } : null);
    
    if (token) {
      if (typeof window !== 'undefined') {
        document.cookie = `qd_access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
        localStorage.setItem('qd_access_token', token);
        localStorage.setItem('qd_user', JSON.stringify(user || { name: 'Bharat Kumar', email: cleanCredentials.email }));
      }
    }
    
    return {
      success: true,
      token,
      user,
      message: data?.message || "Login successful"
    };
  },

  register: async (userData: RegisterFormData): Promise<ApiResponse> => {
    const cleanData = {
      ...userData,
      email: userData.email ? userData.email.trim().toLowerCase() : ''
    };
    const { data } = await api.post<ApiResponse>('/auth/register', cleanData);
    return data;
  },

  forgotPassword: async (email: string): Promise<ApiResponse> => {
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const { data } = await api.post<ApiResponse>('/auth/forgot-password', { email: cleanEmail });
    return data;
  },

  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const { data } = await api.put<ApiResponse>(`/auth/reset-password/${token}`, { password });
    return data;
  },

  updateProfile: async (profileData: { name?: string; password?: string }): Promise<ApiResponse> => {
    const { data } = await api.put<ApiResponse>('/auth/profile', profileData);
    return data;
  },

  requestEmailUpdate: async (newEmail: string): Promise<ApiResponse> => {
    const cleanEmail = newEmail ? newEmail.trim().toLowerCase() : '';
    const { data } = await api.post<ApiResponse>('/auth/request-email-update', { newEmail: cleanEmail });
    return data;
  },

  verifyEmailUpdate: async (newEmail: string, otp: string): Promise<ApiResponse> => {
    const cleanEmail = newEmail ? newEmail.trim().toLowerCase() : '';
    const { data } = await api.post<ApiResponse>('/auth/verify-email-update', { newEmail: cleanEmail, otp: otp?.trim() });
    return data;
  }
};
