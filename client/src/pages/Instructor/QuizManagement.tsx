import { useEffect, useState } from "react";
import {
  Plus,
  Trash2,
  Save,
  GripVertical,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getQuiz, updateQuiz } from "../../services/instructor.services";
import { errorToast, successToast } from "../../components/Toast";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id?: string;
  questionText: string;
  options: Option[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  passPercentage: number;
  questions: Question[];
}

const QuizManagement = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (!quizId) {
          return;
        }
        const res = await getQuiz(quizId);
        setQuiz(res.data);
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const validateQuiz = (quiz:Quiz):boolean => {
    if (!quiz.title.trim()) {
      errorToast("Quiz title is required");
      return false;
    }
    if (quiz.title.trim().length > 50) {
      errorToast("Quiz title cannot exceed 50 characters");
      return false;
    }

    if (!quiz.description.trim()) {
      errorToast("Quiz description is required");
      return false;
    }
    if (quiz.description.trim().length > 200) {
      errorToast("Quiz description cannot exceed 200 characters");
      return false;
    }

    if (quiz.passPercentage < 1 || quiz.passPercentage > 100) {
      errorToast("Pass percentage must be between 1 and 100");
      return false;
    }

    if (!quiz.questions.length) {
      errorToast("At least one question is required");
      return false;
    }

    for (let qIndex = 0; qIndex < quiz.questions.length; qIndex++) {
      const question = quiz.questions[qIndex];

      if (!question.questionText.trim()) {
        errorToast(`Question ${qIndex + 1} text is required`);
        return false;
      }

      if (question.questionText.trim().length > 150) {
        errorToast(`Question ${qIndex + 1} text exceeded 150 characters`);
        return false;
      }

      if (question.options.length !== 4) {
        errorToast(`Question ${qIndex + 1} must have exactly 4 options`);
        return false;
      }

      let hasCorrect = false;

      for (let optIndex = 0; optIndex < question.options.length; optIndex++) {
        const option = question.options[optIndex];

        if (!option.text.trim()) {
          errorToast(
            `Option ${optIndex + 1} in question ${qIndex + 1} is required`
          );
          return false;
        }

        if (option.text.trim().length > 100) {
          errorToast(
            `Option ${optIndex + 1} in question ${qIndex + 1} exceeded 100 characters`
          );
          return false;
        }

        if (option.isCorrect) hasCorrect = true;
      }

      if (!hasCorrect) {
        errorToast(
          `Question ${qIndex + 1} must have at least one correct answer`
        );
        return false;
      }
    }

    return true;
  };

  const addQuestion = () => {
    if (!quiz) return;
    const newQuestion: Question = {
      questionText: "",
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    };
    setQuiz({ ...quiz, questions: [...quiz.questions, newQuestion] });
  };

  const updateQuestionText = (index: number, value: string) => {
    if (!quiz) return;
    const updated = [...quiz.questions];
    updated[index] = { ...updated[index], questionText: value };
    setQuiz({ ...quiz, questions: updated });
  };

  const updateOption = (
    qIndex: number,
    optIndex: number,
    key: keyof Option,
    value: string | boolean
  ) => {
    if (!quiz) return;
    const updatedQuestions = [...quiz.questions];
    const updatedOptions = [...updatedQuestions[qIndex].options];

    updatedOptions[optIndex] = {
      ...updatedOptions[optIndex],
      [key]: value,
    };

    updatedQuestions[qIndex] = {
      ...updatedQuestions[qIndex],
      options: updatedOptions,
    };

    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const deleteQuestion = (index: number) => {
    if (!quiz) return;
    const updated = quiz.questions.filter((_, i) => i !== index);
    setQuiz({ ...quiz, questions: updated });
  };

  const saveChanges = async () => {
    try {
      if (!quiz) return

      if(!validateQuiz(quiz)) return
      
      if (
        !quiz?.questions &&
        !quiz?.title &&
        !quiz?.description &&
        !quiz?.passPercentage
      ) {
        errorToast("These fields are nesassary");
        return;
      }
      await updateQuiz(quizId!, {
        questions: quiz?.questions,
        title: quiz?.title,
        description: quiz?.description,
        passPercentage: quiz?.passPercentage,
      });
      successToast("Quiz Updated Successfully");
    } catch (err) {
      console.error("Failed to save quiz:", err);
      alert("❌ Failed to update quiz");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );

  if (!quiz)
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white border-2 border-red-200 rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-3xl">!</span>
          </div>
          <p className="text-red-500 text-lg font-semibold">
            No quiz found for this course
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border-2 border-blue-100 rounded-2xl p-8 mb-8 shadow-xl shadow-blue-100/50">
          <div className="flex flex-col gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Enter quiz title"
                className="w-full text-xl px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={quiz.description}
                onChange={(e) =>
                  setQuiz({ ...quiz, description: e.target.value })
                }
                placeholder="Enter quiz description"
                rows={3}
                className="w-full text-gray-800 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Pass Percentage (%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={quiz.passPercentage}
                onChange={(e) =>
                  setQuiz({ ...quiz, passPercentage: Number(e.target.value) })
                }
                className="w-32 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-blue-100">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">
                Questions:
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                {quiz.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm font-medium">
                Pass Rate:
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                {quiz.passPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          {quiz.questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="group bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all duration-300"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                    <GripVertical size={20} />
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white font-bold">{qIndex + 1}</span>
                  </div>
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    placeholder={`Enter question ${qIndex + 1}...`}
                    className="flex-1 bg-gray-50 text-gray-800 text-lg px-4 py-3 rounded-xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 transition-all"
                  />
                </div>
                <button
                  onClick={() => deleteQuestion(qIndex)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-16">
                {q.options.map((opt, optIndex) => (
                  <div
                    key={optIndex}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      opt.isCorrect
                        ? "bg-green-50 border-green-300"
                        : "bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <button
                      onClick={() =>
                        updateOption(
                          qIndex,
                          optIndex,
                          "isCorrect",
                          !opt.isCorrect
                        )
                      }
                      className="flex-shrink-0 transition-transform hover:scale-110"
                    >
                      {opt.isCorrect ? (
                        <CheckCircle2 size={22} className="text-green-600" />
                      ) : (
                        <Circle size={22} className="text-gray-400" />
                      )}
                    </button>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) =>
                        updateOption(qIndex, optIndex, "text", e.target.value)
                      }
                      placeholder={`Option ${optIndex + 1}`}
                      className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-6 flex items-center justify-between gap-4 bg-white border-2 border-gray-200 rounded-2xl p-4 shadow-2xl">
          <button
            onClick={addQuestion}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all transform hover:scale-105"
          >
            <Plus size={20} /> Add Question
          </button>

          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-sm font-medium">
              {quiz.questions.length} question
              {quiz.questions.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={saveChanges}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-green-200 hover:shadow-green-300 transition-all transform hover:scale-105"
            >
              <Save size={20} /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizManagement;
