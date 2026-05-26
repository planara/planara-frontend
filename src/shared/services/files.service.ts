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

export const updateFile = async (fileId: string, file: File) => {
  const formData = new FormData();

  formData.append('file', file);

  const response = await restClient.put<UploadFileResponse>(`/files/${fileId}`, formData);

  return response.data;
};

export const createFileDownloadUrl = (fileId: string) => {
  const apiUrl = import.meta.env.VITE_API_URL.replace(/\/$/, '');

  return `${apiUrl}/files/${fileId}/download`;
};

export const getFileIdFromDownloadUrl = (fileUrl?: string | null) => {
  if (!fileUrl) {
    return null;
  }

  try {
    const url = new URL(fileUrl, window.location.origin);
    const match = url.pathname.match(/\/files\/([^/]+)\/download/i);

    return match?.[1] ?? null;
  } catch {
    const match = fileUrl.match(/\/files\/([^/]+)\/download/i);

    return match?.[1] ?? null;
  }
};
