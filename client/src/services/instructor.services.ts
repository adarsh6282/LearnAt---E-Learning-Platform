import axiosInstance from "./apiService";
import type { ICourse } from "../types/course.types";
import type {
  IInstructorProfile,
  VerifyInstructor,
} from "../types/instructor.types";
import type { CourseData } from "../types/course.types";

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

export const getInstructorCoursesS = async (token: string) => {
  return await axiosInstance.get<ICourse[]>("/instructors/courses", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProfileS = async () => {
  return await axiosInstance.get<IInstructorProfile>("/instructors/profile", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("instructorsToken")}`,
    },
  });
};

export const editProfileS = async (formPayload: FormData) => {
  return await axiosInstance.put<IInstructorProfile>(
    "/instructors/profile",
    formPayload,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("instructorsToken")}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const createCourseS = async (formData: FormData, token: string) => {
  return await axiosInstance.post("/instructors/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

export const editCourseS = async (
  courseId: string,
  formData: FormData,
  token: string
) => {
  return await axiosInstance.put(
    `/instructors/courses/editcourse/${courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const instructorLoginS = async (email: string, password: string) => {
  return await axiosInstance.post<VerifyInstructor>("/instructors/login", {
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

  return await axiosInstance.post<InstructorRegisterResponse>(
    "/instructors/register",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const getCourseById = async (courseId: string, token: string) => {
  return await axiosInstance.get<CourseData>(
    `/instructors/courses/${courseId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const reapplyS = async (formData: FormData) => {
  return await axiosInstance.put("/instructors/reapply", formData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("instructorsToken")}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
