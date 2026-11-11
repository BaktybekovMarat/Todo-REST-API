import { Router } from "express";
import todosRouter from "../routes/todos.js"; 

const router = Router();

router.use("/todos", todosRouter);

router.get("/health", (_req, res) => {
  res.status(200).json({ success: true });
});

export default router;
