import api from "@/lib/axios";
import { UserResponse, User } from "@/types/user";

export const UserService = {
  // Matches GET /api/team/ in teamRoutes.js
  getTeamMembers: async (filters?: { role?: string; search?: string }): Promise<UserResponse> => {
    const { data } = await api.get<UserResponse>('/team', { params: filters });
    return data;
  },

  // Matches POST /api/team/
  addTeamMember: async (memberData: { name: string; email: string; role: string; department?: string }) => {
    const { data } = await api.post('/team', memberData);
    return data;
  },

  // Matches PUT /api/team/:id
  updateTeamMember: async (id: string, memberData: Partial<User>) => {
    const { data } = await api.put(`/team/${id}`, memberData);
    return data;
  },

  // Matches DELETE /api/team/:id
  removeTeamMember: async (id: string) => {
    const { data } = await api.delete(`/team/${id}`);
    return data;
  }
};
