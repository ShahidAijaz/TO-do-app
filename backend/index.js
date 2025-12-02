import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import todoRoute from "./routes/todo.js";
import userRoute from "./routes/userroute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const db_url = process.env.MONGODB_URL;

// Database connection
mongoose.connect(db_url)
  .then(() => console.log("Database connected successfully"))
  .catch(err => console.log("Database connection failed:", err));

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // keep true if you plan to send cookies/auth
}));

// Routes
app.use("/todo", todoRoute);
app.use("/user", userRoute);

// Root route
app.get("/", (req, res) => {
  res.send("Todo API is running!");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
