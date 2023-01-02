import express from "express";
import { archiveTask, createTask, getAllTasks, updateTask } from "../controllers/todo";

export const todo = express.Router();

todo.post("/all", getAllTasks);

todo.post("/", createTask);

todo.put("/", updateTask);

todo.delete("/", archiveTask);
