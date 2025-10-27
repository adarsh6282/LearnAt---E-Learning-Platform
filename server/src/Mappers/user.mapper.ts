import { IUser } from "../models/interfaces/auth.interface";
import { UserDTO } from "../DTO/user.dto";

export const toUserDTO=(user:IUser):UserDTO=>(
  {
  _id: user._id.toString(),
  name: user.name,
  username: user.username,
  email: user.email,
  phone: user.phone,
  isBlocked: user.isBlocked,
  profilePicture: user.profilePicture,
  googleId:user.googleId,
  role: user.role,
})

export const toUserDTOList=(users:IUser[]):UserDTO[]=>(
  users.map(toUserDTO)
)