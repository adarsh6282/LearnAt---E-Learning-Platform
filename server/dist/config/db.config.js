"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Database = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_CREDS);
        console.log("MongoDB connected");
    }
    catch (err) {
        console.error(err);
        process.exit(1);
    }
};
exports.default = Database;
