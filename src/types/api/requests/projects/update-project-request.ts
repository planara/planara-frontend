export type UpdateProjectRequest = {
  projectId: string;
  name?: string | null;
  description?: string | null;
  fileUrl?: string | null;
};
