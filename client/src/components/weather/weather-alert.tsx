import { useState, useEffect } from "react";
import { WeatherAlert as AlertType } from "@shared/schema";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WeatherAlertProps {
  alerts?: AlertType[];
}

export default function WeatherAlert({ alerts }: WeatherAlertProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentAlert, setCurrentAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      setCurrentAlert(alerts[0]); // Show first alert
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [alerts]);

  if (!currentAlert) return null;

  const severityColors = {
    minor: "bg-yellow-500",
    moderate: "bg-orange-500", 
    severe: "bg-red-500",
    extreme: "bg-red-700",
  };

  return (
    <div
      className={`${severityColors[currentAlert.severity]} text-white px-4 py-3 text-sm font-medium flex items-center justify-between transform transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex items-center space-x-2">
        <AlertTriangle size={16} />
        <span>{currentAlert.title}</span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsVisible(false)}
        className="text-white hover:text-gray-200 w-6 h-6 p-0"
      >
        <X size={14} />
      </Button>
    </div>
  );
}
