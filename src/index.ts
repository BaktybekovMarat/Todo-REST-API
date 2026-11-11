import "dotenv/config";
import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

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
app.use(notFoundHandler);
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server: http://localhost:${PORT}`);
});
