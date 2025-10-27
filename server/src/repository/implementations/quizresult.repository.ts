import { IQuizResult } from "../../models/interfaces/quiz.interface";
import { IQuizResultRepository } from "../interfaces/quizresult.interface";
import QuizResult from "../../models/implementations/quizResultModel";

export class QuizResultRepository implements IQuizResultRepository {
  async create(
    data:{quizId: string,
    userId: string,
    courseId:string,
    answers: { [questionId: string]: string },
    score: number,
    percentage: number,
    passed: boolean,
    isCertificateIssued:boolean
}
  ): Promise<IQuizResult> {
    const { quizId, userId, answers, score, percentage, passed,courseId, isCertificateIssued } = data;
    const quizResult = await QuizResult.create({
      quizId,
      userId,
      courseId,
      answers,
      score,
      percentage,
      passed,
      isCertificateIssued,
      createdAt: new Date(),
    });

    const answersObj: { [key: string]: string } = {};
    quizResult.answers.forEach((value: string, key: string) => {
      answersObj[key] = value;
    });
    
    return {
      _id: quizResult._id.toString(),
      quizId: quizResult.quizId.toString(),
      userId: quizResult.userId.toString(),
      courseId:quizResult.courseId.toString(),
      answers: answersObj,
      score: quizResult.score,
      percentage: quizResult.percentage,
      passed: quizResult.passed,
      isCertificateIssued: quizResult.isCertificateIssued,
      createdAt: quizResult.createdAt,
    };
  }
}
