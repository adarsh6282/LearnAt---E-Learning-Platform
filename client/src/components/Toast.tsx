import { toast } from "react-toastify";

export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 1500,
    pauseOnHover: true,
    theme: "colored",
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 1500,
    pauseOnHover: true,
    theme: "colored",
  });
};
