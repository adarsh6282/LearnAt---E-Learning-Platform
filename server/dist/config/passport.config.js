"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/implementations/userModel"));
dotenv_1.default.config();
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found in Google profile"));
        }
        const user = await userModel_1.default.findOne({ email });
        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            return done(null, user);
        }
        else {
            const newUser = new userModel_1.default({
                name: profile.displayName,
                email,
                googleId: profile.id,
            });
            await newUser.save();
            return done(null, newUser);
        }
    }
    catch (error) {
        console.error("Google Auth Error:", error);
        return done(error);
    }
}));
exports.default = passport_1.default;
