import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Users, Clock, BookOpen, User, X } from "lucide-react";
import { loadRazorpayScript } from "../../utils/loadRazorpay";
import { errorToast, successToast } from "../../components/Toast";
import type { CourseViewType } from "../../types/user.types";
import {
  CreateOrderS,
  getReviewsS,
  getSpecificCourseS,
  postReviewS,
  verifyResS,
} from "../../services/user.services";
import type { Review } from "../../types/review.types";
import { USER_ROUTES } from "../../constants/routes.constants";
import userApi from "../../services/userApiService";
import type { IInstructorProfile } from "../../types/instructor.types";
import Navbar from "../../components/Navbar";

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const instructorId = course?.instructor?._id;
  const [instructor, setInstructor] = useState<IInstructorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState({ rating: 0, text: "" });
  const [isCompleted, setIsCompleted] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");

  useEffect(() => {
    const fetchIsCourseCompleted = async () => {
      const res = await userApi.get<boolean>(
        `/users/courses/progress/${courseId}`
      );
      setIsCompleted(res.data);
    };
    fetchIsCourseCompleted();
  }, [courseId]);

  const handlePayment = async () => {
    if (!course?._id) return;
    const courseId = course._id;
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const { data: order } = await CreateOrderS(courseId);
      console.log(order)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_ID,
        amount: order.amount,
        currency: order.currency,
        name: course.title,
        description: course.description,
        order_id: order.razorpayOrderId,
        handler: async (response: any) => {
          const verifyRes = await verifyResS({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            successToast("Payment Successful! You are enrolled.");
            setIsEnrolled(true);
          } else {
            errorToast("Payment verification failed.");
          }
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.open();
    } catch (err) {
      console.error("Error in payment", err);
      errorToast("Course is purchased or payment in progress");
    }
  };

  const fetchReviews = async () => {
    try {
      if (!courseId) return;
      const res = await getReviewsS(courseId);
      const normalizedReviews: Review[] = res.data.reviews || [];
      setReviews(normalizedReviews);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitReview = async () => {
    if (!userReview.rating || !userReview.text)
      return errorToast("Please fill in the fields");

    if (!courseId) return;

    try {
      await postReviewS(courseId, userReview);
      successToast("Review Submitted");
      setUserReview({ rating: 0, text: "" });
      fetchReviews();
    } catch (err) {
      errorToast("Already reviewed the course");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        console.warn("No courseId provided.");
        return;
      }
      try {
        setLoading(true);
        const res = await getSpecificCourseS(courseId);
        setCourse(res.data.course);
        setIsEnrolled(res.data.isEnrolled);
        fetchReviews();
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const fetchInstructor = async () => {
    try {
      const res = await userApi.get<IInstructorProfile>(
        `/users/courseinstructor/${instructorId}`
      );
      setInstructor(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="animate-pulse">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <div className="h-8 bg-slate-800 rounded w-48 mb-4"></div>
            <div className="h-6 bg-slate-800 rounded w-96"></div>
          </div>
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-slate-800 rounded-lg"></div>
                <div className="h-32 bg-slate-800 rounded"></div>
              </div>
              <div className="h-96 bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-cyan-400" />
          <h3 className="mt-2 text-lg font-bold text-slate-200">
            Course not found
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Link
            to={USER_ROUTES.COURSES}
            className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const totalLessons = course.lectures?.length || 0;
  const totalDuration =
    course.lectures?.reduce((total, lecture) => {
      const minutes = parseInt(lecture.duration) || 0;
      return total + minutes;
    }, 0) || 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow p-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {course.category && (
                  <span className="px-3 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                    {course.category}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent mb-4">
                {course.title}
              </h1>
              <p className="text-slate-200 mb-6">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                {course.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-slate-100">
                      {course.rating}
                    </span>
                    <span className="ml-1">rating</span>
                  </div>
                )}
                {course.studentsCount && (
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{course.studentsCount} students</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m total
                  </span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow overflow-hidden mb-6">
              {course.lectures && course.lectures.length > 0 ? (
                <video
                  controls
                  className="w-full h-56 sm:h-72 object-cover"
                  src={course.lectures[0].videoUrl}
                />
              ) : (
                <p className="p-4 text-center text-slate-400">
                  No lecture video available
                </p>
              )}
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow">
              <div className="border-b border-cyan-400/10">
                <nav className="flex space-x-8 px-6 text-slate-100">
                  {["overview", "curriculum", "instructor", "reviews"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`py-4 text-sm font-semibold border-b-2 transition-colors ${
                          activeTab === tab
                            ? "border-cyan-500 text-cyan-400"
                            : "border-transparent"
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    )
                  )}
                </nav>
              </div>
              <div className="p-6">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {course.description && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 text-cyan-300">
                          About this course
                        </h3>
                        <p className="text-slate-200 leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div>
                    <h3 className="text-lg text-cyan-300 font-semibold mb-6">
                      Course Curriculum
                    </h3>
                    {course.lectures && course.lectures.length > 0 ? (
                      <div className="space-y-4">
                        {course.lectures.map((chapter, chapterIndex) => (
                          <div
                            key={`${chapter.title}-${chapterIndex}`}
                            className="border rounded-lg border-cyan-400/10 bg-slate-900/60"
                          >
                            <div className="px-4 py-3">
                              <h4 className="font-medium text-slate-100">
                                Chapter {chapterIndex + 1}: {chapter.title}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400">
                        Curriculum information not available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div>
                    <h3 className="text-lg text-cyan-300 font-semibold mb-6">
                      About the Instructor
                    </h3>
                    {course.instructor ? (
                      <div className="flex items-start space-x-4">
                        <button
                          onClick={() => {
                            if (course.instructor?._id) {
                              fetchInstructor();
                              setIsInstructorModalOpen(true);
                            } else {
                              console.warn("Instructor ID not available");
                            }
                          }}
                          className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center hover:scale-105 transition"
                        >
                          <User className="h-8 w-8 text-cyan-400" />
                        </button>
                        <div>
                          <h4 className="font-medium text-slate-100">
                            {course.instructor?.name}
                          </h4>
                          <p className="text-slate-200 mt-2">
                            Experienced instructor with expertise in{" "}
                            {course.category || "this field"}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-slate-400">
                        Instructor information not available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-lg text-cyan-300 font-semibold mb-6">
                      Ratings & Reviews
                    </h3>
                    {isCompleted && (
                      <div className="mb-8 p-4 bg-slate-900/60 rounded-lg">
                        <h4 className="text-slate-100 font-medium mb-4">
                          Write a Review
                        </h4>
                        <div className="mb-4">
                          <label className="block mb-2 text-slate-100 font-medium">
                            Your Rating:
                          </label>
                          <div className="flex space-x-1 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={`rating-${star}`}
                                onClick={() =>
                                  setUserReview({ ...userReview, rating: star })
                                }
                                className={`h-6 w-6 cursor-pointer ${
                                  userReview.rating >= star
                                    ? "text-yellow-400 fill-current"
                                    : "text-slate-400 hover:text-yellow-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mb-4">
                          <textarea
                            placeholder="Write your review..."
                            value={userReview.text}
                            onChange={(e) =>
                              setUserReview({
                                ...userReview,
                                text: e.target.value,
                              })
                            }
                            className="w-full p-3 border border-cyan-400/10 bg-slate-900 text-slate-100 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                            rows={4}
                          />
                        </div>
                        <button
                          onClick={handleSubmitReview}
                          className="bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-2 px-6 rounded-full font-semibold hover:scale-105 transition-all duration-300"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews
                          .filter((review) => review.isHidden == false)
                          .map((review) => (
                            <div
                              key={review._id}
                              className="border-t border-cyan-400/10 pt-4"
                            >
                              <div className="flex items-center mb-2">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        review.rating >= star
                                          ? "text-yellow-400 fill-current"
                                          : "text-slate-400"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-slate-300">
                                  By {review.user?.name || "Anonymous"}
                                </span>
                              </div>
                              <p className="text-slate-100 leading-relaxed">
                                {review.text}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <Star className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                          <p className="text-slate-400">No reviews yet.</p>
                          <p className="text-slate-400 text-sm mt-2">
                            Be the first to review this course!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow p-6 sticky top-6">
              <div className="text-center text-slate-100 mb-6">
                <div className="text-3xl font-bold text-fuchsia-400 mb-2">
                  ₹{course.price}
                </div>
              </div>
              {isEnrolled ? (
                <button
                  className="w-full bg-gradient-to-r from-green-400 to-cyan-500 text-white py-3 px-4 rounded-full font-semibold cursor-pointer mb-4 hover:scale-105 transition-all duration-300"
                  onClick={() => navigate(`/users/course-view/${courseId}`)}
                >
                  Continue to Course
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  className="w-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white py-3 px-4 rounded-full font-semibold hover:scale-105 transition-all duration-300 mb-4"
                >
                  Enroll Now
                </button>
              )}
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-200">Total Duration:</span>
                  <span className="font-medium text-slate-100">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-200">Lessons:</span>
                  <span className="font-medium text-slate-100">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-200">Access:</span>
                  <span className="font-medium text-slate-100">Lifetime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isInstructorModalOpen && course.instructor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-lg w-11/12 max-w-md p-6 relative">
              <button
                onClick={() => setIsInstructorModalOpen(false)}
                className="absolute top-3 right-3 text-slate-400 hover:text-fuchsia-500"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex flex-col items-center text-center">
                {instructor?.profilePicture ? (
                  <img
                    src={instructor.profilePicture}
                    alt="Instructor Profile"
                    className="w-24 h-24 rounded-full object-cover mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-300 flex items-center justify-center text-slate-500 mb-4">
                    <User className="w-10 h-10" />
                  </div>
                )}
                <h2 className="text-2xl font-bold text-slate-100">
                  {instructor?.name}
                </h2>
                <p className="text-slate-300 text-sm mb-1">
                  @{instructor?.username}
                </p>
                <p className="text-slate-100 font-medium mb-2">
                  {instructor?.title}
                </p>
                <div className="text-sm text-slate-200 space-y-1">
                  <p>
                    🎓 <span className="font-semibold">Education:</span>{" "}
                    {instructor?.education}
                  </p>
                  <p>
                    🧑‍💼 <span className="font-semibold">Experience:</span>{" "}
                    {instructor?.yearsOfExperience} years
                  </p>
                  <p>
                    📞 <span className="font-semibold">Phone:</span>{" "}
                    {instructor?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
