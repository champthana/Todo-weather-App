import type { Todo } from "@/database/todos";

export type TodoFilter = "all" | "pending" | "completed";

const startOfDay = (date: Date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getTodoGroups = (todos: Todo[], filter: TodoFilter) => {
  const today = startOfDay(new Date());
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const matchesFilter = (todo: Todo) =>
    filter === "all" ||
    (filter === "completed" ? todo.completed : !todo.completed);

  if (filter === "completed") {
    return {
      today: todos.filter((todo) => todo.completed),
      later: [] as Todo[],
    };
  }

  const todosForToday = todos.filter((todo) => {
    const todoDate = new Date(todo.date);
    return todoDate >= today && todoDate < tomorrow;
  });
  const overdueTodos = todos.filter((todo) => {
    const todoDate = new Date(todo.date);
    return todoDate < today && !todo.completed;
  });
  const laterTodos = todos.filter((todo) => new Date(todo.date) >= tomorrow);
  const todayTodos = [
    ...todosForToday.filter((todo) => !todo.completed),
    ...todosForToday.filter((todo) => todo.completed),
    ...overdueTodos,
  ];

  return {
    today: todayTodos.filter(matchesFilter),
    later: laterTodos.filter(matchesFilter),
  };
};

export const isOverdue = (todo: Todo) => {
  const today = startOfDay(new Date());
  return new Date(todo.date) < today && !todo.completed;
};
