import { useState, useCallback } from "react";
import { WeatherData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

interface LocationResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const getWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest("GET", `/api/weather/current?lat=${lat}&lon=${lon}`);
      const weatherData = await response.json();
      setWeather(weatherData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch weather data";
      setError(errorMessage);
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchLocations = useCallback(async (query: string): Promise<LocationResult[]> => {
    setIsSearching(true);
    
    try {
      const response = await apiRequest("GET", `/api/weather/search?q=${encodeURIComponent(query)}`);
      const locations = await response.json();
      return locations;
    } catch (err) {
      console.error("Location search error:", err);
      return [];
    } finally {
      setIsSearching(false);
    }
  }, []);

  return {
    weather,
    isLoading,
    error,
    isSearching,
    getWeatherByCoords,
    searchLocations,
  };
}
