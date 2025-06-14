import { IAdminController } from "../interfaces/admin.interface";
import { IAdminService } from "../../services/interfaces/admin.services";
import { Request, Response } from "express";
import { httpStatus } from "../../constants/statusCodes";

export class AdminController implements IAdminController {
  constructor(private _adminService: IAdminService) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const { token, email: adminEmail } = await this._adminService.login(
        email,
        password
      );
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
      res
        .status(httpStatus.OK)
        .json({
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
      res
        .status(httpStatus.OK)
        .json({
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
      const users = await this._adminService.getAllUsers();
      res.status(httpStatus.OK).json(users);
    } catch (err: any) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: err.message });
    }
  }

  async getAllTutors(req: Request, res: Response): Promise<void> {
    try {
      const tutors = await this._adminService.getAllTutors();
      res.status(httpStatus.OK).json(tutors);
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
        .json({ message: "Tutor rejected and deleted successfully" });
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
      const courses = await this._adminService.getCoursesService(page,limit);
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
      const {id} = req.params;
      const updated = await this._adminService.softDeleteCourseS(id);
      res.status(httpStatus.OK).json({courses: updated });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Soft delete failed", error });
    }
  }

  async recoverCourse(req: Request, res: Response): Promise<void> {
      try{
        const {id}=req.params
        const updated=await this._adminService.recoverCourseS(id)
        res.status(httpStatus.OK).json({courses:updated})
      } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: "Soft delete failed", error });
    }
  }
}
