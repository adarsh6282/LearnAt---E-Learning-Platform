"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    text: {
        type: String,
        required: true,
        trim: true,
    },
    isHidden: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
exports.default = mongoose_2.default.model("Review", reviewSchema);
