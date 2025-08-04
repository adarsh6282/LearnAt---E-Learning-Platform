import { IAdminController } from "../interfaces/admin.interface";
import { IAdminService } from "../../services/interfaces/admin.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";
import jwt from "jsonwebtoken";
import { generateToken } from "../../utils/jwt";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const {
        token,
        email: adminEmail,
        adminRefreshToken,
      } = await this._adminService.login(email, password);

      res.cookie("adminRefreshToken", adminRefreshToken, {
        path: "/api/admin",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res
        .status(httpStatus.OK)
        .json({ message: "Login successful", token, email: adminEmail });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboardData = await this._adminService.getDashboardData();
      res.status(httpStatus.OK).json(dashboardData);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async blockUnblockUser(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { blocked } = req.body;
    try {
      const updatedUser = await this._adminService.blockUnblockUser(
        email,
        blocked
      );
      res.status(httpStatus.OK).json({
        message: `Tutor has been ${blocked ? "blocked" : "unblocked"}`,
        user: updatedUser,
      });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async blockUnblockTutor(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { blocked } = req.body;
    try {
      const updatedTutor = await this._adminService.blockUnblockTutor(
        email,
        blocked
      );
      res.status(httpStatus.OK).json({
        message: `User has been ${blocked ? "blocked" : "unblocked"}`,
        tutor: updatedTutor,
      });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const { users, total, totalPages } = await this._adminService.getAllUsers(
        page,
        limit,
        search
      );
      res
        .status(httpStatus.OK)
        .json({ users, total, totalPages, currentPage: page });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const isVerified = req.query.isVerified;
      const search = (req.query.search as string) || "";

      const filter: any = {};
      if (isVerified === "true") filter.isVerified = true;
      if (isVerified === "false") filter.isVerified = false;

      if (search.trim() !== "") {
        filter.$or = [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      const { tutors, total, totalPages } =
        await this._adminService.getAllTutors(page, limit, filter);
      res
        .status(httpStatus.OK)
        .json({ tutors, total, totalPages, currentPage: page });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async approveTutor(req: Request, res: Response): Promise<void> {
    const { email } = req.body;

    try {
      const approve = await this._adminService.verifyTutor(email);
      res.status(httpStatus.OK).json("Tutor Approved Successfully");
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async rejectTutor(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const { reason } = req.body;

    try {
      const deleted = await this._adminService.rejectTutor(email, reason);
      if (!deleted) {
        res.status(httpStatus.NOT_FOUND).json({ message: "Tutor Not Found" });
      }
      res
        .status(httpStatus.OK)
        .json({ message: "Tutor rejected successfully" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async addCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const category = await this._adminService.addCategory(name);
      res
        .status(httpStatus.CREATED)
        .json({ message: "Category Added Successfully" });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getCatgeories(req: Request, res: Response): Promise<void> {
    try {
      const category = await this._adminService.getCategories();
      res.status(httpStatus.OK).json(category);
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this._adminService.deleteCategory(id);
      res.status(httpStatus.OK).json({ message: "Category disabled" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async restoreCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this._adminService.restoreCategory(id);
      res.status(httpStatus.OK).json({ message: "Category restored" });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getCourses(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const courses = await this._adminService.getCoursesService(page, limit);
      res.status(httpStatus.OK).json(courses);
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async softDeleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updated = await this._adminService.softDeleteCourseS(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Course disabled successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Soft delete failed", error });
    }
  }

  async recoverCourse(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updated = await this._adminService.recoverCourseS(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Course enabled successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Soft delete failed", error });
    }
  }

  async getAllReviews(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;
      const { reviews, total, totalPages } =
        await this._adminService.getAllReviews(page, limit);
      res
        .status(httpStatus.OK)
        .json({ reviews, total, totalPages, currentPage: page });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async hideReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const review = await this._adminService.hideReview(id);
      res.status(httpStatus.OK).json({ message: "Review hidden successfully" });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async unhideReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const review = await this._adminService.unhideReview(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Review retrieved successfully" });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async deleteReview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    try {
      const review = this._adminService.deleteReview(id);
      res
        .status(httpStatus.OK)
        .json({ message: "Review Deleted Successfully" });
    } catch (err: any) {
      console.log(err);
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getWallet(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const {wallet,total,totalPages,transactions} = await this._adminService.getWallet(page, limit);
      res.status(httpStatus.OK).json({
        balance: wallet.balance,
        transactions,
        total,
        totalPages,
        currentPage: page,
      });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    const token = req.cookies.adminRefreshToken;

    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({ message: "No Refresh Token" });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as {
        _id: string;
        email: string;
        role: "user" | "instructor" | "admin";
      };
      if (decoded.role !== "admin") {
        res.status(httpStatus.FORBIDDEN).json({ message: "Invalid role" });
        return;
      }

      const adminToken = generateToken(
        decoded._id,
        decoded.email,
        decoded.role
      );
      res.status(httpStatus.OK).json({ token: adminToken });
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getComplaints(req: Request, res: Response): Promise<void> {
    try{
      const complaints=await this._adminService.getComplaints()
      res.status(httpStatus.OK).json(complaints)
    } catch(err){
      console.log(err)
    } 
  }

  async responseComplaint(req: Request, res: Response): Promise<void> {
    try{
    const {status,response}=req.body
    const {id}=req.params
    const complaint = await this._adminService.responseComplaint(id,status,response)
    res.status(httpStatus.OK).json({message:"Response Submitted successfully"}) 
    }catch(err:any){
      console.log(err)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:err.message})
    }
  }

  async getCourseStats(req: Request, res: Response): Promise<void> {
    try{
      const courseStats=await this._adminService.getCourseStats()
      res.status(httpStatus.OK).json(courseStats)
    }catch(err:any){
      console.log(err)
    }
  }

  async getIncomeStats(req: Request, res: Response): Promise<void> {
    try{
      const incomeStats=await this._adminService.getIncomeStats()
      res.status(httpStatus.OK).json(incomeStats)
    }catch(err:any){
      console.log(err)
    }
  }

  async getSpecificCourseforAdmin(req: Request, res: Response): Promise<void> {
    const {courseId}=req.params
    if(!courseId){
      res.status(httpStatus.NOT_FOUND).json({message:"Course not found"})
      return
    }
    const course=await this._adminService.getSpecificCourseForAdmin(courseId)
    res.status(httpStatus.OK).json(course)
  }

  async getSpecificTutor(req: Request, res: Response): Promise<void> {
    try{
      const {id}=req.params
      const tutor=await this._adminService.getSpecificTutor(id)
      res.status(httpStatus.OK).json(tutor)
    }catch(err){
      console.log(err)
    }
  }

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const notifications = await this._adminService.getNotifications(userId);
      res.status(httpStatus.OK).json(notifications);
    } catch (err) {
      console.log(err)
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const notification = await this._adminService.markAsRead(notificationId);
      res.status(httpStatus.OK).json({ message: "Message Read" });
    } catch (err) {
      console.log(err)
    }
  }

  async logOut(req: Request, res: Response): Promise<void> {
    res.clearCookie("adminRefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/admin",
    });
    res.status(httpStatus.OK).json({ message: "Logged out successfully" });
  }
}
