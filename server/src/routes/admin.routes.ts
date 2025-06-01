import { Router } from "express";
import { AdminController } from "../controllers/implementations/admin.controller";
import { AdminService } from "../services/implementation/admin.sevices";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";


const adminRepository=new AdminRepository()
const instructorRepository=new InstructorAuth()
const adminService=new AdminService(adminRepository,instructorRepository)
const adminController=new AdminController(adminService)

const router=Router()

router.get("/users",adminController.getAllUsers.bind(adminController))
router.get("/tutors",adminController.getAllTutors.bind(adminController))
router.put("/tutors/verify",adminController.approveTutor.bind(adminController))
router.delete("/tutors/reject/:email",adminController.rejectTutor.bind(adminController))

export default router