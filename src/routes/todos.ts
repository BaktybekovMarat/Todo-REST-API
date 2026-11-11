// todos.ts:
// GET / → validate query → getAllTodos.
// GET /stats → getTodoStats.
// GET /:id → validate id → getTodoById.
// POST / → validate create → createTodo.
// PUT /:id → validate id + update → updateTodo.
// PATCH /:id → validate id + update → patchTodo.
// DELETE /:id → validate id → deleteTodo.
// index.ts:
// Mount /todos routes under /api/todos.
// Add /health endpoint with basic status JSON.
import {
  createTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  getTodoStats,
  patchTodo,
  updateTodo,
} from "@/controllers/todoController.js";
import {
  validateCreateTodo,
  validateTodoId,
  validateTodoQuery,
  validateUpdateTodo,
} from "@/middleware/validation.js";
import { validateAndHandle } from "@/middleware/validation.js";
import { Router } from "express";
const router = Router();

router.get("/", ...validateAndHandle([validateTodoQuery]), getAllTodos);
router.get("/stats", getTodoStats);
router.get("/:id", ...validateAndHandle([validateTodoId]), getTodoById);
router.post("/", ...validateAndHandle([validateCreateTodo]), createTodo);
router.put(
  "/:id",
  ...validateAndHandle([validateTodoId, validateUpdateTodo]),
  updateTodo,
);
router.patch(
  "/:id",
  ...validateAndHandle([validateTodoId, validateUpdateTodo]),
  patchTodo,
);
router.delete("/:id", ...validateAndHandle([validateTodoId]), deleteTodo);

export default router;
