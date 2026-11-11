import { Request, Response, NextFunction, RequestHandler } from "express";
import { ValidationDetail } from "@/types/todo.types.js";
import test from "node:test";
export function validateCreateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const input: unknown = req.body;

  res.locals.details ??= [];
  const details: ValidationDetail[] = res.locals.details;
  if (Array.isArray(input) || typeof input !== "object" || input === null) {
    details.push({
      field: "body",
      message: "Request body must be an object",
      value: input ?? null,
    });

    next();
    return;
  }

  const text = "text" in input ? input.text : undefined;

  if (typeof text !== "string" || text.trim() === "") {
    details.push({
      field: "text",
      message: "Text is required and must be a non-empty string",
      value: text ?? null,
    });
  }

  if (
    "priority" in input &&
    input.priority !== "high" &&
    input.priority !== "medium" &&
    input.priority !== "low"
  ) {
    details.push({
      field: "priority",
      message: "Priority must be 'high', 'medium' or 'low'",
      value: input.priority ?? null,
    });
  }

  next();
}

export function validateUpdateTodo(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const input: unknown = req.body;
  res.locals.details ??= [];
  const details: ValidationDetail[] = res.locals.details;
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    details.push({
      field: "input",
      message: "input must be a non-null object",
      value: input ?? null,
    });
    next();
    return;
  }

  if (
    "text" in input &&
    (typeof input.text !== "string" || input.text.trim() === "")
  ) {
    details.push({
      field: "text",
      message: "Text is required and must be a non-empty string",
      value: input.text ?? null,
    });
  }
  if ("completed" in input && typeof input.completed !== "boolean") {
    details.push({
      field: "completed",
      message: "completed must be a boolean",
      value: input.completed ?? null,
    });
  }
  if (
    "priority" in input &&
    input.priority !== "high" &&
    input.priority !== "medium" &&
    input.priority !== "low"
  ) {
    details.push({
      field: "priority",
      message: "Priority must be 'high', 'medium' or 'low'",
      value: input.priority ?? null,
    });
  }
  next();
}

export function validateTodoId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = Number(req.params.id);
  res.locals.details ??= [];
  const details: ValidationDetail[] = res.locals.details;
  if (!Number.isInteger(id) || id < 1) {
    details.push({
      field: "id",
      message: "Id must be a positive integer",
      value: req.params.id ?? null,
    });
  }
  next();
}
export function validateTodoQuery(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
  const query = req.query;

  res.locals.details ??= [];
  const details: ValidationDetail[] = res.locals.details;
  if ("page" in query) {
    if (!Number.isInteger(page) || page < 1) {
      details.push({
        field: "page",
        message: "Page must be a positive integer",
        value: req.query.page ?? null,
      });
    }
  }
  if ("limit" in query) {
    if (!Number.isInteger(limit) || limit < 1) {
      details.push({
        field: "limit",
        message: "Limit must be a positive integer",
        value: req.query.limit ?? null,
      });
    }
  }
  if (
    "completed" in query &&
    query.completed !== "true" &&
    query.completed !== "false"
  ) {
    details.push({
      field: "completed",
      message: "Completed must be a boolean type:(true or false)",
      value: query.completed ?? null,
    });
  }
  if (
    "priority" in query &&
    query.priority !== "high" &&
    query.priority !== "medium" &&
    query.priority !== "low"
  ) {
    details.push({
      field: "priority",
      message: "Priority must be 'high', 'medium' or 'low'",
      value: query.priority ?? null,
    });
  }

  if ("search" in query) {
    const search = query.search;
    if (typeof search !== "string") {
      details.push({
        field: "search",
        message: "search must be a string",
        value: search,
      });
    } else if (search.trim() === "") {
      details.push({
        field: "search",
        message: "search must not be empty",
        value: search,
      });
    } else if (search.length > 100) {
      details.push({
        field: "search",
        message: "search must be at most 100 characters",
        value: search,
      });
    }
  }
  next();
}
export function handleValidationErrors(
  _req: Request,
  res: Response,
  next: NextFunction,
): void {
  res.locals.details ??= [];
  const details: ValidationDetail[] = res.locals.details;
  if (details.length > 0) {
    res.status(400).json({
      success: false,
      error: "Validation failed",
      details,
    });
    return;
  }
  next();
}

export function validateAndHandle(
  validators: RequestHandler[],
): RequestHandler[] {
  return [...validators, handleValidationErrors];
}
