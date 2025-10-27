export interface UserDTO {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  profilePicture?: string;
  googleId?:string
  role: "admin" | "user" | "instructor";
  isBlocked: boolean;
}
