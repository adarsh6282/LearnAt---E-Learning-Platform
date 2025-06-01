import {Route} from "react-router-dom"
import InstructorRegister from "../pages/Instructor/InstructorRegister"
import InstructorLogin from "../pages/Instructor/InstructorLogin"
import OtpPage from "../components/OtpPage"
import ForgotOtpPage from "../components/ForgotOtpPage"
import ForgotPassword from "../components/ForgotPassword"
import ResetPassword from "../components/ResetPassword"

const InstructorRoutes = () => {
  return (
    <>
      <Route path="/instructors/register" element={<InstructorRegister/>}/>
      <Route path="/instructors/login" element={<InstructorLogin/>}/>
      <Route path='/instructors/verify-otp' element={<OtpPage role={"instructors"}/>}/>
      <Route path='/instructors/reset-verify-otp' element={<ForgotOtpPage role="instructors"/>}/>
      <Route path="/instructors/forgotpassword" element={<ForgotPassword role="instructors"/>}/>
      <Route path="/instructors/resetpassword" element={<ResetPassword role="instructors"/>}/>
    </>
  )
}

export default InstructorRoutes
