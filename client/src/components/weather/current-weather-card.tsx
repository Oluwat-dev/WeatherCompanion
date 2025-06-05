import { WeatherData } from "@shared/schema";
import { getWeatherIcon } from "@/lib/weather-icons";
import { MapPin, Eye, Droplets, Wind } from "lucide-react";

interface CurrentWeatherCardProps {
  weather: WeatherData;
}

export default function CurrentWeatherCard({ weather }: CurrentWeatherCardProps) {
  const { location, current } = weather;
  const WeatherIcon = getWeatherIcon(current.icon);

  return (
    <div className="px-4 mb-6">
      <div className="bg-white/10 glass-effect rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center mb-4">
          <MapPin className="text-white/70 mr-2" size={16} />
          <span className="text-lg font-medium">
            {location.name}, {location.country}
          </span>
        </div>
        
        {/* Current Weather Icon and Temperature */}
        <div className="mb-6">
          <div className="w-32 h-32 mx-auto mb-4 relative flex items-center justify-center">
            <WeatherIcon className="text-8xl animate-pulse-slow" />
          </div>
          <div className="text-6xl font-light mb-2">{current.temperature}°</div>
          <div className="text-xl text-white/80 mb-2">{current.condition}</div>
          <div className="text-white/60 capitalize">{current.description}</div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <Eye className="text-white/70 mb-2 block mx-auto" size={20} />
            <div className="text-sm text-white/60">Visibility</div>
            <div className="font-semibold">{current.visibility} km</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <Droplets className="text-white/70 mb-2 block mx-auto" size={20} />
            <div className="text-sm text-white/60">Humidity</div>
            <div className="font-semibold">{current.humidity}%</div>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <Wind className="text-white/70 mb-2 block mx-auto" size={20} />
            <div className="text-sm text-white/60">Wind</div>
            <div className="font-semibold">{current.windSpeed} km/h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
