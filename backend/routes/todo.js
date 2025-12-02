import express from "express";
import jwt from "jsonwebtoken";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../controller/todocontroller.js";

const router = express.Router();

// Auth check function
const authCheck = (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id; // attach user id
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// Routes with authCheck
router.post("/create", authCheck, createTodo);
router.get("/fetch", authCheck, getTodos);
router.put("/update/:id", authCheck, updateTodo);
router.delete("/delete/:id", authCheck, deleteTodo);

export default router;
