import { Schema, model } from "mongoose";
import { IQuiz, Option, Question } from "../interfaces/quiz.interface";

const optionSchema = new Schema<Option>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const questionSchema = new Schema<Question>(
  {
    questionText: { type: String },
    options: { type: [optionSchema], required: true },
    explanation: { type: String },
  },
  { _id: true }
);

const quizSchema = new Schema<IQuiz>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: "Instructor", required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [questionSchema], required: true },
    passPercentage: { type: Number, required: true, default: 50 },
    isDeleted:{ type:Boolean,default:false}
  },
  { timestamps: true }
);

export default model<IQuiz>("Quiz", quizSchema);