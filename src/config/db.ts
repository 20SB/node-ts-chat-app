import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../models/schema";

// export const client = new Client({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
//   port: process.env.port,
//   ssl: process.env.ssl,
// });

export let client = new Client(process.env.PG_URL);

client
  .connect()
  .then(() => {
    console.log("Postgress Client is Connected Successfully");
  })
  .catch((err: any) => {
    console.error("Error connecting DB : ", err);
  });

const postgresdb = drizzle(client, { schema: { ...schema } });

export default postgresdb;

// Function to disconnect from the PostgreSQL database
export const disconnectDB = async () => {
  try {
    await client.end();
    console.log("Postgres Client has been disconnected successfully");
  } catch (err) {
    console.error("Error disconnecting DB: ", err);
  }
};
