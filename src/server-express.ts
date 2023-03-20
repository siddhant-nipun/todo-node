import express, { Request, Response } from "express";
import { connectDatabase } from "../database/db";
import { getAllUsers, login, registerUser } from "./controllers/user";
import { todo } from "./routes/todo";

const app = express();

// basic middleware setup
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// routes setup
app.get("/health", (req: Request, res: Response) => {
  res.status(200).send("ok");
});

app.post("/register", registerUser);

app.post("/login", login);

app.get("/users", getAllUsers);

app.use("/todo", todo);

// connect to database
// connectDatabase({
//   user: "local",
//   host: "localhost",
//   database: "postgres",
//   password: "12345",
//   port: 5433,
// });

// start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000...");
});
