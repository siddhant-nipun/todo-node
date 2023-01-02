import { Pool } from "pg";

interface credInterface {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

let dbPool: Pool | undefined = undefined;

// Connect with a connection pool.
const poolDemo = async (credentials: credInterface) => {
  dbPool = new Pool(credentials);
  const now = await dbPool.query("SELECT NOW()");
  // await dbPool.end();
  return now;
};

const connectDatabase = async (credentials: credInterface) => {
  const poolResult = await poolDemo(credentials);
  console.log("Time with pool: " + poolResult.rows[0]["now"]);
};

const disconnectDatabase = async () => {
  await dbPool?.end();
};

export { connectDatabase, disconnectDatabase, dbPool };
