export interface getUserDto {
  page: number;
  limit?: number;
  username?: string;
  role?: number; // roleId
  gender?: number;
}
