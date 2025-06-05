import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";

interface VoiceInputButtonProps {
  isListening: boolean;
  onClick: () => void;
}

export default function VoiceInputButton({ isListening, onClick }: VoiceInputButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={onClick}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transform transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-white/30 ${
          isListening 
            ? "bg-red-500 hover:bg-red-600 text-white" 
            : "bg-white text-blue-600 hover:bg-gray-100"
        }`}
      >
        {isListening ? <Square size={24} /> : <Mic size={24} />}
      </Button>
      {isListening && (
        <div className="absolute inset-0 w-16 h-16 bg-red-500/30 rounded-full animate-ping pointer-events-none"></div>
      )}
    </div>
  );
}
