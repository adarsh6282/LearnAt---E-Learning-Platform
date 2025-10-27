import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getQuizS,
  makeCertificate,
  submitQuizS,
} from "../../services/user.services";
import html2canvas from "html2canvas";
import { useAuth } from "../../hooks/useAuth";
import image from "../../assets/certificate.png";
import { CheckCircle, XCircle, Award, Clock, BookOpen } from "lucide-react";

interface Option {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  questionText: string;
  type: string;
  options: Option[];
}

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  passPercentage: number;
}

const UserQuizPage = () => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const navigate=useNavigate()
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuth();
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    isCertificateIssued: boolean;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  const { courseId } = useParams<{ courseId: string }>();

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!courseId) return;
      try {
        const res = await getQuizS(courseId);
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      }
    };
    fetchQuiz();
  }, [courseId]);

  useEffect(() => {
    if (result?.passed) {
      const timer = setTimeout(() => {
        generateCertificate();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [result]);

  const handleSelect = (questionId: string, optionText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const res = await submitQuizS(quiz._id, courseId!, answers);
      const { score, percentage, passed, isCertificateIssued } = res.data;

      setResult({ score, percentage, passed, isCertificateIssued });
      setSubmitted(true);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const generateCertificate = async () => {
    if (!certificateRef.current || !quiz || !authUser?._id) return;

    const canvas = await html2canvas(certificateRef.current);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append("userId", authUser._id!);
      formData.append("courseId", courseId!);
      formData.append("certificate", blob, "certificate.png");

      try {
        await makeCertificate(formData);
      } catch (err) {
        console.error("Failed to upload certificate:", err);
      }
    });
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quiz?.questions.length || 0;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-fuchsia-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-3 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                {quiz.title}
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed">{quiz.description}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{totalQuestions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Award className="w-4 h-4" />
                  <span className="text-sm">Pass: {quiz.passPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!submitted && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-cyan-400 font-bold">
                {answeredQuestions} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {!submitted ? (
          <div className="space-y-6 mb-8">
            {quiz.questions.map((q, idx) => (
              <div
                key={q._id}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:border-cyan-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0 shadow-lg">
                    {idx + 1}
                  </div>
                  <p className="text-white text-lg font-semibold leading-relaxed flex-1">
                    {q.questionText}
                  </p>
                </div>
                <div className="flex flex-col space-y-3 pl-14">
                  {q.options.map((opt) => {
                    const isSelected = answers[q._id] === opt.text;
                    return (
                      <button
                        key={opt.text}
                        onClick={() => handleSelect(q._id, opt.text)}
                        className={`text-left px-5 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                          isSelected
                            ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/50"
                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-white bg-white"
                                : "border-slate-500"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600"></div>
                            )}
                          </div>
                          <span>{opt.text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              disabled={answeredQuestions < totalQuestions}
              className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                answeredQuestions < totalQuestions
                  ? "bg-slate-700 cursor-not-allowed opacity-50"
                  : "bg-gradient-to-r from-cyan-500 via-purple-500 to-fuchsia-500 hover:shadow-cyan-500/50"
              }`}
            >
              {answeredQuestions < totalQuestions
                ? `Answer ${totalQuestions - answeredQuestions} more question${
                    totalQuestions - answeredQuestions > 1 ? "s" : ""
                  }`
                : "Submit Quiz"}
            </button>
          </div>
        ) : null}

        {showModal && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl transform animate-in zoom-in duration-300">
              <div className="mb-6">
                {result.passed ? (
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/50">
                    <CheckCircle className="w-12 h-12 text-white" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-rose-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-red-500/50">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <h3 className="text-3xl font-bold mb-4 text-white">
                {result.passed ? "Congratulations!" : "Good Attempt"}
              </h3>

              <div className="bg-slate-800/50 rounded-xl p-6 mb-6">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent mb-2">
                  {result.percentage}%
                </div>
                <p className="text-slate-400">
                  Score: {result.score} / {quiz.questions.length}
                </p>
              </div>

              {result.passed ? (
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
                  <p className="text-slate-300 leading-relaxed">
                    You passed the quiz! Check the <strong className="text-cyan-400">Certificates</strong> section in your profile to download your certificate.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                  <p className="text-slate-300 leading-relaxed">
                    You need {quiz.passPercentage}% to pass. You can try again after 24 hours.
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setShowModal(false)
                  navigate(`/users/courses/${courseId}`)
                }}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {result?.passed && (
          <div
            ref={certificateRef}
            className="w-[800px] h-[600px] p-8 bg-white text-black relative"
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "absolute",
              left: "-9999px",
            }}
          >
            <p className="text-center text-xl mb-4 absolute top-72 left-0 right-0">
              <strong>{authUser?.name}</strong>
            </p>
            <p className="text-center mb-4 absolute top-80 left-0 right-0 text-xs">
              has successfully completed the course named <strong>{quiz.title}</strong>
            </p>
            <p className="text-center absolute top-90 left-0 right-0">
              Date: {new Date().toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserQuizPage;