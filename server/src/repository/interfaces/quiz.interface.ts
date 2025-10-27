import { IQuiz } from "../../models/interfaces/quiz.interface";

export interface IQuizRepository{
    createQuiz(quizData:Partial<IQuiz>):Promise<IQuiz|null>
    findQuizByCouseId(courseId:string):Promise<IQuiz|null>
    findByInstructorId(instructor:string):Promise<IQuiz[]|null>
    changeStatus(quizId:string,isDeleted:boolean):Promise<IQuiz|null>
    updateQuizById(quizId:string,updateData:Partial<IQuiz>):Promise<IQuiz|null>
    findQuizById(quizId:string):Promise<IQuiz|null>
}