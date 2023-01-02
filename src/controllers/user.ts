import { Request, Response } from "express";
import * as yup from "yup";
import {
  dbCreateUser,
  dbFetchAllUsers,
  dbFindUser,
  dbGetUserViaPassword,
} from "../db/user";
import { validateLogin, validateRegistration } from "../validations/user";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password } = req.body;

    const validate = await validateRegistration(name, email, password);
    if (validate !== true) {
      return res.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ email });
    if (userExists?.rowCount) {
      return res.status(400).send({ message: "User already exists" });
    }
    const user = await dbCreateUser(name, email, password);
    if (!user) {
      return res.status(500).send({ message: "Error creating user" });
    }
    res.send({ userId: user.rows[0]?.id });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const isValid = validateLogin(email, password);
    if (!isValid) {
      return res.status(400).send({ message: "type error" });
    }
    const userExists = await dbFindUser({ email });
    if (!userExists?.rowCount) {
      return res.status(400).send({ message: "User does not exist" });
    }
    const user = await dbGetUserViaPassword(email, password);
    if (!user) {
      return res.status(500).send({ message: "Internal server error" });
    }
    if (!user?.rowCount) {
      return res.status(400).send({ message: "incorrect password" });
    }
    res.status(200).send({
      userId: user?.rows[0]?.id,
      name: user?.rows[0]?.name,
      email: user?.rows[0]?.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await dbFetchAllUsers();
    if (!users) {
      return res.status(500).send({ message: "Internal server error" });
    }
    res.status(200).send(users.rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Internal server error" });
  }
};
