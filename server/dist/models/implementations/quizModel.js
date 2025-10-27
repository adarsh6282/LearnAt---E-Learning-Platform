"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false },
}, { _id: false });
const questionSchema = new mongoose_1.Schema({
    questionText: { type: String },
    options: { type: [optionSchema], required: true },
    explanation: { type: String },
}, { _id: true });
const quizSchema = new mongoose_1.Schema({
    courseId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Course", required: true },
    instructorId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Instructor", required: true },
    title: { type: String, required: true },
    description: { type: String },
    questions: { type: [questionSchema], required: true },
    passPercentage: { type: Number, required: true, default: 50 },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Quiz", quizSchema);
