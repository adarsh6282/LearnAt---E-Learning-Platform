import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  course: Types.ObjectId;
  user: Types.ObjectId;
  rating: number;
  text: string;
  createdAt?: Date;
  updatedAt?: Date;
}