export interface UserDetails {
  user_id: number;
  name: string;
  username: string;
  role: "admin" | "staff";
}

export interface LoginCredentialsErrorFields {
  username?: string[];
  password?: string[];
}
