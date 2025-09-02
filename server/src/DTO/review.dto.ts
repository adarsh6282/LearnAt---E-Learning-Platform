import { Types } from "mongoose";

export interface ReviewDTO {
  _id?: Types.ObjectId|string;
  course: Types.ObjectId|string;
  user: Types.ObjectId|string;
  rating: number;
  text: string;
  isHidden: boolean;
  createdAt:Date;
}
