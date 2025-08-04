export type DashboardData = {
  totalUsers: number
  totalTutors: number
  totalCourses:number
}

export type AdminLoginResponse = {
  message: string;
  token: string;
  email: string;
};