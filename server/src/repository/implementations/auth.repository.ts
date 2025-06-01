import { IUser } from "../../models/interfaces/auth.interface"
import {IAuthRepository} from "../interfaces/auth.interface"
import User from "../../models/implementations/userModel"


export class AuthRepository implements IAuthRepository{
    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user=await User.create(userData)
        return user
    }

    async findByEmail(email: string): Promise<IUser|null> {
        const user=await User.findOne({email})
        return user
    }
}