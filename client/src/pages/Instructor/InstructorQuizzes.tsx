import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEdit, MdDelete, MdRestoreFromTrash } from "react-icons/md";
import {
  deleteQuiz,
  getInstructorQuizzes,
  restoreQuiz,
} from "../../services/instructor.services";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";

interface Quiz {
  _id: string;
  title: string;
  courseTitle: string;
  totalQuestions: number;
  isDeleted:boolean;
  createdAt: string;
}

const InstructorQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const res = await getInstructorQuizzes();
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: string) => {
    try {
      await deleteQuiz(quizId);
      setQuizzes((prev) =>
      prev.map((q) =>
        q._id === quizId ? { ...q, isDeleted: true } : q
      )
    );
    } catch (err) {
      console.error(err);
    }
  };

  const handleRestore = async (quizId: string) => {
    try {
      await restoreQuiz(quizId);
      setQuizzes((prev) =>
      prev.map((q) =>
        q._id === quizId ? { ...q, isDeleted: false } : q
      )
    );
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (quizId: string) => {
    navigate(INSTRUCTOR_ROUTES.MANAGE_QUIZ(quizId));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-2xl font-bold mb-6">Your Quizzes</h1>

      {quizzes.length === 0 ? (
        <p>No quizzes found for your courses.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Questions
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Created At
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz._id}>
                  <td className="px-6 py-4">{quiz.title}</td>
                  <td className="px-6 py-4">{quiz.courseTitle}</td>
                  <td className="px-6 py-4">{quiz.totalQuestions}</td>
                  <td className="px-6 py-4">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex justify-center space-x-3">
                    <button
                      onClick={() => handleEdit(quiz._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <MdEdit size={20} />
                    </button>
                    {quiz.isDeleted? (
                      <button
                        onClick={() => handleRestore(quiz._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <MdRestoreFromTrash size={20}/>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default InstructorQuizzes;
