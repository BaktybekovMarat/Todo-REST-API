interface Todo {
  id: number;
  text: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt?: Date;
}

interface CreateTodoInput {
  text: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
}

interface UpdateTodoInput {
  text?: string;
  completed?: boolean;
  priority?: "low" | "medium" | "high";
}

type ApiResponse<T> =
  | {
      success: true;
      data?: T;
      meta?: unknown;
    }
  | {
      success: false;
      error?: string;
      message?: string;
      meta?: unknown;
    };

interface PaginationQuery {
  page?: string;
  limit?: string;
  completed?: string;
  priority?: string;
  search?: string;
}
interface HttpError extends Error {
  statusCode: number;
}
interface ValidationDetail {
  field: string;
  message: string;
  value: unknown;
}
export type {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  ApiResponse,
  PaginationQuery,
  HttpError,
  ValidationDetail,
};
