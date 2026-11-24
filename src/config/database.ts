import "dotenv/config";
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri, {
  maxPoolSize: 10,
  minPoolSize: 2,
  serverSelectionTimeoutMS: 5000,
});

let db: Db | null = null;

export async function dataBaseConnect(): Promise<void> {
  const maxAttempts = process.env.NODE_ENV === "production" ? 5 : 1;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.connect();

      db = client.db("todoApp");

      await db.command({ ping: 1 });
      console.log("MongoDB connected!");
      return;
    } catch (error) {
      console.error(error);
      if (attempt === maxAttempts) {
        throw new Error("DB is not connected", { cause: error });
      }

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

export async function isDBHealthy(): Promise<boolean> {
  try {
    if (!db) return false;
    await db.command({ ping: 1 });
    return true;
  } catch {
    return false;
  }
}
export async function closeDB(): Promise<void> {
  await client.close();
  db = null;
}
