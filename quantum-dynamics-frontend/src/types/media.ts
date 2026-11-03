export interface MediaAsset {
  _id: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  createdAt: string;
  uploadedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  project?: {
    _id: string;
    name: string;
    client: string;
  };
}

export interface MediaResponse {
  success: boolean;
  message: string;
  data: MediaAsset[];
}