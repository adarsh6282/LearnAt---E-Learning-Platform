import { useCallback, useEffect, useRef, useState } from "react";
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
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuth();
  const [result, setResult] = useState<{
    score: number;
    percentage: number;
    passed: boolean;
    isCertificateIssued: boolean;
    celebrate: boolean;
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

  const generateCertificate = useCallback(async () => {
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
  }, [authUser?._id, courseId, quiz]); 

  useEffect(() => {
    if (result?.passed) {
      const timer = setTimeout(() => {
        generateCertificate();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result, generateCertificate]);

  const handleSelect = (questionId: string, optionText: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionText }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    try {
      const res = await submitQuizS(quiz._id, courseId!, answers);
      const { score, percentage, passed, isCertificateIssued, celebrate } = res.data;

      setResult({ score, percentage, passed, isCertificateIssued, celebrate });
      setSubmitted(true);
      setShowModal(true);
    } catch (err) {
      console.error("Failed to submit quiz:", err);
    }
  };

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = quiz?.questions.length || 0;
  const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;

  if (!quiz) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400 text-xl font-semibold">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden py-12 px-4">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "0.3cm 0.3cm",
        }}
      />

      <div className="max-w-4xl mx-auto relative z-10 pt-24">
        <div className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-3xl p-8 mb-8 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-500/10 ring-1 ring-green-500/20 rounded-xl text-green-400">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-extrabold text-white mb-3">
                {quiz.title}
              </h1>
              <p className="text-neutral-400 text-lg leading-relaxed">{quiz.description}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-neutral-400">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm">{totalQuestions} Questions</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-400">
                  <Award className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Pass: {quiz.passPercentage}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {!submitted && (
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold">Progress</span>
              <span className="text-green-400 font-bold">
                {answeredQuestions} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all duration-500 ease-out rounded-full"
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
                className="bg-white/[0.02] backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl hover:border-green-500/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-white/5 text-green-400 ring-1 ring-white/10 font-bold rounded-xl w-10 h-10 flex items-center justify-center flex-shrink-0">
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
                        className={`text-left px-5 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.01] border ${
                          isSelected
                            ? "bg-green-500 text-black border-transparent shadow-lg shadow-green-500/20"
                            : "bg-white/5 text-neutral-300 hover:bg-white/10 border-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                              isSelected
                                ? "border-black bg-black"
                                : "border-neutral-500"
                            }`}
                          >
                            {isSelected && (
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
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
              className={`group/btn relative w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg overflow-hidden transition-all duration-300 ring-1 ${
                answeredQuestions < totalQuestions
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed ring-white/0"
                  : "bg-green-500 text-black hover:ring-green-500/30 hover:-translate-y-0.5 shadow-lg shadow-green-500/20 ring-white/10"
              }`}
            >
              {answeredQuestions === totalQuestions && (
                <span className="absolute inset-0 bg-black transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
              )}
              <span className="relative z-10 flex items-center gap-2 transition-colors duration-500">
                {answeredQuestions < totalQuestions
                  ? `Answer ${totalQuestions - answeredQuestions} more question${
                      totalQuestions - answeredQuestions > 1 ? "s" : ""
                    }`
                  : "Submit Quiz"}
              </span>
            </button>
          </div>
        ) : null}

        {showModal && result && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl transform animate-in zoom-in duration-300 relative overflow-hidden">
              <div className="absolute -top-20 -left-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-green-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  {result.passed ? (
                    <div className="w-20 h-20 bg-green-500/10 ring-1 ring-green-500/20 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-green-400" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-red-500/10 ring-1 ring-red-500/20 rounded-full flex items-center justify-center mx-auto">
                      <XCircle className="w-12 h-12 text-red-400" />
                    </div>
                  )}
                </div>

                <h3 className="text-3xl font-bold mb-4 text-white">
                  {result.passed ? "Congratulations!" : "Good Attempt"}
                </h3>

                <div className="bg-black/40 rounded-xl p-6 mb-6 border border-white/5">
                  <div className="text-5xl font-extrabold text-green-400 mb-2">
                    {result.percentage}%
                  </div>
                  <p className="text-neutral-400">
                    Score: {result.score} / {quiz.questions.length}
                  </p>
                </div>

                {result.passed ? (
                  <div className="bg-green-500/[0.07] border border-green-500/20 rounded-xl p-4 mb-6">
                    <p className="text-neutral-300 leading-relaxed">
                      You passed the quiz! Check the <strong className="text-green-400">Certificates</strong> section in your profile to download your certificate.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-500/[0.07] border border-red-500/20 rounded-xl p-4 mb-6">
                    <p className="text-neutral-300 leading-relaxed">
                      You need {quiz.passPercentage}% to pass. You can try again after 24 hours.
                    </p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowModal(false);
                    navigate(`/users/course-view/${courseId}`, { 
                      state: { justCelebrated: result.celebrate } ,
                      replace: true
                    });
                  }}
                  className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-base font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 bg-green-500 text-black hover:ring-green-500/30 hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
                >
                  <span className="absolute inset-0 bg-black transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
                  <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-green-500">
                    Continue to Course
                  </span>
                </button>
              </div>
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