import express, { Request, Response } from "express";
import Fastify from "fastify";
import { connectDatabase } from "../database/db";
import { getAllUsers, login, registerUser } from "./controllers/user";
import setSession from "./middlewares/session";
import authMiddleware from "./middlewares/auth";
import { todo } from "./routes/todo";

const fastify = Fastify({
  logger: true,
});

// var temp = process.env.NEXT_PUBLIC_DATABASE_NAME ?? "";

connectDatabase({
  user: "local",
  host: "localhost",
  database: "postgres",
  password: "12345",
  port: 5433,
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

// const app = express();

// basic middleware setup
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());

// // routes setup
// app.get("/health", (req: Request, res: Response) => {
//   res.status(200).send("ok");
// });

// app.post("/register", registerUser);

// app.post("/login", login);

// app.get("/users", getAllUsers);

// app.use("/todo", todo);

// connect to database
// connectDatabase({
//   user: "local",
//   host: "localhost",
//   database: "postgres",
//   password: "12345",
//   port: 5433,
// });

// // start the server
// app.listen(5000, () => {
//   console.log("Server is running on port 5000...");
// });
