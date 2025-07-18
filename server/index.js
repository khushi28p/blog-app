import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import imageRouter from "./routes/image.routes.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";

dotenv.config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL;

app.use(express.json());
app.use(cors({
  origin: frontendUrl,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

const PORT = process.env.PORT;
  
app.use("/api/auth", authRoutes);
app.use('/api/upload-image', imageRouter);
app.use("/api/blog", blogRouter);
app.use('/api/user', userRouter);
app.use('/api/comments', commentRouter);

app.get("/", (req, res) => {
    res.send("Server running");
})

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})