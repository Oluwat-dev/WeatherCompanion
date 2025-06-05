import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, Eye, Wind } from "lucide-react";
import React from "react";

// Map OpenWeatherMap icon codes to Lucide React icons
const iconMap: Record<string, any> = {
  // Clear sky
  "01d": Sun,
  "01n": Sun,
  
  // Few clouds
  "02d": Cloud,
  "02n": Cloud,
  
  // Scattered clouds
  "03d": Cloud,
  "03n": Cloud,
  
  // Broken clouds
  "04d": Cloud,
  "04n": Cloud,
  
  // Shower rain
  "09d": CloudDrizzle,
  "09n": CloudDrizzle,
  
  // Rain
  "10d": CloudRain,
  "10n": CloudRain,
  
  // Thunderstorm
  "11d": CloudLightning,
  "11n": CloudLightning,
  
  // Snow
  "13d": CloudSnow,
  "13n": CloudSnow,
  
  // Mist
  "50d": Eye,
  "50n": Eye,
};

// Map weather conditions to icon styles
const conditionStyles: Record<string, string> = {
  "Clear": "text-yellow-400",
  "Clouds": "text-gray-300",
  "Rain": "text-blue-400",
  "Drizzle": "text-blue-300",
  "Thunderstorm": "text-purple-400",
  "Snow": "text-white",
  "Mist": "text-gray-400",
  "Smoke": "text-gray-400",
  "Haze": "text-gray-400",
  "Dust": "text-orange-300",
  "Fog": "text-gray-400",
  "Sand": "text-orange-300",
  "Ash": "text-gray-500",
  "Squall": "text-gray-500",
  "Tornado": "text-red-500",
};

export function getWeatherIcon(iconCode: string) {
  const IconComponent = iconMap[iconCode] || Cloud;
  
  // Return a component that applies the appropriate styling
  return function StyledWeatherIcon({ className = "", ...props }: { className?: string; [key: string]: any }) {
    const condition = iconCode.substring(0, 2);
    const isDay = iconCode.endsWith('d');
    
    let iconStyle = "text-white"; // Default
    
    // Apply condition-based styling
    if (condition === "01") { // Clear
      iconStyle = isDay ? "text-yellow-400" : "text-yellow-200";
    } else if (condition === "02" || condition === "03" || condition === "04") { // Clouds
      iconStyle = "text-gray-300";
    } else if (condition === "09" || condition === "10") { // Rain
      iconStyle = "text-blue-400";
    } else if (condition === "11") { // Thunderstorm
      iconStyle = "text-purple-400";
    } else if (condition === "13") { // Snow
      iconStyle = "text-white";
    } else if (condition === "50") { // Mist/Fog
      iconStyle = "text-gray-400";
    }
    
    return React.createElement(IconComponent, { className: `${iconStyle} ${className}`, ...props });
  };
}

export function getConditionStyle(condition: string): string {
  return conditionStyles[condition] || "text-white";
}
