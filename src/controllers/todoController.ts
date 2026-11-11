import { Request, Response, NextFunction } from "express";
import * as todos from "../services/todoService.js";
import { Todo, ApiResponse } from "@/types/todo.types.js";

export function getAllTodos(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const query = req.query;
    const queryResult = todos.getTodos(query);

    const response: ApiResponse<Todo[]> = {
      success: true,
      data: queryResult.todos,
      meta: queryResult.meta,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
}

export function getTodoById(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const id = req.params.id;
    const todo = todos.getTodoById(Number(id));
    if (!todo) {
      res
        .status(404)
        .json({ success: false, error: `Todo with id '${id}' not found` });
      return;
    }
    res.json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
}
export function createTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const input = req.body;
    const newTodo = todos.createTodo(input);
    const createdTodo: ApiResponse<Todo> = { success: true, data: newTodo };
    res.status(201).json(createdTodo);
  } catch (error) {
    next(error);
  }
}
export function updateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const id = Number(req.params.id);
    const input = req.body;
    const updated = todos.updateTodo(id, input);
    if (!updated) {
      res
        .status(404)
        .json({ success: false, error: `Todo with id ${id} not found` });
      return;
    }
    const updatedTodo: ApiResponse<Todo> = {
      success: true,
      data: updated,
    };
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
}
export function patchTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const id = Number(req.params.id);
    const input = req.body;

    const hasFields = ["text", "completed", "priority"].some(
      (key) => key in input,
    );
    if (!hasFields) {
      res.status(400).json({
        success: false,
        error:
          "At least one field (text, completed, priority) must be provided",
      });
      return;
    }
    const updated = todos.updateTodo(id, input);
    if (!updated) {
      res
        .status(404)
        .json({ success: false, error: `Todo with id ${id} not found` });
      return;
    }
    const updatedTodo: ApiResponse<Todo> = {
      success: true,
      data: updated,
    };
    res.json(updatedTodo);
  } catch (error) {
    next(error);
  }
}

export function deleteTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const id = Number(req.params.id);
    const deleted = todos.deleteTodo(id);
    if (!deleted) {
      res
        .status(404)
        .json({ success: false, error: `Todo with id ${id} not found` });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
export function getTodoStats(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const todoStats = todos.getStats();
    res.json({ success: true, data: todoStats });
  } catch (error) {
    next(error);
  }
}
