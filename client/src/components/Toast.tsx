import {toast} from "react-hot-toast";

export const successToast = (message: string) => {
  toast.success(message, {
    style: {
      background: "#22c55e",
      color: "#fff",
    },
  });
};

export const errorToast = (message: string) => {
  toast.error(message, {
    style: {
      background: "#ef4444",
      color: "#fff",
    },
  });
};
