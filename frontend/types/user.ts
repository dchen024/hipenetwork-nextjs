import { UUID } from "crypto";

export type User = {
  id: UUID;
  first_name: string | null;
  last_name: string | null;
  email: string;
  username: string | null;
  profile_picture: string | null;
  description: string | null;
  work_history?: {
    title: string;
    company: string;
    company_img: string;
    description: string;
    start_date: string;
    end_date: string;
  }[];
  education_history?: {
    school_name: string;
    degree: string;
    start_date: string;
    end_date: string;
    description?: string;
    school_img: string;
  }[];
  skills?: string[];
};
