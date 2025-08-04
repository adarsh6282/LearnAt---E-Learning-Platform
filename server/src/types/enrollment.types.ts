export interface IEnrollment {
  _id: string;
  course: {
    _id:string;
    title: string;
  };
  user: {
    _id:string;
    name: string;
    email: string;
  };
  isCompleted:boolean;
  createdAt: string;
}
