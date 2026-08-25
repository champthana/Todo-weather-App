import { getCachedWeather, saveWeatherCache } from "@/database/todos";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const CACHE_MAX_AGE = 10 * 60 * 1000;

const getWeatherFromApi = async () => {
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

  return response.json() as Promise<Record<string, any>>;
};

export default function WeatherScreen() {
  const [weather, setWeather] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWeather = async () => {
      let cachedWeather = null;

      try {
        cachedWeather = await getCachedWeather();
        const cacheAge = cachedWeather
          ? Date.now() - cachedWeather.fetchedAt
          : Infinity;

        if (cachedWeather && cacheAge <= CACHE_MAX_AGE) {
          setWeather(cachedWeather.data);
          return;
        }

        const freshWeather = await getWeatherFromApi();
        await saveWeatherCache(freshWeather);
        setWeather(freshWeather);
      } catch (error) {
        console.error("Weather error:", error);

        if (cachedWeather) {
          setWeather(cachedWeather.data);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Weather unavailable</Text>
        <Text style={styles.errorText}>Please try again later.</Text>
      </View>
    );
  }
  const hourly = weather.hourly;
  const formattedData = hourly.time.map((time: string, index: number) => ({
    time,
    temperature: hourly.temperature_2m[index],
    rain: hourly.rain[index],
    rainChance: hourly.precipitation_probability[index],
  }));
  const today = String(weather.current?.time ?? "").split("T")[0];
  const todayHourlyData = formattedData.filter((item: { time: string }) =>
    item.time.startsWith(`${today}T`),
  );
  const daily = weather.daily;
  const dailyData = daily.time.map((date: string, index: number) => ({
    date,
    maxTemperature: daily.temperature_2m_max[index],
    minTemperature: daily.temperature_2m_min[index],
    uvIndex: daily.uv_index_max[index],
    rainChance: daily.precipitation_probability_max[index],
  }));

  return (
    <View style={styles.weatherList}>
      <View style={styles.weatherHero}>
        <Text style={styles.eyebrow}>CURRENT WEATHER</Text>
        <Text style={styles.location}>Bangkok</Text>
        <Text style={styles.temperature}>
          {Math.round(weather.current?.temperature_2m ?? 0)}°C
        </Text>
      </View>
      <View style={styles.sectionHeading}>
        <Text style={styles.sectionTitle}>Hourly</Text>
        <Text style={styles.sectionMeta}>{today}</Text>
      </View>
      <View style={styles.tableSurface}>
        <View style={styles.header}>
          <Text style={styles.headerCell}>TIME</Text>
          <Text style={styles.headerCell}>TEMP</Text>
          <Text style={styles.headerCell}>RAIN</Text>
          <Text style={styles.headerCell}>CHANCE</Text>
        </View>
        <FlatList
          style={styles.hourlyTable}
          data={todayHourlyData}
          keyExtractor={(item) => item.time}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={styles.cell}>{item.time.split("T")[1]}</Text>
              <Text style={styles.cell}>{item.temperature.toFixed(1)}°C</Text>
              <Text style={styles.cell}>{item.rain.toFixed(1)} mm</Text>
              <Text style={styles.cell}>{item.rainChance}%</Text>
            </View>
          )}
        />
      </View>
      <Text style={styles.dailyTitle}>Daily forecast</Text>
      <FlatList
        data={dailyData}
        horizontal
        style={styles.dailyForecastCarousel}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.dailyForecastList}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.dailyCard}>
            <Text style={styles.dailyDate}>
              {new Date(`${item.date}T12:00:00`).toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Text style={styles.dailyTemperature}>
              {item.maxTemperature.toFixed(1)}°C
            </Text>
            <Text style={styles.dailyLow}>
              Low {item.minTemperature.toFixed(1)}°C
            </Text>
            <Text style={styles.dailyDetail}>UV index: {item.uvIndex}</Text>
            <Text style={styles.dailyDetail}>
              Rain chance: {item.rainChance}%
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  container: {
    backgroundColor: "#202338",
    padding: 24,
    paddingTop: 64,
    paddingBottom: 40,
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
  hourlyCard: {
    marginTop: 4,
    marginBottom: 12,
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#2A2D49",
  },
  hourlyPage: {
    width: "100%",
    paddingHorizontal: 24,
  },
  hourlyCardTime: {
    color: "#B9BDD2",
    fontSize: 15,
    fontWeight: "600",
  },
  hourlyCardTemperature: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "700",
    marginTop: 8,
  },
  hourlyCardRain: {
    color: "#D9DCEE",
    fontSize: 14,
    marginTop: 6,
  },
  updatedText: {
    color: "#B9BDD2",
    fontSize: 14,
    marginTop: 4,
  },
  currentPrecipitation: {
    color: "#D9DCEE",
    fontSize: 14,
    marginTop: 8,
  },
  apiSummary: {
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#2A2D49",
  },
  apiSummaryTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  apiSummaryGrid: {
    gap: 6,
  },
  apiSummaryItem: {
    color: "#B9BDD2",
    fontSize: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
  },
  forecastPage: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  forecastList: {
    paddingBottom: 24,
  },
  dailyList: {
    gap: 12,
    paddingBottom: 24,
  },
  hourlyContainer: {
    width: "100%",
    overflow: "hidden",
    borderRadius: 16,
  },
  hourlyList: {
    paddingBottom: 12,
    flexGrow: 0,
  },
  hourlyListVertical: {
    gap: 12,
    paddingBottom: 24,
  },
  hourlyWeatherCard: {
    flexShrink: 0,
    minHeight: 92,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    backgroundColor: "#2A2D49",
    borderRadius: 16,
    padding: 16,
  },
  hourlyTime: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
  },
  hourlyTemperature: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  hourlyRain: {
    color: "#B9BDD2",
    flex: 1,
    fontSize: 13,
    textAlign: "right",
  },
  sliderDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
  },
  sliderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#676B8A",
  },
  sliderDotActive: {
    width: 18,
    backgroundColor: "#FFFFFF",
  },
  valueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#3A3D58",
  },
  valueLabel: {
    flex: 1,
    color: "#B9BDD2",
    fontSize: 13,
  },
  valueText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  forecastCard: {
    backgroundColor: "#2A2D49",
    borderRadius: 14,
    marginBottom: 10,
    padding: 16,
  },
  forecastDate: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
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
