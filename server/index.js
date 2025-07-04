import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import imageRouter from "./routes/image.routes.js";
import blogRouter from "./routes/blog.routes.js";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use('/api/upload-image', imageRouter);
app.use("/api/blog", blogRouter);
app.use('/api/user', userRouter)

app.get("/", (req, res) => {
    res.send("Server running");
})

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})