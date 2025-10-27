import React, { useState } from "react";
import { Plus, Trash2, Save, CheckCircle2, Circle } from "lucide-react";
import { useParams } from "react-router-dom";
import { errorToast, successToast } from "../../components/Toast";
import { createQuiz } from "../../services/instructor.services";
import type { AxiosError } from "axios";

export interface Option {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  questionText: string;
  options: Option[];
  correctAnswers: string[];
}

interface Quiz {
  title: string;
  description: string;
  passPercentage: number;
  questions: Question[];
}

const QuizCreation: React.FC = () => {
  const [quiz, setQuiz] = useState<Quiz>({
    title: "",
    description: "",
    passPercentage: 50,
    questions: [],
  });
  const { courseId } = useParams<{ courseId: string }>();

  const validateQuiz = (): boolean => {
    if (!quiz.title.trim()) {
      errorToast("Quiz title is required");
      return false;
    }

    if (!quiz.description.trim()) {
      errorToast("Quiz description is required");
      return false;
    }

    if (quiz.passPercentage < 1 || quiz.passPercentage > 100) {
      errorToast("Pass percentage must be between 1 and 100");
      return false;
    }

    if (quiz.questions.length === 0) {
      errorToast("At least one question is required");
      return false;
    }

    for (let i = 0; i < quiz.questions.length; i++) {
      const q = quiz.questions[i];

      if (!q.questionText.trim()) {
        errorToast(`Question ${i + 1} cannot be empty`);
        return false;
      }

      if (q.options.length < 2) {
        errorToast(`Question ${i + 1} must have at least two options`);
        return false;
      }

      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          errorToast(`Option ${j + 1} in Question ${i + 1} cannot be empty`);
          return false;
        }
      }

      const correctCount = q.options.filter((opt) => opt.isCorrect).length;
      if (correctCount !== 1) {
        errorToast(`Question ${i + 1} must have exactly one correct answer`);
        return false;
      }
    }

    return true;
  };

  const addQuestion = (): void => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          questionText: "",
          options: [],
          correctAnswers: [],
        },
      ],
    });
  };

  const removeQuestion = (qIndex: number): void => {
    setQuiz({
      ...quiz,
      questions: quiz.questions.filter((_, i) => i !== qIndex),
    });
  };

  const handleQuestionChange = (qIndex: number, value: string): void => {
    const updated = [...quiz.questions];
    updated[qIndex].questionText = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const addOption = (qIndex: number): void => {
    const updated = [...quiz.questions];
    const optionsCount = updated[qIndex].options.length;

    if (optionsCount > 4) {
      errorToast("You can only add up to 4 options per question");
      return;
    }
    updated[qIndex].options.push({ text: "", isCorrect: false });
    setQuiz({ ...quiz, questions: updated });
  };

  const removeOption = (qIndex: number, oIndex: number): void => {
    const updated = [...quiz.questions];
    updated[qIndex].options.splice(oIndex, 1);
    setQuiz({ ...quiz, questions: updated });
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ): void => {
    const updated = [...quiz.questions];
    updated[qIndex].options[oIndex].text = value;
    setQuiz({ ...quiz, questions: updated });
  };

  const toggleCorrectAnswer = (qIndex: number, oIndex: number): void => {
    const updated = [...quiz.questions];
    updated[qIndex].options = updated[qIndex].options.map((opt, idx) => ({
      ...opt,
      isCorrect: idx === oIndex ? !opt.isCorrect : false,
    }));

    setQuiz({ ...quiz, questions: updated });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!courseId) {
      errorToast("Course ID is missing");
      return;
    }

    if (!validateQuiz()) return;

    try {
      await createQuiz(courseId, quiz);
      successToast("Quiz created successfully!");
      //   navigate(`/instructor/courses/${courseId}/manage-quizzes`);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            Create Quiz
          </h1>
          <p className="text-gray-600">
            Design an engaging quiz for your students
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl shadow-blue-100/50 mb-8 border border-blue-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Quiz Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                placeholder="Enter quiz title..."
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none min-h-24 resize-none"
                placeholder="Describe what this quiz covers..."
                value={quiz.description}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pass Percentage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  value={quiz.passPercentage}
                  onChange={(e) =>
                    setQuiz({ ...quiz, passPercentage: Number(e.target.value) })
                  }
                />
                <div className="bg-blue-100 text-blue-700 font-semibold px-4 py-2 rounded-xl min-w-[80px] text-center">
                  {quiz.passPercentage}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-lg shadow-green-100/50 border border-green-100 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-semibold flex-shrink-0">
                  {qIndex + 1}
                </div>
                <input
                  className="flex-1 border-2 border-gray-200 rounded-xl p-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none font-medium"
                  placeholder="Enter your question..."
                  value={q.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                />
                <button
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-3 ml-12">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center gap-3 group">
                    <button
                      onClick={() => toggleCorrectAnswer(qIndex, oIndex)}
                      className="flex-shrink-0"
                    >
                      {opt.isCorrect ? (
                        <CheckCircle2 size={20} className="text-green-500" />
                      ) : (
                        <Circle
                          size={20}
                          className="text-gray-300 group-hover:text-gray-400 transition-colors"
                        />
                      )}
                    </button>

                    <input
                      className="flex-1 border-2 border-gray-200 rounded-xl p-2.5 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                      placeholder={`Option ${oIndex + 1}`}
                      value={opt.text}
                      onChange={(e) =>
                        handleOptionChange(qIndex, oIndex, e.target.value)
                      }
                    />

                    <button
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => addOption(qIndex)}
                className="ml-12 mt-3 text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
              >
                <Plus size={18} /> Add Option
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap">
          <button
            onClick={addQuestion}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 flex items-center gap-2 font-medium transition-all hover:shadow-xl hover:scale-105"
          >
            <Plus size={20} /> Add Question
          </button>

          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg shadow-green-200 flex items-center gap-2 font-medium transition-all hover:shadow-xl hover:scale-105"
          >
            <Save size={20} /> Save Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreation;
