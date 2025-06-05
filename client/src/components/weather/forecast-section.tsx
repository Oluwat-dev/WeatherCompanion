import { WeatherForecastDay } from "@shared/schema";
import { getWeatherIcon } from "@/lib/weather-icons";
import { Calendar } from "lucide-react";

interface ForecastSectionProps {
  forecast: WeatherForecastDay[];
  isLoading?: boolean;
}

export default function ForecastSection({ forecast, isLoading }: ForecastSectionProps) {
  if (isLoading) {
    return (
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Calendar className="mr-2" size={20} />
          5-Day Forecast
        </h2>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white/10 glass-effect rounded-xl p-4 animate-pulse">
              <div className="h-12 bg-white/20 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-4 flex items-center">
        <Calendar className="mr-2" size={20} />
        5-Day Forecast
      </h2>
      
      <div className="space-y-3">
        {forecast.map((day, index) => {
          const WeatherIcon = getWeatherIcon(day.icon);
          
          return (
            <div key={index} className="bg-white/10 glass-effect rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <WeatherIcon className="text-lg" />
                </div>
                <div>
                  <div className="font-medium">{day.name}</div>
                  <div className="text-white/60 text-sm capitalize">{day.description}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-lg">{day.high}°</div>
                <div className="text-white/60 text-sm">{day.low}°</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
