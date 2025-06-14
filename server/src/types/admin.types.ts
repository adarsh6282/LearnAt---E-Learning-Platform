export interface AdminLoginResponse{
    token: string
    email: string
}

export interface DashboardData{
    totalUsers:number,
    totalTutors:number
}