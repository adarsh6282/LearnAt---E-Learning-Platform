import { toast } from "react-toastify";

export const successToast = (message: string) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    theme: "colored",
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    theme: "colored",
  });
};
