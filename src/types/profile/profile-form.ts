export type ProfileForm = {
  username: string;
  displayName: string;
  name: string;
  surname: string;
  avatarUrl: string;
  bio: string;
};

export type ProfileFieldKey = keyof ProfileForm;
