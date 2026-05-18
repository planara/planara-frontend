// Rest
import { restClient } from '@/shared/api';
// Types
import type { UploadFileResponse } from '@/types/api/responses/files';

export const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await restClient.post<UploadFileResponse>('/files/upload', formData);

  return response.data;
};

export const createFileDownloadUrl = (fileId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return `${apiUrl}/files/${fileId}/download`;
};
