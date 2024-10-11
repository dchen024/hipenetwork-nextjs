export type User = {
  first_name: string | null;
  last_name: string | null;
  email: string;
  username: string | null;
  profile_picture: string | null;
  description: string | null;
  work_history: Record<string, any> | null;
  education_history: Record<string, any> | null;
  skills: Record<string, any> | null;
};