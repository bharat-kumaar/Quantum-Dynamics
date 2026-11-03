export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'User' | 'admin' | 'Team Lead' | 'member' | 'Developer' | 'Project Manager';
  department: string;
  avatar?: string;
  createdAt?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
}