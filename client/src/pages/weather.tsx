import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/use-weather";
import { useVoice } from "@/hooks/use-voice";
import { useAIChat } from "@/hooks/use-ai-chat";
import { useTheme } from "@/hooks/use-theme";
import CurrentWeatherCard from "@/components/weather/current-weather-card";
import ForecastSection from "@/components/weather/forecast-section";
import AIAssistantChat from "@/components/weather/ai-assistant-chat";
import VoiceInputButton from "@/components/weather/voice-input-button";
import WeatherAlert from "@/components/weather/weather-alert";
import SettingsPanel from "@/components/weather/settings-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Settings, Cloud } from "lucide-react";

export default function WeatherPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  const { weather, isLoading, searchLocations, getWeatherByCoords, isSearching } = useWeather();
  const { isListening, startListening, stopListening, transcript, resetTranscript } = useVoice();
  const { messages, sendMessage, isProcessing } = useAIChat();
  const { theme } = useTheme();

  // Get user's current location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          // Fallback to a default location (San Francisco)
          setCurrentLocation({ lat: 37.7749, lon: -122.4194 });
          getWeatherByCoords(37.7749, -122.4194);
        }
      );
    } else {
      // Geolocation not supported, use default location
      setCurrentLocation({ lat: 37.7749, lon: -122.4194 });
      getWeatherByCoords(37.7749, -122.4194);
    }
  }, [getWeatherByCoords]);

  // Handle voice input
  useEffect(() => {
    if (transcript) {
      if (chatOpen) {
        sendMessage(transcript, weather || undefined);
      } else {
        setChatOpen(true);
        setTimeout(() => {
          sendMessage(transcript, weather || undefined);
        }, 300);
      }
      resetTranscript();
    }
  }, [transcript, chatOpen, sendMessage, weather, resetTranscript]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const locations = await searchLocations(searchQuery);
      if (locations.length > 0) {
        const location = locations[0];
        setCurrentLocation({ lat: location.lat, lon: location.lon });
        getWeatherByCoords(location.lat, location.lon);
        setSearchQuery("");
      }
    }
  };

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
          getWeatherByCoords(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
      if (!chatOpen) {
        setChatOpen(true);
      }
    }
  };

  const getBackgroundClass = () => {
    if (theme === 'dark') {
      return 'weather-gradient-dark text-white';
    } else if (theme === 'light') {
      return 'weather-gradient text-white';
    } else {
      // System theme
      return 'weather-gradient dark:weather-gradient-dark text-white';
    }
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-all duration-300 ${getBackgroundClass()}`}>
      {/* Weather Alert */}
      <WeatherAlert alerts={weather?.alerts} />

      {/* Header */}
      <header className="px-4 pt-6 pb-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center glass-effect">
              <Cloud className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold">WeatherAI</h1>
              <p className="text-white/70 text-sm">Smart Weather Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 bg-white/20 rounded-full glass-effect hover:bg-white/30 text-white"
          >
            <Settings size={20} />
          </Button>
        </div>
      </header>

      {/* Location Search */}
      <div className="px-4 mb-6">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/20 glass-effect rounded-xl px-4 py-3 pl-12 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30 border-0"
            disabled={isSearching}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
          <Button
            type="button"
            onClick={handleCurrentLocation}
            variant="ghost"
            size="sm"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 rounded-lg hover:bg-white/30 text-white p-0"
          >
            <MapPin size={14} />
          </Button>
        </form>
      </div>

      {/* Current Weather */}
      {isLoading ? (
        <div className="px-4 mb-6">
          <div className="bg-white/10 glass-effect rounded-2xl p-6 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-4 w-48 mx-auto"></div>
            <div className="h-24 bg-white/20 rounded-full w-24 mx-auto mb-4"></div>
            <div className="h-16 bg-white/20 rounded mb-6 w-32 mx-auto"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-20 bg-white/20 rounded-xl"></div>
              <div className="h-20 bg-white/20 rounded-xl"></div>
              <div className="h-20 bg-white/20 rounded-xl"></div>
            </div>
          </div>
        </div>
      ) : weather ? (
        <CurrentWeatherCard weather={weather} />
      ) : null}

      {/* 5-Day Forecast */}
      {weather && <ForecastSection forecast={weather.forecast} isLoading={isLoading} />}

      {/* Voice Input Button */}
      <VoiceInputButton
        isListening={isListening}
        onClick={handleVoiceInput}
      />

      {/* AI Assistant Chat */}
      <AIAssistantChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        onSendMessage={(message) => sendMessage(message, weather || undefined)}
        isProcessing={isProcessing}
        onVoiceInput={handleVoiceInput}
        isListening={isListening}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-white/70 text-sm">
        <p>© 2025 All rights reserved. Developed with love by Oluwatobi</p>
      </footer>
    </div>
  );
}
