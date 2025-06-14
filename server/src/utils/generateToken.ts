import jwt from "jsonwebtoken";

export const generateToken = (id:string,email: string): string => {
  return jwt.sign(
    { _id: id, email: email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
}