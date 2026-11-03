export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  utilization: {
    percentage: number;
  };
}

export interface RecentActivity {
  user: string;
  action: string;
  target: string;
  time: string;
}

export interface DashboardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}