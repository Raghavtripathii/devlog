// All shared TypeScript types in one place.
// These match the shapes returned by the FastAPI backend.

export interface User {
  id: string;
  username: string;
  email: string;
  is_public: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  language: string;
  hours: number;
  what_i_built: string;
  mood: number;
  logged_at: string;
}

export interface Goal {
  id: string;
  title: string;
  target_hours: number;
  week_start: string;
  created_at: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface WeeklyRecap {
  week_start: string;
  total_hours: number;
  session_count: number;
  recap: string;
}

export interface SessionCreateInput {
  language: string;
  hours: number;
  what_i_built: string;
  mood: number;
}

export interface GoalCreateInput {
  title: string;
  target_hours: number;
  week_start: string;
}