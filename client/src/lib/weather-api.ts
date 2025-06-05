import { WeatherData } from "@shared/schema";

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "default_key";
const BASE_URL = "https://api.openweathermap.org";

export interface GeolocationCoords {
  lat: number;
  lon: number;
}

export interface LocationSearchResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export async function getCurrentWeather(coords: GeolocationCoords): Promise<WeatherData> {
  const { lat, lon } = coords;
  
  const [weatherResponse, forecastResponse] = await Promise.all([
    fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`),
    fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`)
  ]);

  if (!weatherResponse.ok || !forecastResponse.ok) {
    throw new Error("Failed to fetch weather data");
  }

  const weatherData = await weatherResponse.json();
  const forecastData = await forecastResponse.json();

  // Process forecast data to get daily forecasts
  const dailyForecasts = [];
  const processedDays = new Set();
  
  for (const item of forecastData.list) {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toDateString();
    
    if (!processedDays.has(dayKey) && dailyForecasts.length < 5) {
      processedDays.add(dayKey);
      
      const dayName = dailyForecasts.length === 0 ? "Today" : 
                     dailyForecasts.length === 1 ? "Tomorrow" : 
                     date.toLocaleDateString("en-US", { weekday: "long" });

      dailyForecasts.push({
        date: date.toISOString(),
        name: dayName,
        high: Math.round(item.main.temp_max),
        low: Math.round(item.main.temp_min),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6), // Convert m/s to km/h
      });
    }
  }

  return {
    location: {
      name: weatherData.name,
      country: weatherData.sys.country,
      lat: weatherData.coord.lat,
      lon: weatherData.coord.lon,
    },
    current: {
      temperature: Math.round(weatherData.main.temp),
      condition: weatherData.weather[0].main,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
      visibility: Math.round(weatherData.visibility / 1000), // Convert meters to km
      uvIndex: 0, // UV index would require additional API call
    },
    forecast: dailyForecasts,
  };
}

export async function searchLocations(query: string): Promise<LocationSearchResult[]> {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OPENWEATHER_API_KEY}`
  );

  if (!response.ok) {
    throw new Error("Failed to search locations");
  }

  const locations = await response.json();
  
  return locations.map((location: any) => ({
    name: location.name,
    country: location.country,
    state: location.state,
    lat: location.lat,
    lon: location.lon,
  }));
}
