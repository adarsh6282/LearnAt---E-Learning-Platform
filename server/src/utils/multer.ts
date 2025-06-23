import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/quicktime",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images, videos, and resume documents are allowed."));
  }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
    fileFilter: fileFilter
});

export default upload;