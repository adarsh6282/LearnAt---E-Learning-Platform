import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}


declare module "express-serve-static-core" {
  interface Request {
    instructor?: {
      id: string;
      email: string;
    };
  }
}