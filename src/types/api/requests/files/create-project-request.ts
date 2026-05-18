export type CreateProjectRequest = {
  name: string;
  description?: string | null;
  fileUrl?: string | null;
  isPrivate: boolean;
};
