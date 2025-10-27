import Quiz from "../../models/implementations/quizModel";
import { IQuiz } from "../../models/interfaces/quiz.interface";
import { IQuizRepository } from "../interfaces/quiz.interface";

export class QuizRepository implements IQuizRepository {
  async createQuiz(quizData: Partial<IQuiz>): Promise<IQuiz> {
    const quiz = await Quiz.create(quizData);
    return quiz;
  }

  async findQuizByCouseId(courseId: string): Promise<IQuiz | null> {
    const quiz = await Quiz.findOne({ courseId });
    return quiz;
  }

  async findQuizById(quizId: string): Promise<IQuiz | null> {
    return await Quiz.findById(quizId);
  }

  async findByInstructorId(instructor: string): Promise<IQuiz[] | null> {
    return Quiz.find({ instructorId: instructor }).populate(
      "courseId",
      "title"
    );
  }

  async changeStatus(
    quizId: string,
    isDeleted: boolean
  ): Promise<IQuiz | null> {
    return await Quiz.findByIdAndUpdate(
      quizId,
      { isDeleted: isDeleted },
      { new: true }
    );
  }

  async updateQuizById(
    quizId: string,
    updateData: Partial<IQuiz>
  ): Promise<IQuiz | null> {
    return await Quiz.findByIdAndUpdate(
      quizId,
      { $set: updateData },
      { new: true }
    );
  }
}
