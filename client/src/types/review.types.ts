export interface Review {
  _id: string;
  course: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  isHidden:boolean
  text: string;
  createdAt: string;
}