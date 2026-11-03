import api from "@/lib/axios";

export const DashboardService = {
  getOverview: async () => {
    const { data } = await api.get('/dashboard');
    return data;
  },
  
  getMetrics: async () => {
    const { data } = await api.get('/dashboard/metrics');
    return data;
  },
  
  getActivities: async () => {
    const { data } = await api.get('/dashboard/activities');
    return data;
  },

  // NEW: Global Search API Connection
  globalSearch: async (query: string) => {
    const { data } = await api.get('/dashboard/search', { params: { q: query } });
    return data;
  },

  // Add this inside DashboardService:
  getNotifications: async () => {
    const { data } = await api.get('/dashboard/notifications');
    return data;
  }
};