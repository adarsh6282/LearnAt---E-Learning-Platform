import { QuizDTO } from "../DTO/quiz.dto";
import { IQuiz } from "../models/interfaces/quiz.interface";

export const toQuizDTO = (quiz: IQuiz): QuizDTO => {
  return {
    _id:quiz._id?.toString(),
    courseId:quiz.courseId.toString(),
    instructorId:quiz.instructorId.toString(),
    title:quiz.title,
    description:quiz.description,
    questions:quiz.questions,
    passPercentage:quiz.passPercentage,
    isDeleted:quiz.isDeleted
  };
};


export const toQuizDToList=(quizzes:IQuiz[]):QuizDTO[]=>{
    return quizzes.map(toQuizDTO)
}