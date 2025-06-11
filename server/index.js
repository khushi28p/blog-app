import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Server running");
})

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
})