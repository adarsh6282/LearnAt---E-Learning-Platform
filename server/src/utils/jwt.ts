import jwt from "jsonwebtoken";

export const generateToken = (id:string,email: string,role: "user" | "instructor" | "admin"): string => {
  return jwt.sign(
    { _id: id, email: email,role },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
}