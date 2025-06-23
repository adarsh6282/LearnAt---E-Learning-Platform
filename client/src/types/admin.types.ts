export type DashboardData = {
  totalUsers: number
  totalTutors: number
}

export type AdminLoginResponse = {
  message: string;
  token: string;
  email: string;
};