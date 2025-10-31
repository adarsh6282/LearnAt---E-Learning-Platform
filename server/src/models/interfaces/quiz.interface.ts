import { Schema, Types } from "mongoose";

export interface PopulatedCourse {
  _id: string;
  title: string;
}

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  _id?:string,
  questionText: string;
  options: Option[];
  explanation?: string;
}

export interface IQuiz extends Document {
  _id?:string
  courseId: Schema.Types.ObjectId | string | PopulatedCourse
  instructorId: Schema.Types.ObjectId | string;
  title: string;
  description?: string;
  questions: Question[];
  passPercentage: number;
  isDeleted:boolean
  createdAt: Date;
  updatedAt: Date;
}

export interface IQuizResult {
  _id?: string; 
  quizId: string; 
  userId: string; 
  courseId:string;
  answers: { [questionId: string]: string };
  score: number;
  percentage: number; 
  passed: boolean;
  isCertificateIssued?: boolean;
  createdAt?: Date;
}

export interface InstructorQuizResponse {
  _id: string|Types.ObjectId;
  title: string;
  totalQuestions:number
  courseTitle: string;
  createdAt: Date;
}