export interface UserRef {
  _id: string;
  name: string;
  email?: string;
  role?: string;
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  client: string;
  status: 'PLANNING' | 'IN PROGRESS' | 'COMPLETED';
  dueDate?: string;
  teamLead?: string;
  createdBy?: UserRef;
  createdAt: string;
  updatedAt: string;
  team?: UserRef[];
  milestones?: Array<{
    _id?: string;
    title: string;
    status: string;
    dueDate: string;
  }>;
}

export interface ProjectFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse {
  success: boolean;
  message: string;
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}