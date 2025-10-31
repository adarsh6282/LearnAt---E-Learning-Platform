"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toQuizDToList = exports.toQuizDTO = void 0;
const toQuizDTO = (quiz) => {
    return {
        _id: quiz._id?.toString(),
        courseId: quiz.courseId.toString(),
        instructorId: quiz.instructorId.toString(),
        title: quiz.title,
        description: quiz.description,
        questions: quiz.questions,
        passPercentage: quiz.passPercentage,
        isDeleted: quiz.isDeleted
    };
};
exports.toQuizDTO = toQuizDTO;
const toQuizDToList = (quizzes) => {
    return quizzes.map(exports.toQuizDTO);
};
exports.toQuizDToList = toQuizDToList;
