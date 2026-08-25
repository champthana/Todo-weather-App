import * as SQLite from "expo-sqlite";

export type Todo = {
  id: string;
  details: string;
  title: string;
  completed: boolean;
  date: string;
};

type TodoRow = {
  id: string;
  details: string;
  title: string;
  completed: number;
  date: string;
};

type WeatherCacheRow = {
  data: string;
  fetched_at: number;
};

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

const getDatabase = async () => {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync("todos.db");
  }

  const database = await databasePromise;
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY NOT NULL,
      title TEXT NOT NULL,
      details TEXT NOT NULL DEFAULT '',
      completed INTEGER NOT NULL DEFAULT 0,
      date TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS weather_cache (
      id INTEGER PRIMARY KEY NOT NULL,
      data TEXT NOT NULL,
      fetched_at INTEGER NOT NULL
    );
  `);

  const result = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) AS count FROM todos",
  );

  if (!result?.count) {
    const sampleTodos = [
      ["1", "Learn React Native", "Learn React Native", 0],
      ["2", "Build Todo App", "Build Todo App", 1],
      ["3", "Practice TypeScript", "Practice TypeScript", 0],
    ];

    for (const [id, title, details, completed] of sampleTodos) {
      await database.runAsync(
        "INSERT INTO todos (id, title, details, completed, date) VALUES (?, ?, ?, ?, ?)",
        id,
        title,
        details,
        completed,
        new Date().toISOString(),
      );
    }
  }

  return database;
};

export const getTodos = async (): Promise<Todo[]> => {
  const database = await getDatabase();
  const rows = await database.getAllAsync<TodoRow>(
    "SELECT id, title, details, completed, date FROM todos ORDER BY date ASC",
  );

  return rows.map((row) => ({
    ...row,
    completed: Boolean(row.completed),
  }));
};

export const insertTodo = async (todo: Todo) => {
  const database = await getDatabase();
  await database.runAsync(
    "INSERT INTO todos (id, title, details, completed, date) VALUES (?, ?, ?, ?, ?)",
    todo.id,
    todo.title,
    todo.details,
    todo.completed ? 1 : 0,
    todo.date,
  );
};

export const updateTodo = async (todo: Todo) => {
  const database = await getDatabase();
  await database.runAsync(
    "UPDATE todos SET title = ?, details = ?, completed = ?, date = ? WHERE id = ?",
    todo.title,
    todo.details,
    todo.completed ? 1 : 0,
    todo.date,
    todo.id,
  );
};

export const removeTodo = async (todoId: string) => {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM todos WHERE id = ?", todoId);
};

export const getCachedWeather = async () => {
  const database = await getDatabase();
  const row = await database.getFirstAsync<WeatherCacheRow>(
    "SELECT data, fetched_at FROM weather_cache WHERE id = 1",
  );

  if (!row) return null;

  return {
    data: JSON.parse(row.data) as Record<string, any>,
    fetchedAt: row.fetched_at,
  };
};

export const saveWeatherCache = async (data: Record<string, any>) => {
  const database = await getDatabase();
  await database.runAsync(
    "INSERT OR REPLACE INTO weather_cache (id, data, fetched_at) VALUES (1, ?, ?)",
    JSON.stringify(data),
    Date.now(),
  );
};
