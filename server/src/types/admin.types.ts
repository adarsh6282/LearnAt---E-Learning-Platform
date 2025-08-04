export interface AdminLoginResponse{
    adminRefreshToken:string,
    token: string
    email: string
}

export interface DashboardData{
    totalUsers:number,
    totalTutors:number,
    totalCourses:number
}