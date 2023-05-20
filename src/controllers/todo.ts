import { Request, response, Response } from "express";
import { FastifyReply } from "fastify";
import {
  dbArchiveTodo,
  dbCreateTask,
  dbGetUserTodos,
  dbUpdateTodo,
} from "../db/todos";
import { dbFindUser } from "../db/user";
import { FastifyRequestWithUserId } from "../types";
import {
  validateArchiveTask,
  validateCreateTask,
  validateUpdateTask,
} from "../validations/todos";
import {
  validateBool,
  validateString,
  validateUserId,
} from "../validations/user";

export const getAllTasks = async (req: any, res: FastifyReply) => {
  try {
    const { userId } = req;
    const isCompleted = req.query?.isCompleted ?? null;
    const search = req.query.search ?? null;
    
    if (isCompleted !== null) {
      const validateIsCompleted = await validateBool(isCompleted);
      if (validateIsCompleted !== true) {
        return res.status(400).send({ message: validateIsCompleted });
      }
    }
    if (search !== null) {
      const validateSearch = await validateString(search);
      if (validateSearch !== true) {
        return res.status(400).send({ message: validateSearch });
      }
    }
    // fetch from database
    const todos = await dbGetUserTodos({ userId, isCompleted, search });
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
    res.status(500).send({ message: "Internal server error" });
  }
};

export const createTask = async (req: any, res: Response) => {
  try {
    const { description } = req.body;
    const { userId } = req;
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

export const updateTask = async (req: any, res: Response) => {
  try {
    const { isCompleted, description } = req.body;
    const { userId } = req;
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

export const archiveTask = async (req: any, res: Response) => {
  try {
    const { todoId } = req.body;
    const { userId } = req;
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
