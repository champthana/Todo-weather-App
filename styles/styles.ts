import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    paddingHorizontal: 22,
    paddingTop: 58,
  },

  titleContainer: {
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    paddingBottom: 24,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },

  modal: {
    height: "60%",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
  },

  detailsInput: {
    height: 100,
    paddingTop: 15,
    textAlignVertical: "top",
  },

  addButton: {
    height: 50,
    backgroundColor: "#000",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  editButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  editButtonText: {
    color: "#6366F1",
    fontWeight: "600",
  },

  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  deleteButtonText: {
    color: "#DC2626",
    fontWeight: "600",
  },
  countBadge: {
    minWidth: 64,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    alignItems: "center",
    backgroundColor: "#E8E5FF",
  },
  countLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6D65C7",
    marginTop: 1,
  },
  greeting: {
    fontSize: 11,
    letterSpacing: 1.4,
    fontWeight: "700",
    color: "#8A84B8",
  },

  weatherLoading: {
    width: "100%",
    color: "#7C8195",
    fontSize: 13,
    marginBottom: 18,
    textAlign: "center",
  },

  weatherErrorCard: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    marginBottom: 22,
    backgroundColor: "#FFF1F2",
    borderWidth: 1,
    borderColor: "#FECDD3",
  },

  weatherErrorTitle: {
    color: "#9F1239",
    fontSize: 15,
    fontWeight: "700",
  },

  weatherErrorText: {
    color: "#BE123C",
    fontSize: 13,
    marginTop: 5,
  },

  reloadButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#9F1239",
  },

  reloadButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  weatherPressable: {
    flex: 1,
    minWidth: 0,
    borderRadius: 18,
    overflow: "hidden",
  },

  weatherPressablePressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
  weatherContainer: {
    width: "100%",
    borderRadius: 18,
    minHeight: 100,
    marginBottom: 22,
  },

  row: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    backgroundColor: "#fff",
  },

  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },

  cell: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  weatherCard: {
    minHeight: 100,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#202338",
    shadowColor: "#202338",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },

  weatherHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  weatherLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  weatherCity: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  weatherTime: {
    color: "#B9BDD2",
    fontSize: 12,
  },

  weatherTemperature: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
  },

  weatherMainRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },

  weatherStats: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
    flex: 1,
  },

  weatherStat: {
    color: "#D9DCEE",
    fontSize: 11,
    fontWeight: "600",
    flexShrink: 1,
  },

  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#202338",
    marginTop: 2,
  },

  count: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6366F1",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1E293B",
    marginVertical: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    marginBottom: 12,
  },
  sectionCount: {
    minWidth: 24,
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    color: "#6D65C7",
    backgroundColor: "#E8E5FF",
    fontSize: 12,
    fontWeight: "700",
  },

  // Add Task Button
  addTaskButton: {
    height: 52,
    backgroundColor: "#6366F1",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  addTaskIcon: {
    color: "#FFFFFF",
    fontSize: 24,
    marginRight: 8,
  },

  addTaskText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#EDEEF5",
    borderRadius: 14,
    padding: 4,
    marginBottom: 6,
    gap: 4,
  },

  filterButton: {
    flex: 1,
    minHeight: 38,
    paddingHorizontal: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#252342",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },

  filterText: {
    color: "#777C91",
    fontSize: 12,
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#5E57B8",
  },

  // List
  list: {
    paddingBottom: 30,
  },

  todoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E8EAF2",
    shadowColor: "#252342",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },

  overdueTodoCard: {
    backgroundColor: "#FFF1F2",
    borderColor: "#FDA4AF",
  },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  checkboxCompleted: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },

  check: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  todoContent: {
    flex: 1,
  },

  todoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  todoDetails: {
    fontSize: 13,
    color: "#7C8195",
    marginTop: 4,
  },
  todoActions: {
    alignItems: "flex-end",
    gap: 8,
    marginLeft: 8,
  },

  completedText: {
    textDecorationLine: "line-through",
    color: "#94A3B8",
  },

  todoDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 5,
  },

  overdueTodoDate: {
    color: "#E11D48",
    fontWeight: "600",
  },

  more: {
    fontSize: 22,
    color: "#64748B",
    paddingLeft: 10,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },

  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  closeButton: {
    fontSize: 20,
    color: "#64748B",
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 8,
  },

  taskInput: {
    height: 52,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1E293B",
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: "row",
    gap: 12,
  },

  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#6366F1",
    alignItems: "center",
    justifyContent: "center",
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
