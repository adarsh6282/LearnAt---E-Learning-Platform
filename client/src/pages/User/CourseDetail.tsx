import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, Clock, BookOpen, User } from "lucide-react";
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

const CourseDetail: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseViewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userReview, setUserReview] = useState({ rating: 0, text: "" });
  const [isCompleted,setIsCompleted]=useState<boolean>()
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "curriculum" | "instructor" | "reviews"
  >("overview");

  console.log(isCompleted)

  useEffect(()=>{
    const fetchIsCourseCompleted=async()=>{
      const res=await userApi.get<boolean>(`/users/courses/progress/${courseId}`)
      setIsCompleted(res.data)
    }
    fetchIsCourseCompleted()
  },[courseId])

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
      errorToast("Course is purchased or payment in progress")
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
      const res=await postReviewS(courseId, userReview);
      successToast("Review Submitted");
      setUserReview({ rating: 0, text: "" });
      fetchReviews();
    } catch (err) {
      errorToast("Already reviewed the course")
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
        console.log("Finished loading");
      }
    };

    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-96"></div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            Course not found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error || "The course you're looking for doesn't exist."}
          </p>
          <Link
            to={USER_ROUTES.COURSES}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={USER_ROUTES.COURSES}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Link to={USER_ROUTES.COURSES} className="hover:text-white">
              Courses
            </Link>
            <span>/</span>
            <span className="text-white">{course.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-900">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {course.category && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {course.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-white mb-4">
                {course.title}
              </h1>

              <p className="text-white mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                {course.rating && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium text-gray-900">
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

                <div className="flex items-center text-white">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                    total
                  </span>
                </div>

                <div className="flex items-center text-white">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </div>

            {/* Course Image */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
              {course.lectures && course.lectures.length > 0 ? (
                <video
                  controls
                  className="w-full h-64 sm:h-80 object-cover"
                  src={course.lectures[0].videoUrl}
                />
              ) : (
                <p className="p-4 text-center text-gray-500">
                  No lecture video available
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="bg-gray-800 rounded-lg shadow-sm">
              <div className="border-b">
                <nav className="flex space-x-8 px-6 text-white">
                  {["overview", "curriculum", "instructor", "reviews"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`py-4 text-sm text-white font-medium border-b-2 ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-white"
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
                        <h3 className="text-white text-lg font-semibold mb-3">
                          About this course
                        </h3>
                        <p className="text-white leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "curriculum" && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-6">
                      Course Curriculum
                    </h3>
                    {course.lectures && course.lectures.length > 0 ? (
                      <div className="space-y-4">
                        {course.lectures.map((chapter, chapterIndex) => (
                          <div
                            key={`${chapter.title}-${chapterIndex}`}
                            className="border rounded-lg"
                          >
                            <div className="bg-gray-800 px-4 py-3 border-b">
                              <h4 className="font-medium text-white">
                                Chapter {chapterIndex + 1}: {chapter.title}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Curriculum information not available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "instructor" && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-6">
                      About the Instructor
                    </h3>
                    {course.instructor ? (
                      <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            {course.instructor?.name}
                          </h4>
                          <p className="text-white mt-2">
                            Experienced instructor with expertise in{" "}
                            {course.category || "this field"}.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500">
                        Instructor information not available.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div>
                    <h3 className="text-lg text-white font-semibold mb-6">
                      Ratings & Reviews
                    </h3>

                    {/* Review Form - Only for enrolled users */}
                    {isCompleted && (
                      <div className="mb-8 p-4 bg-gray-700 rounded-lg">
                        <h4 className="text-white font-medium mb-4">
                          Write a Review
                        </h4>

                        <div className="mb-4">
                          <label className="block mb-2 text-white font-medium">
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
                                    : "text-gray-400 hover:text-yellow-300"
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
                            className="w-full p-3 border border-gray-600 bg-gray-800 text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                          />
                        </div>

                        <button
                          onClick={handleSubmitReview}
                          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {reviews.length > 0 ? (
                        reviews
                          .filter((review) => review.isHidden == false)
                          .map((review) => (
                            <div
                              key={review._id}
                              className="border-t border-gray-600 pt-4"
                            >
                              <div className="flex items-center mb-2">
                                <div className="flex space-x-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`h-4 w-4 ${
                                        review.rating >= star
                                          ? "text-yellow-400 fill-current"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="ml-2 text-sm text-gray-300">
                                  By {review.user?.name || "Anonymous"}
                                </span>
                              </div>
                              <p className="text-white leading-relaxed">
                                {review.text}
                              </p>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-400">No reviews yet.</p>
                          <p className="text-gray-500 text-sm mt-2">
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

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center text-white mb-6">
                <div className="text-3xl font-bold text-white mb-2">
                  ₹{course.price}
                </div>
              </div>

              {isEnrolled ? (
                <button
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-md font-medium cursor-pointer mb-4"
                  onClick={() => navigate(`/users/course-view/${courseId}`)}
                >
                  Continue to Course
                </button>
              ) : (
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
                >
                  Enroll Now
                </button>
              )}

              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-white">Total Duration:</span>
                  <span className="font-medium text-white">
                    {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-white">Lessons:</span>
                  <span className="font-medium text-white">{totalLessons}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white">Access:</span>
                  <span className="font-medium text-white">Lifetime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
