import { StyleSheet } from "react-native";

export const weatherStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingVertical: 10,
    backgroundColor: "#26344D",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E6ECF2",
    backgroundColor: "#F8FAFC",
  },
  headerCell: {
    flex: 1,
    color: "#BFD0E2",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  cell: {
    flex: 1,
    color: "#26344D",
    textAlign: "center",
    fontSize: 12,
  },
  hourlyTable: {
    flexGrow: 0,
    maxHeight: 240,
  },
  tableSurface: {
    marginHorizontal: 24,
    overflow: "hidden",
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
  },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 10,
  },
  sectionMeta: {
    color: "#8EA5BA",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  dailyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginHorizontal: 24,
    marginTop: 18,
    marginBottom: 10,
  },
  dailyForecastList: {
    gap: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  dailyForecastCarousel: {
    flexGrow: 0,
    height: 164,
  },
  dailyCard: {
    width: 164,
    minWidth: 0,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#26344D",
  },
  dailyDate: {
    color: "#BFD0E2",
    flexShrink: 1,
    fontWeight: "700",
    fontSize: 12,
  },
  dailyTemperature: {
    color: "#FFCF70",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 10,
  },
  dailyLow: {
    color: "#F4F7FA",
    fontSize: 10,
    marginTop: 3,
  },
  dailyDetail: {
    color: "#B9BDD2",
    fontSize: 10,
    flexShrink: 1,
    marginTop: 8,
  },
  weatherList: {
    flex: 1,
    backgroundColor: "#202338",
  },
  weatherHero: {
    padding: 24,
    paddingTop: 64,
    paddingBottom: 26,
    backgroundColor: "#26344D",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#202338",
    padding: 24,
  },
  location: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "700",
  },
  eyebrow: {
    color: "#8FD3C7",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  temperature: {
    color: "#FFCF70",
    fontSize: 40,
    fontWeight: "300",
    marginTop: 12,
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 12,
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  errorText: {
    color: "#B9BDD2",
    marginTop: 8,
  },
});
