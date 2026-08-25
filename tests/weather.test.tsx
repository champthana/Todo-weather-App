import { act, render, waitFor } from "@testing-library/react-native";

import WeatherScreen from "@/app/weather";
import { getCachedWeather, saveWeatherCache } from "@/database/todos";

jest.mock("@/database/todos", () => ({
  getCachedWeather: jest.fn(),
  saveWeatherCache: jest.fn(),
}));

const mockedGetCachedWeather = jest.mocked(getCachedWeather);
const mockedSaveWeatherCache = jest.mocked(saveWeatherCache);

const weatherData = {
  current: {
    time: "2026-08-25T09:00",
    temperature_2m: 31.4,
  },
  hourly: {
    time: ["2026-08-25T09:00", "2026-08-25T10:00", "2026-08-26T09:00"],
    temperature_2m: [31.4, 32.1, 30.2],
    rain: [0, 0.2, 1.5],
    precipitation_probability: [10, 20, 60],
  },
  daily: {
    time: ["2026-08-25", "2026-08-26"],
    temperature_2m_max: [33.5, 32.8],
    temperature_2m_min: [26.1, 25.8],
    uv_index_max: [8.2, 7.5],
    precipitation_probability_max: [20, 60],
  },
};

describe("WeatherScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetCachedWeather.mockResolvedValue(null);
    mockedSaveWeatherCache.mockResolvedValue(undefined);
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(weatherData),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("shows loading state while weather is being fetched", async () => {
    let resolveFetch: (value: Response) => void = () => undefined;
    global.fetch = jest.fn().mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      }),
    );

    const screen = await render(<WeatherScreen />);

    expect(screen.getByText("Loading weather...")).toBeTruthy();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: jest.fn().mockResolvedValue(weatherData),
      } as unknown as Response);
      await Promise.resolve();
      await Promise.resolve();
    });

    await waitFor(() =>
      expect(screen.getByText("CURRENT WEATHER")).toBeTruthy(),
    );
    screen.unmount();
  });

  it("uses cached weather data age < 10 minutes without calling the API", async () => {
    mockedGetCachedWeather.mockResolvedValue({
      data: weatherData,
      fetchedAt: Date.now(),
    });

    const screen = await render(<WeatherScreen />);

    await waitFor(() =>
      expect(screen.getByText("CURRENT WEATHER")).toBeTruthy(),
    );

    expect(screen.getByText("31°C")).toBeTruthy();
    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockedSaveWeatherCache).not.toHaveBeenCalled();
  });

  it("fetches fresh weather when cached data is older than 10 minutes", async () => {
    mockedGetCachedWeather.mockResolvedValue({
      data: weatherData,
      fetchedAt: Date.now() - 11 * 60 * 1000,
    });

    const screen = await render(<WeatherScreen />);

    await waitFor(() =>
      expect(screen.getByText("CURRENT WEATHER")).toBeTruthy(),
    );

    expect(screen.getByText("31°C")).toBeTruthy();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(mockedSaveWeatherCache).toHaveBeenCalledWith(weatherData);
  });
});
