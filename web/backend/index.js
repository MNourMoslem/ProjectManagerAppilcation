import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import { connectDB } from "./src/db/connectdb.js";

import authRoutes from "./src/routes/auth.route.js";
import projectRoutes from "./src/routes/project.route.js";
import taskRoutes from "./src/routes/task.route.js";
import issueRoutes from "./src/routes/issue.route.js";
import commentRouted from "./src/routes/comment.route.js";
import mailRoutes from "./src/routes/mail.route.js";

import { verifyToken } from "./src/middleware/verifyToken.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8081', 'exp://localhost:8081'],
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', "PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // allows us to parse incoming requests:req.body
app.use(cookieParser()); // allows us to parse incoming cookies

app.use("/api/auth", authRoutes);

// protecet with check-auth middleware
app.use("/api/projects", verifyToken, projectRoutes);
app.use("/api/tasks", verifyToken, taskRoutes);
app.use("/api/issues", verifyToken, issueRoutes);
app.use("/api/comments", verifyToken, commentRouted);
app.use("/api/mails", verifyToken, mailRoutes);

app.listen(PORT, () => {
	connectDB();
	console.log("Server is running on port: ", PORT);
});