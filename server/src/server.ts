import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import http from "http";
import Database from "./config/db.config";
import passport from "./config/passport.config";
import { initSocket } from "./socket/socket";
import nocache from "nocache";

dotenv.config();

const app = express();

app.use(passport.initialize());

import userRoutes from "./routes/user.routes";
import instructorRoutes from "./routes/instructor.routes";
import adminRoutes from "./routes/admin.routes";
import courseRoutes from "./routes/course.routes";
import reviewRoutes from "./routes/review.routes";
import chatRoutes from "./routes/chat.routes";
import messageRoutes from "./routes/message.routes";

Database();

const allowedOrigins=[
    'https://learnat.vercel.app',
    'http://localhost:5173'
]

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(nocache());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({limit:"100mb"}));
app.use(express.urlencoded({limit:"100mb", extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/users/reviews", reviewRoutes);
app.use("/api/instructors", instructorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/instructors/courses", courseRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`server started`);
});
