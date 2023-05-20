import { Pool } from "pg";

interface credInterface {
  user: string;
  host: string;
  database: string;
  password: string;
  port: number;
}

let dbPool: Pool | undefined = undefined;

const poolDemoUrl = async (connectionString: string) => {
  dbPool = new Pool({
    connectionString: connectionString,
  });
  const now = await dbPool.query("SELECT NOW()");
  return now;
};

// Connect with a connection pool.
const poolDemo = async (credentials: credInterface) => {
  dbPool = new Pool(credentials);
  const now = await dbPool.query("SELECT NOW()");
  // await dbPool.end();
  return now;
};

const connectDatabase = async (
  credentials: credInterface,
  // connectionString: string
) => {
  const poolResult = await poolDemo(credentials);
  // const poolResult = await poolDemoUrl(connectionString);
  console.log("Time with pool: " + poolResult.rows[0]["now"]);
};

const disconnectDatabase = async () => {
  await dbPool?.end();
};

export { connectDatabase, disconnectDatabase, dbPool };
