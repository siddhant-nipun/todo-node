import { Request, Response } from "express";
import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "jsonwebtoken";
import { resolveModuleName } from "typescript";
import * as yup from "yup";
import {
  dbCreateSession,
  dbCreateUser,
  dbFetchAllUsers,
  dbFindUser,
  dbGetUserFromSession,
  dbGetUserViaPassword,
} from "../db/user";
import { FastifyRequestWithUserId } from "../types";
import { generateToken, verifyToken } from "../utils/auth";
import {
  validateLogin,
  validateRegistration,
  validateString,
} from "../validations/user";

export const registerUser = async (req: any, reply: any) => {
  try {
    const { email, name, password } = req.body;

    const validate = await validateRegistration(name, email, password);
    if (validate !== true) {
      return reply.status(400).send({ message: validate });
    }
    const userExists = await dbFindUser({ email });
    if (userExists?.rowCount) {
      return reply.status(400).send({ message: "User already exists" });
    }
    const user = await dbCreateUser(name, email, password);
    if (!user) {
      return reply.status(500).send({ message: "Error creating user" });
    }
    const jwtToken = generateToken(user.rows[0]?.id);
    const session = await dbCreateSession(user?.rows[0]?.id);
    if (!session?.rowCount) {
      return reply.status(500).send({ message: "Error creating user session" });
    }
    reply.status(200).send({
      token: jwtToken,
      // sessionToken: session.rows[0].session_token,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
};

export const login = async (req: any, reply: any) => {
  try {
    const { email, password } = req.body;

    const isValid = validateLogin(email, password);
    if (!isValid) {
      return reply.status(400).send({ message: "type error" });
    }
    const userExists = await dbFindUser({ email });
    if (!userExists?.rowCount) {
      return reply.status(400).send({ message: "User does not exist" });
    }
    const user = await dbGetUserViaPassword(email, password);
    if (!user) {
      return reply.status(500).send({ message: "Internal server error" });
    }
    if (!user?.rowCount) {
      return reply.status(400).send({ message: "incorrect password" });
    }
    const jwtToken = generateToken(user.rows[0]?.id);
    const session = await dbCreateSession(user?.rows[0]?.id);
    if (!session?.rowCount) {
      return reply.status(500).send({ message: "Error creating user session" });
    }
    reply.status(200).send({
      token: jwtToken,
      // sessionToken: session.rows[0].session_token,
    });
  } catch (error) {
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: any, reply: any) => {
  try {
    const users = await dbFetchAllUsers();
    if (!users) {
      return reply.status(500).send({ message: "Internal server error" });
    }
    reply.status(200).send(users.rows);
  } catch (error) {
    console.log(error);
    reply.status(500).send({ message: "Internal server error" });
  }
};

export const getUserBySession = async (
  req: FastifyRequestWithUserId,
  reply: FastifyReply,
  done: any
) => {
  try {
    if (["/register", "/login", "/health"].includes(req.url)) {
      return;
    }
    const apiKey = req.headers["x-api-key"] as string;
    const isValid = await validateString(apiKey);
    if (!isValid) {
      return reply.status(401).send({ message: "not authorized" });
    }
    const user = await dbGetUserFromSession(apiKey);
    if (!user) {
      return reply.status(500).send({ message: "Internal server error" });
    }
    if (!user?.rowCount) {
      return reply.status(401).send({ message: "not authorized" });
    }
    req.userId = user?.rows[0]?.user_id;
    done();
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};

export const getUserByJWT = async (
  req: FastifyRequestWithUserId,
  reply: FastifyReply,
  done: any
) => {
  try {
    if (["/register", "/login", "/health"].includes(req.url)) {
      return;
    }
    const apiKey = req.headers["x-api-key"] as string;
    const isValid = await validateString(apiKey);
    if (!isValid) {
      return reply.status(401).send({ message: "not authorized" });
    }
    const verified = verifyToken(apiKey);
    if (verified && (verified as JwtPayload)?.userId) {
      req.userId = (verified as JwtPayload)?.userId;
    } else {
      return reply.status(401).send({ message: "not authorized" });
    }
    const userExists = await dbFindUser({ userId: req.userId });
    if (!userExists?.rowCount) {
      return reply.status(400).send({ message: "Cannot find user" });
    }
    return;
  } catch (error) {
    console.log(error);
    return reply.status(500).send({ message: "Internal server error" });
  }
};
