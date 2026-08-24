import {
    getTodos,
    insertTodo,
    removeTodo,
    updateTodo,
    type Todo,
} from "@/database/todos";
import { useEffect, useState } from "react";

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((error) => console.error("Failed to load todos", error))
      .finally(() => setIsLoading(false));
  }, []);

  const addTodo = async (title: string, details: string, date: Date) => {
    const todo: Todo = {
      id: Date.now().toString(),
      title,
      details,
      completed: false,
      date: date.toISOString(),
    };
    await insertTodo(todo);
    setTodos((currentTodos) => [...currentTodos, todo]);
  };

  const editTodo = async (
    todoId: string,
    title: string,
    details: string,
    date: Date,
  ) => {
    const existingTodo = todos.find((todo) => todo.id === todoId);
    if (!existingTodo) return;

    const updatedTodo = {
      ...existingTodo,
      title,
      details,
      date: date.toISOString(),
    };
    await updateTodo(updatedTodo);
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === todoId ? updatedTodo : todo)),
    );
  };

  const deleteTodo = async (todoId: string) => {
    await removeTodo(todoId);
    setTodos((currentTodos) =>
      currentTodos.filter((todo) => todo.id !== todoId),
    );
  };

  const toggleTodo = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    await updateTodo(updatedTodo);
    setTodos((currentTodos) =>
      currentTodos.map((currentTodo) =>
        currentTodo.id === todo.id ? updatedTodo : currentTodo,
      ),
    );
  };

  return {
    todos,
    isLoading,
    addTodo,
    editTodo,
    deleteTodo,
    toggleTodo,
  };
};
