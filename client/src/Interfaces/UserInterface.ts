export interface UserColumns {
  user_id: number;
  name: string;
  username: string;
  role: "admin" | "staff";
  is_deleted?: boolean;
}

export interface UserFieldErrors {
  name?: string[];
  username?: string[];
  password?: string[];
  password_confirmation?: string[];
  role?: string[];
}
