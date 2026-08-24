import type { Todo } from "@/database/todos";
import { useTodos } from "@/hooks/useTodos";
import { styles } from "@/styles/styles";
import { getTodoGroups, isOverdue, type TodoFilter } from "@/utils/todoFilters";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
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
      <View style={styles.header}>
        <View>
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
