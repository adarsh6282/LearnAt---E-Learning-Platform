import { Router } from "express";
import { AdminController } from "../controllers/implementations/admin.controller";
import { AdminService } from "../services/implementation/admin.sevices";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import authAdmin from "../middlewares/authAdmin";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { CourseRepository } from "../repository/implementations/course.repository";


const adminRepository=new AdminRepository()
const instructorRepository=new InstructorAuth()
const categoryRepository=new CategoryRepository()
const userRepository=new AuthRepository()
const courseRepository=new CourseRepository()
const adminService=new AdminService(adminRepository,instructorRepository,userRepository,categoryRepository,courseRepository)
const adminController=new AdminController(adminService)

const router=Router()

router.post("/login",adminController.login.bind(adminController))
router.get("/users",authAdmin,adminController.getAllUsers.bind(adminController))
router.get("/tutors",authAdmin,adminController.getAllTutors.bind(adminController))
router.put("/users/block/:email",authAdmin,adminController.blockUnblockUser.bind(adminController))
router.put("/tutors/block/:email",authAdmin,adminController.blockUnblockTutor.bind(adminController))
router.get("/dashboard",authAdmin,adminController.getDashboard.bind(adminController))
router.put("/tutors/verify",authAdmin,adminController.approveTutor.bind(adminController))
router.get("/category",adminController.getCatgeories.bind(adminController))
router.post("/category",adminController.addCategory.bind(adminController))
router.patch(`/category/delete/:id`,adminController.deleteCategory.bind(adminController))
router.patch(`/category/restore/:id`,adminController.restoreCategory.bind(adminController))
router.get("/courses",authAdmin,adminController.getCourses.bind(adminController))
router.put("/courses/:id",authAdmin,adminController.softDeleteCourse.bind(adminController))
router.put("/courses/recover/:id",authAdmin,adminController.recoverCourse.bind(adminController))
router.delete("/tutors/reject/:email",authAdmin,adminController.rejectTutor.bind(adminController))

export default router