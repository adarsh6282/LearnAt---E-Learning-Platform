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
const socket_1 = require("./socket/socket");
const nocache_1 = __importDefault(require("nocache"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(passport_config_1.default.initialize());
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const instructor_routes_1 = __importDefault(require("./routes/instructor.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const review_routes_1 = __importDefault(require("./routes/review.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
const message_routes_1 = __importDefault(require("./routes/message.routes"));
(0, db_config_1.default)();
const allowedOrigins = [
    'https://learnat.vercel.app',
    'http://localhost:5173'
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
const server = http_1.default.createServer(app);
(0, socket_1.initSocket)(server);
app.use((0, nocache_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/users", user_routes_1.default);
app.use("/api/users/reviews", review_routes_1.default);
app.use("/api/instructors", instructor_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/instructors/courses", course_routes_1.default);
app.use("/api/chats", chat_routes_1.default);
app.use("/api/messages", message_routes_1.default);
server.listen(process.env.PORT, () => {
    console.log(`server started`);
});
