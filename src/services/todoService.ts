import {
  Todo,
  CreateTodoInput,
  UpdateTodoInput,
  PaginationQuery,
} from "../types/todo.types.js";

let todos: Todo[] = [];
let nextId = 1;

export function getTodos(query: PaginationQuery): {
  todos: Todo[];
  meta: { total: number; page: number; limit: number };
} {
  let filteredTodos = [...todos];

  if (query.completed) {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed === (query.completed === "true"),
    );
  }
  if (query.priority !== undefined && typeof query.priority === "string") {
    filteredTodos = filteredTodos.filter(
      (todo) => todo.priority === query.priority,
    );
  }
  if (typeof query.search === "string" && query.search?.trim() !== "") {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.text.toLowerCase().includes(query.search!.toLowerCase()),
    );
  }

  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const total = filteredTodos.length;

  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    todos: filteredTodos.slice(start, end),
    meta: { total, page, limit },
  };
}

export function getTodoById(id: number): Todo | null {
  return todos.find((todo) => todo.id === id) || null;
}

export function createTodo(input: CreateTodoInput): Todo {
  const newTodo: Todo = {
    id: nextId,
    text: input.text.trim(),
    completed: false,
    priority: input.priority || "medium",
    createdAt: new Date(),
  };
  todos.push(newTodo);
  nextId++;
  return newTodo;
}

export function updateTodo(id: number, input: UpdateTodoInput): Todo | null {
  const todo = todos.find((t) => t.id === id);
  if (!todo) {
    return null;
  }
  return Object.assign(todo, {
    text: input.text?.trim() ?? todo.text,
    completed: input.completed ?? todo.completed,
    priority: input.priority ?? todo.priority,
    updatedAt: new Date(),
  });
}

export function deleteTodo(id: number): boolean {
  const index = todos.findIndex((todo) => todo.id === id);
  if (index === -1) {
    return false;
  }
  todos.splice(index, 1);
  return true;
}

export function getStats(): {
  total: number;
  completed: number;
  pending: number;
  byPriority: { [key: string]: number };
} {
  const initialCounts: Record<Todo["priority"], number> = {
    low: 0,
    medium: 0,
    high: 0,
  };
  const completed = todos.filter((todo) => todo.completed).length;
  const pending = todos.length - completed;
  const byPriority = todos.reduce((acc, todo) => {
    acc[todo.priority] = (acc[todo.priority] || 0) + 1;
    return acc;
  }, initialCounts);
  return {
    total: todos.length,
    completed,
    pending,
    byPriority,
  };
}
