export const fetchWeatherFromApi = async (): Promise<Record<string, any>> => {
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
