import { IUser } from "../../models/interfaces/auth.interface";
import { IAuthRepository } from "../interfaces/auth.interface";
import User from "../../models/implementations/userModel";
import { BaseRepository } from "../base.repository";

export class AuthRepository extends BaseRepository<IUser> implements IAuthRepository {
  constructor(){
    super(User)
  }
  async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = await this.model.create(userData);
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email });
    return user;
  }

  async findForProfile(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email }).select("-password");
    return user;
  }

  async updateUserByEmail(
    email: string,
    updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
    }>
  ): Promise<IUser | null> {
    const updatedUser = await this.model.findOneAndUpdate(
      { email },
      { $set: updateFields },
      { new: true }
    );
    return updatedUser;
  }
}
