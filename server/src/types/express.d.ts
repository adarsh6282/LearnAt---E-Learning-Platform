import { Request } from "express";

export interface UserRequest extends Request {
  user?: {
    id?: string;
    email?: string;
  };
}

declare module "express-serve-static-core" {
  interface Request {
    instructor?: {
      id: string;
      email: string;
    };
  }
}