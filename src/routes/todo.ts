// import express from "express";
import {
  archiveTask,
  createTask,
  getAllTasks,
  updateTask,
} from "../controllers/todo";

// export const todo = express.Router();

export const todo = async(fastify: any, options: any) => {
  fastify.get("/", getAllTasks);

  fastify.post("/", createTask);

  fastify.put("/:id", updateTask);

  fastify.delete("/", archiveTask);
};
