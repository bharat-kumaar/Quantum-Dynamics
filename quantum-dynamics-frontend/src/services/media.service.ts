import api from "@/lib/axios";
import { MediaAsset, MediaResponse } from "@/types/media";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const MediaService = {
  getAssets: async (filters?: { projectId?: string; type?: string }): Promise<MediaAsset[]> => {
    const { data } = await api.get<MediaResponse>('/media', { params: filters });
    return data.data || [];
  },

  getFileUrl: (filename: string): string => {
    return `${API_BASE}/media/file/${filename}`;
  },

  uploadAsset: async (file: File, projectId?: string) => {
    const formData = new FormData();
    formData.append('file', file); 
    
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const { data } = await api.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteAsset: async (id: string) => {
    const { data } = await api.delete(`/media/${id}`);
    return data;
  }
};
