"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const http_1 = __importDefault(require("http"));
const db_config_1 = __importDefault(require("./config/db.config"));
const passport_config_1 = __importDefault(require("./config/passport.config"));
const nocache_1 = __importDefault(require("nocache"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(passport_config_1.default.initialize());
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const instructor_routes_1 = __importDefault(require("./routes/instructor.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
(0, db_config_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));
const server = http_1.default.createServer(app);
app.use((0, nocache_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/users", user_routes_1.default);
app.use("/instructors", instructor_routes_1.default);
app.use("/admin", admin_routes_1.default);
app.use("/instructors/courses", course_routes_1.default);
server.listen(process.env.PORT, () => {
    console.log(`server started`);
});
