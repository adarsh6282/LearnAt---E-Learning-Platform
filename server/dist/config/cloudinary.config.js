"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const streamifier_1 = __importDefault(require("streamifier"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
    secure: true,
});
function uploadBufferToCloudinary(buffer, publicId) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: "certificates",
            public_id: publicId,
            format: "jpeg",
        }, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
}
exports.default = cloudinary_1.v2;
