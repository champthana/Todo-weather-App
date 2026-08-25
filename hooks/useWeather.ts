import { getCachedWeather, saveWeatherCache } from "@/database/todos";
import { fetchWeatherFromApi } from "@/services/weatherApi";
import { useCallback, useEffect, useState } from "react";

const CACHE_MAX_AGE = 10 * 60 * 1000;

type WeatherState = Record<string, any> | null;

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherState>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

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

      const freshWeather = await fetchWeatherFromApi();
      await saveWeatherCache(freshWeather);
      setWeather(freshWeather);
    } catch (caughtError) {
      console.error("Weather error:", caughtError);

      if (cachedWeather) {
        setWeather(cachedWeather.data);
      } else {
        setError(
          caughtError instanceof Error
            ? caughtError
            : new Error("Weather unavailable"),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { weather, isLoading, error, reload };
};
