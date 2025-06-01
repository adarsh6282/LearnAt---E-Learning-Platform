import {Route} from "react-router-dom"
import UserRegister from '../pages/User/UserRegister'
import UserLogin from '../pages/User/UserLogin'
import LandingPage from "../pages/User/UserLandingPage"
import OtpPage from "../components/OtpPage"
import ForgotPassword from "../components/ForgotPassword"
import ForgotOtpPage from "../components/ForgotOtpPage"
import ResetPassword from "../components/ResetPassword"

const UserRoutes = () => {
  return (
      <>
        <Route path='/users/register' element={<UserRegister/>}/>
        <Route path='/users/login' element={<UserLogin/>}/>
        <Route path='/' element={<LandingPage/>}/>
        <Route path='/users/verify-otp' element={<OtpPage role="users"/>}/>
        <Route path='/users/reset-verify-otp' element={<ForgotOtpPage role="users"/>}/>
        <Route path="/users/forgotpassword" element={<ForgotPassword role="users"/>}/>
        <Route path="/users/resetpassword" element={<ResetPassword role="users"/>}/>
      </>
  )
}

export default UserRoutes
