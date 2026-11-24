import "dotenv/config";
import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";
import {
  dataBaseConnect,
  isDBHealthy,
  closeDB,
} from "./config/database.js";
const PORT = Number(process.env.PORT) || 3000;
const app = express();

app.use(helmet());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
app.get("/", (_req, res) => {
  res.status(200).json({
    name: "Todo REST API",
    version: "1.0.0",
    links: {
      todos: "/api/todos",
      health: "/api/health",
    },
  });
});
app.get("/health", async (_req, res) => {
  const isDBhealthy = await isDBHealthy();
  if (!isDBhealthy) {
    res.status(503).json({ status: "error", dataBase: "disconnected" });
    return;
  }
  res.status(200).json({ status: true, dataBase: "connected" });
});

app.use(notFoundHandler);
app.use(errorHandler);
async function shutdown(signal: string) {
  console.log(`${signal} received, shutting down...`);
  await closeDB();
  process.exit(0);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
async function start() {
  try {
    await dataBaseConnect();
    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
