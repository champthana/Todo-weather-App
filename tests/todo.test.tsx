import { act, renderHook, waitFor } from "@testing-library/react-native";

import { getTodos, insertTodo, removeTodo, updateTodo } from "@/database/todos";

import { useTodos } from "@/hooks/useTodos";

jest.mock("@/database/todos", () => ({
  getTodos: jest.fn(),
  insertTodo: jest.fn(),
  removeTodo: jest.fn(),
  updateTodo: jest.fn(),
}));

const mockedGetTodos = jest.mocked(getTodos);
const mockedInsertTodo = jest.mocked(insertTodo);
const mockedRemoveTodo = jest.mocked(removeTodo);
const mockedUpdateTodo = jest.mocked(updateTodo);

const existingTodos = [
  {
    id: "1",
    title: "First task",
    details: "First details",
    completed: false,
    date: "2026-08-25T09:00:00.000Z",
  },
  {
    id: "2",
    title: "Second task",
    details: "Second details",
    completed: true,
    date: "2026-08-26T09:00:00.000Z",
  },
];

describe("useTodos", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTodos.mockResolvedValue([]);
    mockedInsertTodo.mockResolvedValue(undefined);
  });

  it("should add todo", async () => {
    const date = new Date("2026-08-27T09:00:00.000Z");
    jest.spyOn(Date, "now").mockReturnValue(123456789);
    const { result } = await renderHook(() => useTodos());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.addTodo("Learn Jest", "Learn Unit Test", date);
    });

    expect(mockedInsertTodo).toHaveBeenCalledWith({
      id: "123456789",
      title: "Learn Jest",
      details: "Learn Unit Test",
      completed: false,
      date: date.toISOString(),
    });
    expect(result.current.todos).toContainEqual({
      id: "123456789",
      title: "Learn Jest",
      details: "Learn Unit Test",
      completed: false,
      date: date.toISOString(),
    });

    jest.restoreAllMocks();
  });

  it("should remove todo", async () => {
    mockedGetTodos.mockResolvedValue(existingTodos);
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.todos).toEqual(existingTodos));

    await act(async () => {
      await result.current.deleteTodo("1");
    });

    expect(mockedRemoveTodo).toHaveBeenCalledWith("1");
    expect(result.current.todos).toEqual([existingTodos[1]]);
  });

  it("should update todo", async () => {
    mockedGetTodos.mockResolvedValue(existingTodos);
    const date = new Date("2026-08-29T09:00:00.000Z");
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.todos).toEqual(existingTodos));

    await act(async () => {
      await result.current.editTodo(
        "1",
        "Updated task",
        "Updated details",
        date,
      );
    });

    expect(mockedUpdateTodo).toHaveBeenCalledWith({
      ...existingTodos[0],
      title: "Updated task",
      details: "Updated details",
      date: date.toISOString(),
    });
    expect(result.current.todos[0]).toEqual({
      ...existingTodos[0],
      title: "Updated task",
      details: "Updated details",
      date: date.toISOString(),
    });
  });

  it("should toggle todo completion", async () => {
    mockedGetTodos.mockResolvedValue(existingTodos);
    const { result } = await renderHook(() => useTodos());

    await waitFor(() => expect(result.current.todos).toEqual(existingTodos));

    await act(async () => {
      await result.current.toggleTodo(existingTodos[0]);
    });

    expect(mockedUpdateTodo).toHaveBeenCalledWith({
      ...existingTodos[0],
      completed: true,
    });
    expect(result.current.todos).toEqual([
      { ...existingTodos[0], completed: true },
      existingTodos[1],
    ]);
  });
});
