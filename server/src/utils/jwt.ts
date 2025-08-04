import jwt from "jsonwebtoken";

export const generateToken = (id:string,email: string,role: "user" | "instructor" | "admin"): string => {
  const payload={_id:id,email:email,role:role}
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: "15m" }
  );
}

export const generateRefreshToken=(id:string,email: string,role: "user" | "instructor" | "admin"):string=>{
  const payload={_id:id,email:email,role:role}
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );
}