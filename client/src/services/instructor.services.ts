import type { ICourse } from "../types/course.types";
import type {
  IInstructorProfile,
  VerifyInstructor,
} from "../types/instructor.types";
import type { CourseData } from "../types/course.types";
import type { INotification } from "../context/NotificationContext";
import type { Category } from "../types/category.types";
import type { User } from "../types/user.types";
import { createApi } from "./newApiService";
import type { Option, Question } from "../pages/Instructor/QuizCreation";

const api = createApi("instructor");

interface Quiz {
  title: string;
  description: string;
  passPercentage: number;
  questions: Question[];
}

interface UpdateQuiz {
  title: string;
  description: string;
  passPercentage: number;
  questions: QuestionUpdate[];
}

interface QuestionUpdate {
  questionText: string;
  options: Option[];
}

interface Review {
  _id: string;
  text: string;
  rating: number;
  user: { name: string };
  course: { title: string; instructor: { name: string } };
  createdAt: string;
  isHidden?: boolean;
}

interface InstructorRegisterResponse {
  message: string;
  data: {
    name: string;
    username: string;
    email: string;
    phone: string;
    education: string;
    title: string;
    yearsOfExperience: string;
    password: string;
    confirmPassword: string;
    resumeUrl: string;
  };
}

interface ChatResponse {
  _id: string;
}

interface Message {
  _id?: string;
  chat: string;
  senderId: string;
  content?: string;
  isDeleted: boolean;
  image?: string;
  senderRole: "User" | "Instructor";
  readBy: {
    _id: string;
    readerId: string;
    readerModel: "User" | "Instructor";
  }[];
  createdAt: string;
  updatedAt: string;
}

interface Dashboard {
  totalUsers: number;
  totalCourses: number;
}

interface ChatResponse {
  _id: string;
  instructor: string;
  user: {
    _id: string;
    name: string;
  };
  lastMessage: string;
  lastMessageContent: string;
  createdAt: string;
  updatedAt: string;
}

interface Enrollment {
  _id: string;
  course: { title: string };
  user: { name: string; email: string };
  isCompleted: boolean;
  createdAt: string;
}

export const getInstructorCoursesS = async (
  page: number,
  limit: number,
  search: string
) => {
  return await api.get<{
    courses: ICourse[];
    total: number;
    totalPages: number;
  }>(`/instructors/courses?page=${page}&limit=${limit}&search=${search}`);
};

export const getProfileS = async () => {
  return await api.get<IInstructorProfile>("/instructors/profile");
};

export const editProfileS = async (formPayload: FormData) => {
  return await api.put<IInstructorProfile>(
    "/instructors/profile",
    formPayload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const createCourseS = async (formData: FormData) => {
  return await api.post("/instructors/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCourseS = async (courseId: string, formData: FormData) => {
  return await api.put(
    `/instructors/courses/editcourse/${courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const instructorLoginS = async (email: string, password: string) => {
  return await api.post<VerifyInstructor>("/instructors/login", {
    email,
    password,
  });
};

export const instructorRegisterS = async (formPayload: {
  name: string;
  username: string;
  email: string;
  phone: string;
  education: string;
  title: string;
  yearsOfExperience: string;
  password: string;
  confirmPassword: string;
  resume: File;
}) => {
  const data = new FormData();

  data.append("name", formPayload.name);
  data.append("username", formPayload.username);
  data.append("email", formPayload.email);
  data.append("phone", formPayload.phone);
  data.append("education", formPayload.education);
  data.append("title", formPayload.title);
  data.append("yearsOfExperience", formPayload.yearsOfExperience);
  data.append("password", formPayload.password);
  data.append("confirmPassword", formPayload.confirmPassword);
  data.append("resume", formPayload.resume);

  return await api.post<InstructorRegisterResponse>(
    "/instructors/register",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getCourseById = async (courseId: string) => {
  return await api.get<CourseData>(`/instructors/courses/${courseId}`);
};

export const reapplyS = async (formData: FormData) => {
  return await api.put("/instructors/reapply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getEnrollments = async (
  page: number,
  limit: number,
  search: string,
  status: string
) => {
  return await api.get<{
    enrollments: Enrollment[];
    totalPages: number;
  }>(
    `/instructors/enrollments?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
};

export const instructorRefreshTokenS = async () => {
  return await api.post<{ token: string }>("/instructors/refresh-token", {});
};

export const getWalletSforInstructor = async (page: number, limit: number) => {
  return await api.get<{
    transactions: [];
    balance: number;
    totalPages: number;
  }>(`/instructors/wallet?page=${page}&limit=${limit}`);
};

export const instructorCourseChart = async () => {
  return await api.get<{ title: string; enrolledCount: number }[]>(
    "/instructors/course-stats"
  );
};

export const instructorIncomeChart = async () => {
  return await api.get<{ month: string; revenue: number }[]>(
    "/instructors/income-stats"
  );
};

export const unreadCountS = async (
  userId: string,
  userModel: "User" | "Instructor"
) => {
  const res = await api.get<{ count: number; chat: string }[]>(
    `/instructors/chats/unread-counts?userId=${userId}&userModel=${userModel}`
  );
  const totalCount = res.data.reduce((acc, curr) => acc + curr.count, 0);
  return totalCount;
};

export const instructorLogout = async () => {
  return await api.post("/instructors/logout", {}, { withCredentials: true });
};

export const instructorNotification = async (userId: string) => {
  return await api.get<INotification[]>(`/instructors/notifications/${userId}`);
};

export const markAsReadInstructor = async (notificationId: string) => {
  return await api.put(`/instructors/notifications/read/${notificationId}`);
};

export const getCategory = async () => {
  return await api.get<Category[]>("/instructors/category");
};

export const getChatList = async (userId: string) => {
  const res = await api.get<ChatResponse[]>(
    `/chats/list/${userId}?role=instructor`
  );

  const formattedChats = res.data.map((chat) => ({
    chatId: chat._id,
    partnerId: chat.user._id,
    partnerName: chat.user.name,
    lastMessage: chat.lastMessage,
  }));

  return formattedChats;
};

export const filteredUsers = async () => {
  return await api.get<User[]>("/instructors/users/purchased");
};

export const initiateChat = async (
  instructorId: string,
  userId: string
): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chats/initiate", {
    instructorId,
    userId,
  });
  return res.data;
};

export const instructorResetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  return await api.put(`/instructors/resetpassword`, {
    email,
    newPassword,
    confirmPassword,
  });
};

export const markMessagesReadS = async (
  chatId: string,
  userId: string,
  userModel: "User" | "Instructor"
) => {
  return await api.post(`/instructors/messages/mark-as-read/${chatId}`, {
    userId: userId,
    userModel: userModel,
  });
};

export const getMessages = async (chatId: string) => {
  return await api.get<Message[]>(`/messages/${chatId}`);
};

export const sentImageinMessage = async (formData: FormData) => {
  return await api.post<{ message: string; url: string }>(
    "/messages/upload-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const instructorReviews = async (
  page: number,
  limit: number,
  rating: number | null
) => {
  return await api.get<{
    reviews: Review[];
    total: number;
    totalPages: number;
  }>(
    `/instructors/reviews?page=${page}&limit=${limit}&rating=${rating ?? "0"}`
  );
};

export const getDashboard = async () => {
  return await api.get<Dashboard>("/instructors/dashboard");
};

export const resentOtpS = async (email: string) => {
  const otp = await api.post(`/instructors/resend-otp`, {
    email,
  });
  console.log("email");
  return otp;
};

export const quizCreate = async (courseId: string, quiz: Quiz) => {
  return await api.post(`/instructors/quiz/create-quiz/${courseId}`, quiz);
};

export const updateQuiz = async (quizId: string, updateData: UpdateQuiz) => {
  const updated = await api.put(`/instructors/quiz/${quizId}`, updateData);
  console.log(updateData);
  return updated;
};

export const getInstructorQuizzes = async () => {
  return await api.get(`/instructors/quiz`);
};

export const deleteQuiz = async (quizId: string) => {
  return api.patch(`/instructors/delete/quiz/${quizId}`);
};

export const restoreQuiz = async (quizId: string) => {
  return api.patch(`/instructors/restore/quiz/${quizId}`);
};

export const getQuiz = async (quizId: string) => {
  return await api.get(`/instructors/quiz/${quizId}`);
};

export const createLiveSessionS = async (courseId: string) => {
  return await api.post("/instructors/live/create-session", {
    courseId,
    startTime: new Date(),
  });
};

export const endLiveSession = async (isLive: boolean, sessionId: string) => {
  return await api.patch(`/instructors/live/end-live`, { isLive, sessionId });
};

export const startLiveSession = async (
  sessionId: string,
  userId: string,
  role: string
) => {
  return await api.get(
    `/instructors/live/token?sessionId=${sessionId}&userId=${userId}&role=${role}`
  );
};
