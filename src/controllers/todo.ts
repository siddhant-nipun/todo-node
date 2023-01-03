import { Request, response, Response } from "express";
import { FastifyReply } from "fastify";
import {
  dbArchiveTodo,
  dbCreateTask,
  dbGetUserTodos,
  dbUpdateTodo,
} from "../db/todos";
import { dbFindUser } from "../db/user";
import {
  validateArchiveTask,
  validateCreateTask,
  validateUpdateTask,
} from "../validations/todos";
import { validateUserId } from "../validations/user";

export const getAllTasks = async (req: Request, res: FastifyReply) => {
  try {
    const { userId } = req.body;
    // validate body
    const validate = await validateUserId(userId);
    if (validate !== true) {
      return res.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ userId });
    if (!userExists?.rowCount) {
      return res.status(400).send({ message: "Error creating todo" });
    }
    // fetch from database
    const todos = await dbGetUserTodos({ userId });
    if (!todos) {
      return res.status(500).send({ message: "Internal server error" });
    }
    const responseTodo = todos.rows.map((todo) => {
      return {
        id: todo.id,
        description: todo.description,
        isCompleted: todo.is_completed,
      };
    });
    // success
    res.status(200).send(responseTodo);
  } catch (error: any) {
    res.status(500).send("Internal server error");
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { userId, description } = req.body;
    const validate = await validateCreateTask({ userId, description });
    if (validate !== true) {
      return res.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ userId });
    if (!userExists?.rowCount) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const task = await dbCreateTask({ userId, description });
    if (!task) {
      return res.status(500).send({ message: "Internal server error" });
    }
    res.status(200).send({ description: task.rows[0]?.description });
  } catch (error: any) {
    res.status(500).send("Internal server error");
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { userId, isCompleted, description } = req.body;
    const { id: todoId } = req.params;
    const validate = await validateUpdateTask({
      userId,
      todoId,
      isCompleted,
      description,
    });
    if (validate !== true) {
      return res.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ userId });
    if (!userExists?.rowCount) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const task = await dbUpdateTodo({
      userId,
      todoId,
      isCompleted,
      description,
      updatedAt: new Date(),
    });
    if (!task) {
      return res.status(500).send({ message: "Internal server error" });
    }
    if (!task.rowCount) {
      return res.status(404).send({ message: "Cannot find the todo" });
    }
    res.status(200).send({
      message: "success",
    });
  } catch (error: any) {
    res.status(500).send("Internal server error");
  }
};

export const archiveTask = async (req: Request, res: Response) => {
  try {
    const { userId, todoId } = req.body;
    const validate = await validateArchiveTask({
      userId,
      todoId,
    });
    if (validate !== true) {
      return res.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ userId });
    if (!userExists?.rowCount) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const task = await dbArchiveTodo({
      userId,
      todoId,
      archivedAt: new Date(),
    });
    if (!task) {
      return res.status(500).send({ message: "Internal server error" });
    }
    if (!task.rowCount) {
      return res.status(404).send({ message: "Cannot find the todo" });
    }
    res.status(200).send({
      message: "success",
      todoId: task.rows[0]?.id,
      isDeleted: task.rows[0]?.is_archived,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).send("Internal server error");
  }
};
