"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = uploadToCloudinary;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_config_1 = require("./cloudinary.config");
function uploadToCloudinary(file) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.cloudinary.uploader.upload_stream({
            resource_type: "video",
            folder: "courses/lectures",
            public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
            format: "mp4",
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result.secure_url);
        });
        streamifier_1.default.createReadStream(file.buffer).pipe(uploadStream);
    });
}
