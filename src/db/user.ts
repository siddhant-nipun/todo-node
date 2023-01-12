import { dbPool } from "../../database/db";
import { v4 as uuidv4 } from "uuid";

export const dbFindUser = ({
  email,
  userId,
}: {
  email?: string;
  userId?: string;
}) => {
  if (!userId && !email) {
    return;
  }
  const attribute = userId ? "id" : "email";
  const sql = `SELECT id FROM users WHERE ${attribute} = $1`;
  const values = [userId ?? email?.trim().toLowerCase()];

  return dbPool?.query(sql, values);
};

export const dbCreateUser = (name: string, email: string, password: string) => {
  const sql = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
  const values = [name, email.trim().toLowerCase(), password];
  return dbPool?.query(sql, values);
};

export const dbGetUserViaPassword = (email: string, password: string) => {
  const sql =
    "SELECT id, name, email FROM users where email = $1 AND password = $2";
  const values = [email.trim().toLowerCase(), password];
  return dbPool?.query(sql, values);
};

export const dbFetchAllUsers = () => {
  const sql = "SELECT id, name, email FROM users";
  return dbPool?.query(sql);
};

export const dbGetUserFromSession = (token: string) => {
  const sql = "SELECT user_id from user_session where session_token = $1";
  return dbPool?.query(sql, [token]);
};

export const dbCreateSession = (userId: string) => {
  const sql = `
  INSERT INTO user_session (user_id, session_token, created_at)
  VALUES ($1, $2, $3)
  RETURNING session_token
`;
  const values = [userId, uuidv4(), new Date()];
  return dbPool?.query(sql, values);
};
