import type { Todo } from "@/database/todos";
import { getCachedWeather, saveWeatherCache } from "@/database/todos";
import { useTodos } from "@/hooks/useTodos";
import { styles } from "@/styles/styles";
import { getTodoGroups, isOverdue, type TodoFilter } from "@/utils/todoFilters";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function HomeScreen() {
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      const cachedWeather = await getCachedWeather();
      const cacheAge = cachedWeather
        ? Date.now() - cachedWeather.fetchedAt
        : Infinity;

      if (cachedWeather && cacheAge <= 10 * 60 * 1000) {
        setWeather(cachedWeather.data);
        return;
      }

      const params = new URLSearchParams({
        latitude: "13.7563",
        longitude: "100.5018",
        current: "temperature_2m,precipitation",
        hourly: "temperature_2m,rain,precipitation_probability",
        daily:
          "temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_probability_max",
        timezone: "Asia/Bangkok",
      });

      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await response.json();

      await saveWeatherCache(data);
      setWeather(data);
    } catch (error) {
      console.error("Weather error:", error);
    } finally {
      setWeatherLoading(false);
    }
  };
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [date, setDate] = useState(new Date());
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [todoFilter, setTodoFilter] = useState<TodoFilter>("all");
  const {
    todos,
    isLoading,
    addTodo,
    editTodo: updateTodoById,
    deleteTodo: removeTodoById,
    toggleTodo,
  } = useTodos();
  const { today: filteredTodayTodos, later: filteredLaterTodos } =
    getTodoGroups(todos, todoFilter);
  const allTodos = [...filteredTodayTodos, ...filteredLaterTodos];
  const saveTodo = async () => {
    if (editingTodoId) {
      await updateTodoById(editingTodoId, title, details, date);
    } else {
      await addTodo(title, details, date);
    }

    setModalVisible(false);
    setEditingTodoId(null);
    setTitle("");
    setDetails("");
    setDate(new Date());
  };
  const openEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setTitle(todo.title);
    setDetails(todo.details);
    setDate(new Date(todo.date));
    setModalVisible(true);
  };
  const confirmDeleteTodo = (todoId: string) => {
    Alert.alert("Delete Todo", "Are you sure you want to delete this todo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await removeTodoById(todoId);
        },
      },
    ]);
  };
  const renderTodo = ({ item }: { item: Todo }) => {
    const overdue = isOverdue(item);

    return (
      <View style={[styles.todoCard, overdue && styles.overdueTodoCard]}>
        <Pressable
          style={[styles.checkbox, item.completed && styles.checkboxCompleted]}
          onPress={() => toggleTodo(item)}
        >
          {item.completed && <Text style={styles.check}>✓</Text>}
        </Pressable>

        <View style={styles.todoContent}>
          <Text
            style={[styles.todoTitle, item.completed && styles.completedText]}
          >
            {item.title}
          </Text>
          {!!item.details && (
            <Text style={styles.todoDetails}>{item.details}</Text>
          )}
          <Text style={[styles.todoDate, overdue && styles.overdueTodoDate]}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.todoActions}>
          <Pressable onPress={() => openEditTodo(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </Pressable>
          <Pressable onPress={() => confirmDeleteTodo(item.id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {weatherLoading ? (
        <Text style={styles.weatherLoading}>Loading weather...</Text>
      ) : weather ? (
        <View style={styles.weatherContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.weatherPressable,
              pressed && styles.weatherPressablePressed,
            ]}
            onPress={() => router.push("/weather")}
          >
            <View style={styles.weatherCard}>
              <View style={styles.weatherHeader}>
                <View style={styles.weatherLocation}>
                  <Ionicons
                    name={
                      new Date(weather.current.time).getHours() >= 6 &&
                      new Date(weather.current.time).getHours() < 18
                        ? "sunny"
                        : "moon"
                    }
                    size={22}
                    color="#FFD166"
                  />
                  <Text style={styles.weatherCity}>Bangkok</Text>
                </View>
              </View>
              <View style={styles.weatherMainRow}>
                <Text style={styles.weatherTemperature}>
                  {Math.round(weather.current.temperature_2m)}°
                </Text>
                <View style={styles.weatherStats}>
                  <Text style={styles.weatherStat}>
                    H {Math.round(weather.daily.temperature_2m_max[0])}°
                  </Text>
                  <Text style={styles.weatherStat}>
                    L {Math.round(weather.daily.temperature_2m_min[0])}°
                  </Text>
                  <Text style={styles.weatherStat}>
                    UV {weather.daily.uv_index_max[0]}
                  </Text>
                  <Text style={styles.weatherStat}>
                    Rain {weather.daily.precipitation_probability_max[0]}%
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      ) : null}

      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.greeting}>YOUR DAILY PLANNER</Text>
          <Text style={styles.title}>My tasks</Text>
        </View>
      </View>

      <Pressable
        style={styles.addTaskButton}
        onPress={() => {
          setEditingTodoId(null);
          setTitle("");
          setDetails("");
          setDate(new Date());
          setModalVisible(true);
        }}
      >
        <Text style={styles.addTaskIcon}>+</Text>
        <Text style={styles.addTaskText}>Add new task</Text>
      </Pressable>
      <View style={styles.filterContainer}>
        {[
          ["all", "ทั้งหมด"],
          ["pending", "ยังไม่เสร็จ"],
          ["completed", "เสร็จแล้ว"],
        ].map(([value, label]) => (
          <Pressable
            key={value}
            style={[
              styles.filterButton,
              todoFilter === value && styles.filterButtonActive,
            ]}
            onPress={() => setTodoFilter(value as TodoFilter)}
          >
            <Text
              style={[
                styles.filterText,
                todoFilter === value && styles.filterTextActive,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </View>
      <Modal visible={modalVisible} transparent animationType="slide">
        <Pressable
          style={styles.overlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>
              {editingTodoId ? "Edit Todo" : "Add New Todo"}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
            />

            <TextInput
              style={[styles.input, styles.detailsInput]}
              placeholder="Details"
              value={details}
              onChangeText={setDetails}
              multiline
            />

            {/* ปุ่มเลือกวันที่ */}
            <Pressable
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </Pressable>

            {/* Date Picker ใส่ตรงนี้ */}
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);

                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            <Pressable style={styles.addButton} onPress={saveTodo}>
              <Text style={styles.addButtonText}>
                {editingTodoId ? "Save Changes" : "Add Todo"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Today</Text>
        <Text style={styles.sectionCount}>{filteredTodayTodos.length}</Text>
      </View>

      <FlatList
        data={allTodos}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <>
            {index === filteredTodayTodos.length && (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Later</Text>
                <Text style={styles.sectionCount}>
                  {filteredLaterTodos.length}
                </Text>
              </View>
            )}
            {renderTodo({ item })}
          </>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}
