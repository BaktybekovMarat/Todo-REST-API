import { Request, Response, NextFunction } from "express";
import { HttpError } from "@/types/todo.types.js";

export function errorHandler(
  error: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(error);
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: error.message,
    ...(process.env.NODE_ENV !== "production" && {
      stack: error.stack,
    }),
  });
}
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    error: "Not Found",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
