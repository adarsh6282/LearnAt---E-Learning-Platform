import {IUser} from "../../models/interfaces/auth.interface"

export interface IAuthRepository{
    createUser(userData:Partial<IUser>):Promise<IUser>
    findByEmail(email:string):Promise<IUser|null>,
    findForProfile(email:string):Promise<IUser|null>,
    updateUserByEmail(
    email: string,
    updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
    }>
  ): Promise<IUser|null>
}