import { useWeather } from "@/hooks/useWeather";
import { weatherStyles as styles } from "@/styles/weatherStyles";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

export default function WeatherScreen() {
  const { weather, isLoading } = useWeather();

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
