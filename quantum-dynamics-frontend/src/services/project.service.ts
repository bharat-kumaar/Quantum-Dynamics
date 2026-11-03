import api from "@/lib/axios";
import { PaginatedResponse, ProjectFilters, Project } from "@/types/project";

export const ProjectService = {
  getProjects: async (filters?: ProjectFilters): Promise<PaginatedResponse> => {
    const { data } = await api.get<PaginatedResponse>('/projects', { params: filters });
    return data;
  },

  createProject: async (projectData: Partial<Project>) => {
    const { data } = await api.post('/projects', projectData);
    return data;
  },

  updateProject: async (id: string, projectData: Partial<Project>) => {
    const { data } = await api.put(`/projects/${id}`, projectData);
    return data;
  },

  deleteProject: async (id: string) => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },

  // Fetch a single project by ID
  getProjectById: async (id: string) => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },

  // Assign a team member to a project
  assignTeamToProject: async (id: string, teamMemberIds: string[]) => {
    const { data } = await api.put(`/projects/${id}/team`, { teamMemberIds });
    return data;
  },

  // NEW: Add Milestone to Project
  addMilestone: async (projectId: string, milestoneData: { title: string; status: string; dueDate: string }) => {
    const { data } = await api.post(`/projects/${projectId}/milestones`, milestoneData);
    return data;
  }
};