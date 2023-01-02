import { dbPool } from "../../database/db";

interface dbCreateTaskInterface {
  userId: string;
  description: string;
}

interface dbUpdateTaskInterface {
  todoId: string;
  userId: string;
  description: string | null;
  isCompleted: boolean | null;
  updatedAt: Date;
}

interface dbArchiveTaskInterface {
  todoId: string;
  userId: string;
  archivedAt: Date;
}

export const dbCreateTask = ({
  userId,
  description,
}: dbCreateTaskInterface) => {
  const sql = `INSERT INTO todos (user_id, description)
                VALUES ($1, $2)
                RETURNING description`;
  const values = [userId, description];
  return dbPool?.query(sql, values);
};

export const dbGetUserTodos = ({ userId }: { userId: string }) => {
  const sql = `Select id, description, is_completed from todos where user_id = $1 AND archived_at IS NULL`;
  const values = [userId.trim()];
  return dbPool?.query(sql, values);
};

export const dbUpdateTodo = ({
  userId,
  description,
  isCompleted,
  todoId,
  updatedAt,
}: dbUpdateTaskInterface) => {
  const sql = `UPDATE todos SET is_completed = COALESCE ( $1, (SELECT is_completed from todos WHERE id = $4)),
                 description = COALESCE ( $2, (SELECT description from todos WHERE id = $4)),
                 updated_at = $5
                 WHERE user_id = $3 AND id = $4 AND archived_at IS NULL
                RETURNING id, description, is_completed`;
  const values = [isCompleted, description, userId, todoId, updatedAt];
  return dbPool?.query(sql, values);
};

export const dbArchiveTodo = ({
  userId,
  todoId,
  archivedAt,
}: dbArchiveTaskInterface) => {
  const sql = `UPDATE todos SET archived_at = $1 
                WHERE user_id = $2 AND id = $3
                RETURNING id, archived_at`;
  const values = [archivedAt, userId, todoId];
  return dbPool?.query(sql, values);
};
