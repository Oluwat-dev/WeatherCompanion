# WeatherAI - Smart Weather Assistant

A modern, mobile-responsive weather application with AI-powered personal assistance, voice input capabilities, and real-time weather data.

![WeatherAI Screenshot](https://via.placeholder.com/800x400/2563EB/FFFFFF?text=WeatherAI+Screenshot)

## Features

### 🌤️ Weather Information
- **Real-time Weather Data**: Current conditions, temperature, humidity, wind speed, and visibility
- **5-Day Forecast**: Detailed daily forecasts with weather conditions
- **Location Search**: Search for weather in any city worldwide
- **Geolocation Support**: Automatic detection of user's current location
- **Weather Alerts**: Display severe weather warnings and alerts

### 🤖 AI-Powered Assistant
- **ChatGPT Integration**: Intelligent weather-related Q&A
- **Context-Aware Responses**: AI considers current weather conditions
- **Offline Mode**: Smart fallback responses when AI is unavailable
- **Clothing Recommendations**: Weather-appropriate outfit suggestions
- **Activity Suggestions**: Weather-based activity recommendations

### 🎤 Voice Features
- **Voice Input**: Web Speech API integration for hands-free interaction
- **Speech Recognition**: Convert speech to text for chat queries
- **Text-to-Speech**: AI responses can be played as audio
- **Real-time Processing**: Instant voice command recognition

### 🎨 User Experience
- **Mobile-First Design**: Fully responsive for all device sizes
- **Theme Toggle**: Light, dark, and system theme options
- **Glass Morphism UI**: Modern frosted glass design elements
- **Smooth Animations**: Polished transitions and interactions
- **Progressive Web App**: App-like experience in the browser

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Wouter** for client-side routing
- **TanStack Query** for data fetching and caching
- **Lucide React** for icons
- **Framer Motion** for animations

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **OpenAI GPT-4o** for AI assistance
- **OpenWeatherMap API** for weather data
- **Web Speech API** for voice recognition

### Development Tools
- **Vite** for fast development and building
- **ESBuild** for compilation
- **Drizzle ORM** for database schema
- **Zod** for runtime validation

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- OpenAI API key
- OpenWeatherMap API key

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/weatherai.git
   cd weatherai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Set up your API keys as environment variables:
   ```bash
   export OPENAI_API_KEY="your-openai-api-key"
   export OPENWEATHER_API_KEY="your-openweather-api-key"
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5000`

## API Keys Setup

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Add billing information for usage

### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your default API key
5. Free tier includes 1,000 calls/day

## Usage

### Basic Weather Queries
- Search for any city in the search bar
- Use the location button for current position
- View 5-day forecast by scrolling down
- Check detailed weather metrics in cards

### AI Assistant
- Click the chat icon or use voice input
- Ask questions like:
  - "What should I wear today?"
  - "Is it good weather for a picnic?"
  - "Should I bring an umbrella?"
  - "What's the wind like?"

### Voice Commands
- Click the microphone button
- Speak your weather question
- The AI will respond with relevant advice
- Use the speaker icon to hear responses

### Theme Switching
- Click the settings gear icon
- Choose between Light, Dark, or System theme
- Settings persist across browser sessions

## Project Structure

```
weatherai/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   ├── pages/         # Route components
│   │   └── main.tsx       # App entry point
│   └── index.html
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route handlers
│   ├── storage.ts        # Data storage layer
│   └── openai.ts         # AI integration
├── shared/               # Shared types and schemas
│   └── schema.ts
└── package.json
```

## API Endpoints

### Weather APIs
- `GET /api/weather/current?lat={lat}&lon={lon}` - Current weather
- `GET /api/weather/search?q={query}` - Location search

### Chat APIs
- `POST /api/chat` - Send message to AI assistant
- `GET /api/chat/history` - Retrieve chat history

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

## Deployment

### Environment Variables
Ensure these are set in your production environment:
- `OPENAI_API_KEY`
- `OPENWEATHER_API_KEY`
- `NODE_ENV=production`

### Build and Deploy
```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **OpenWeatherMap** for comprehensive weather data
- **OpenAI** for GPT-4o AI capabilities
- **Lucide** for beautiful icons
- **Tailwind CSS** for utility-first styling

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/weatherai/issues) page
2. Create a new issue with detailed information
3. Include browser version and error messages

---

**© 2025 All rights reserved. Developed with love by Oluwatobi**

---

## Recent Updates

### v1.0.0 - Initial Release
- Complete weather application with AI assistant
- Mobile-responsive design
- Voice input and speech recognition
- Theme switching capabilities
- Real-time weather data integration
- Offline mode for AI responses