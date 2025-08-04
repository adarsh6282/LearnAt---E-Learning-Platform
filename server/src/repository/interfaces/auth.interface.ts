import { Types } from "mongoose";
import {IUser} from "../../models/interfaces/auth.interface"

export interface IAuthRepository{
    createUser(userData:Partial<IUser>):Promise<IUser>
    findByEmail(email:string):Promise<IUser|null>,
    findById(userid:string|Types.ObjectId):Promise<IUser|null>,
    findForProfile(email:string):Promise<IUser|null>,
    updateUserByEmail(
    email: string,
    updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
    }>
  ): Promise<IUser|null>,
  findUsersByIds(ids:string[]):Promise<IUser[]>
}