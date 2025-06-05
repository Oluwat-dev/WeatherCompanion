import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Bot, User, Volume2, Mic, Send } from "lucide-react";

interface AIAssistantChatProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  onVoiceInput: () => void;
  isListening: boolean;
}

export default function AIAssistantChat({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isProcessing,
  onVoiceInput,
  isListening,
}: AIAssistantChatProps) {
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isProcessing) {
      onSendMessage(inputMessage);
      setInputMessage("");
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-40 max-h-[80vh] flex flex-col ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <Bot className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Weather Assistant</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Ask me anything about weather</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <X className="text-gray-500 dark:text-gray-400" size={16} />
        </Button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white text-sm" />
            </div>
            <div className="chat-bubble-ai rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
              <p className="text-gray-800 dark:text-gray-200">
                Hi! I'm your weather assistant. Ask me about current conditions, forecasts, or weather advice!
              </p>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 ${
              message.isAI ? "" : "justify-end"
            }`}
          >
            {message.isAI ? (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="text-white text-sm" />
                </div>
                <div className="chat-bubble-ai rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                  <p className="text-gray-800 dark:text-gray-200">{message.message}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => speakText(message.message)}
                    className="mt-2 text-blue-600 dark:text-blue-400 text-sm hover:underline p-0 h-auto font-normal"
                  >
                    <Volume2 className="mr-1" size={12} />
                    Play audio
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="chat-bubble-user rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                  <p className="text-white">{message.message}</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="text-gray-600 dark:text-gray-300 text-sm" />
                </div>
              </>
            )}
          </div>
        ))}

        {/* Loading State */}
        {isProcessing && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="text-white text-sm" />
            </div>
            <div className="chat-bubble-ai rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <Input
            type="text"
            placeholder="Ask about weather..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-gray-700 border-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isProcessing}
          />
          <Button
            type="submit"
            disabled={!inputMessage.trim() || isProcessing}
            className="w-12 h-12 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50"
          >
            <Send size={16} />
          </Button>
          <Button
            type="button"
            onClick={onVoiceInput}
            className={`w-12 h-12 rounded-xl transition-colors ${
              isListening 
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Mic size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
