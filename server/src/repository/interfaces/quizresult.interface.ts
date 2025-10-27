import { IQuizResult } from "../../models/interfaces/quiz.interface";

export  interface IQuizResultRepository{
    create(
    data:{quizId: string,
    userId: string,
    courseId:string,
    answers: { [questionId: string]: string },
    score: number,
    percentage: number,
    passed: boolean,
    isCertificateIssued:boolean
}
  ): Promise<IQuizResult>;
}