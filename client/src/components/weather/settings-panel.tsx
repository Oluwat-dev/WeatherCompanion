import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { X, Sun, Moon, Monitor } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, changeTheme } = useTheme();

  return (
    <div
      className={`fixed inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl transform transition-transform duration-300 z-50 max-h-[60vh] flex flex-col ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Settings Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
            <Monitor className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Settings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Customize your experience</p>
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

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Theme Selection */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme</h4>
          <div className="space-y-3">
            <Button
              onClick={() => changeTheme('light')}
              variant={theme === 'light' ? 'default' : 'outline'}
              className={`w-full justify-start space-x-3 ${
                theme === 'light' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Sun size={20} />
              <span>Light Mode</span>
            </Button>
            
            <Button
              onClick={() => changeTheme('dark')}
              variant={theme === 'dark' ? 'default' : 'outline'}
              className={`w-full justify-start space-x-3 ${
                theme === 'dark' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Moon size={20} />
              <span>Dark Mode</span>
            </Button>
            
            <Button
              onClick={() => changeTheme('system')}
              variant={theme === 'system' ? 'default' : 'outline'}
              className={`w-full justify-start space-x-3 ${
                theme === 'system' 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Monitor size={20} />
              <span>System Default</span>
            </Button>
          </div>
        </div>

        {/* App Info */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>WeatherAI</strong></p>
            <p>Smart Weather Assistant with AI-powered chat</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}