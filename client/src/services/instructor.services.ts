import type { ICourse } from "../types/course.types";
import type {
  IInstructorProfile,
  VerifyInstructor,
} from "../types/instructor.types";
import type { CourseData } from "../types/course.types";
import instructorApi from "./instructorApiService";

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

export const getInstructorCoursesS = async (page:number,limit:number) => {
  return await instructorApi.get<{courses:ICourse[],total:number,totalPages:number}>(`/instructors/courses?page=${page}&limit=${limit}`);
};

export const getProfileS = async () => {
  return await instructorApi.get<IInstructorProfile>("/instructors/profile");
};

export const editProfileS = async (formPayload: FormData) => {
  return await instructorApi.put<IInstructorProfile>(
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
  return await instructorApi.post("/instructors/courses", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCourseS = async (
  courseId: string,
  formData: FormData,
) => {
  return await instructorApi.put(
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
  return await instructorApi.post<VerifyInstructor>("/instructors/login", {
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

  return await instructorApi.post<InstructorRegisterResponse>(
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
  return await instructorApi.get<CourseData>(
    `/instructors/courses/${courseId}`);
};

export const reapplyS = async (formData: FormData) => {
  return await instructorApi.put("/instructors/reapply", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
