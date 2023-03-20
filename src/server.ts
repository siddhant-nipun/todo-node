import express, { Request, Response } from "express";
import Fastify from "fastify";
import { connectDatabase } from "../database/db";
import { getAllUsers, login, registerUser } from "./controllers/user";
import setSession from "./middlewares/session";
import authMiddleware from "./middlewares/auth";
import { todo } from "./routes/todo";
import * as dotenv from "dotenv";
import cors from '@fastify/cors'

dotenv.config();

const fastify = Fastify({
  logger: true,
});

console.log({
  pg_host : process.env.PG_HOST,
  user: process.env.PGUSER ?? "",
  host: process.env.PGHOST ?? "",
  database: process.env.PGDATABASE ?? "",
  password: process.env.PGPASSWORD ?? "",
  port: parseInt(process.env.PGPORT ?? ""),
})

connectDatabase({
  user: process.env.PGUSER ?? "",
  host: process.env.PGHOST ?? "",
  database: process.env.PGDATABASE ?? "",
  password: process.env.PGPASSWORD ?? "",
  port: parseInt(process.env.PGPORT ?? ""),
});

// connectDatabase(process.env.DATABASE_URL ?? "");

fastify.register(cors, {
  origin: ['http://localhost:3001', 'http://localhost:3000'],
});


fastify.get("/health", (req, reply) => {
  reply.send("ok");
});

fastify.post("/register", registerUser);

fastify.post("/login", login);

// middleware
//  fastify.register(setSession);
fastify.register(authMiddleware);

fastify.get("/users", getAllUsers);

fastify.register(todo, { prefix: "todo" });

const loaded = async () => {
  try {
    await fastify.ready();
    console.log("Everything is loaded");
  } catch (error) {
    console.log("Error loading");
  }
};
loaded();

fastify.listen({ port: 5000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running at ${address}`);
});
