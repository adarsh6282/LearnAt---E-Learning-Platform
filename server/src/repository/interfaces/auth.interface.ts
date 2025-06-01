import {IUser} from "../../models/interfaces/auth.interface"

export interface IAuthRepository{
    createUser(userData:Partial<IUser>):Promise<IUser>
    findByEmail(email:string):Promise<IUser|null>
}