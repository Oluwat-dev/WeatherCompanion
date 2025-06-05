import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatMessageSchema, type WeatherData } from "@shared/schema";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY_ENV_VAR || "default_key";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get current weather by coordinates
  app.get("/api/weather/current", async (req, res) => {
    try {
      const { lat, lon } = req.query;
      
      if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
      }

      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const weatherData = await weatherResponse.json();

      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      const forecastData = await forecastResponse.json();

      // Process forecast data to get 5-day forecast
      const dailyForecasts = [];
      const processedDays = new Set();
      
      for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        
        if (!processedDays.has(dayKey) && dailyForecasts.length < 5) {
          processedDays.add(dayKey);
          
          const dayName: string = dailyForecasts.length === 0 ? "Today" : 
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

      const result: WeatherData = {
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

      res.json(result);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  // Search locations
  app.get("/api/weather/search", async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({ error: "Search query is required" });
      }

      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q as string)}&limit=5&appid=${OPENWEATHER_API_KEY}`
      );

      if (!response.ok) {
        throw new Error("Failed to search locations");
      }

      const locations = await response.json();
      
      const results = locations.map((location: any) => ({
        name: location.name,
        country: location.country,
        state: location.state,
        lat: location.lat,
        lon: location.lon,
      }));

      res.json(results);
    } catch (error) {
      console.error("Location search error:", error);
      res.status(500).json({ error: "Failed to search locations" });
    }
  });

  // Generate offline response based on weather context
  function generateOfflineResponse(message: string, weatherContext?: any): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('temperature') || lowerMessage.includes('hot') || lowerMessage.includes('cold')) {
      if (weatherContext?.current?.temperature) {
        const temp = weatherContext.current.temperature;
        if (temp > 25) {
          return `It's quite warm at ${temp}°C! Consider wearing light, breathable clothing and staying hydrated.`;
        } else if (temp < 10) {
          return `It's cold at ${temp}°C. Make sure to dress warmly with layers, a jacket, and consider a hat and gloves.`;
        } else {
          return `The temperature is ${temp}°C, which is comfortable. Light layers should work well.`;
        }
      }
      return "I can provide temperature-specific advice when weather data is available.";
    }
    
    if (lowerMessage.includes('rain') || lowerMessage.includes('umbrella')) {
      if (weatherContext?.current?.condition?.toLowerCase().includes('rain')) {
        return "It's raining! Don't forget to bring an umbrella or wear a waterproof jacket.";
      }
      return "No rain is currently forecasted, but it's always good to check the forecast before heading out.";
    }
    
    if (lowerMessage.includes('wind') || lowerMessage.includes('windy')) {
      if (weatherContext?.current?.windSpeed) {
        const wind = weatherContext.current.windSpeed;
        if (wind > 20) {
          return `It's quite windy at ${wind} km/h. Secure loose items and be cautious if you're cycling or driving.`;
        } else {
          return `Wind speed is ${wind} km/h, which is quite manageable.`;
        }
      }
      return "I can provide wind-specific information when weather data is available.";
    }
    
    if (lowerMessage.includes('clothes') || lowerMessage.includes('wear') || lowerMessage.includes('dress')) {
      if (weatherContext?.current) {
        const temp = weatherContext.current.temperature;
        const condition = weatherContext.current.condition?.toLowerCase() || '';
        let suggestion = '';
        
        if (temp > 25) suggestion = 'Light, breathable clothing like cotton t-shirts and shorts';
        else if (temp > 15) suggestion = 'Comfortable clothing with a light jacket or sweater';
        else if (temp > 5) suggestion = 'Warm layers, a jacket, and long pants';
        else suggestion = 'Heavy winter clothing, coat, hat, and gloves';
        
        if (condition.includes('rain')) suggestion += ', and don\'t forget a waterproof jacket or umbrella';
        
        return `Based on ${temp}°C and ${weatherContext.current.condition}: ${suggestion}.`;
      }
      return "I can provide clothing recommendations based on current weather conditions.";
    }
    
    if (lowerMessage.includes('forecast') || lowerMessage.includes('tomorrow') || lowerMessage.includes('week')) {
      return "Check the 5-day forecast displayed on the main screen for upcoming weather conditions.";
    }
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm your weather assistant. I can help you with weather information and advice about what to wear or do based on current conditions.";
    }
    
    return "I'm currently running in offline mode. I can help with basic weather questions about temperature, rain, wind, and clothing recommendations when weather data is available. Please ask me about current weather conditions!";
  }

  // AI Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, weatherContext } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Store user message
      await storage.createChatMessage({
        userId: 1, // For demo purposes, using fixed user ID
        message,
        isAI: false,
      });

      let aiResponse = "";

      try {
        // Try OpenAI first
        const systemPrompt = `You are a helpful weather assistant AI. Provide accurate, friendly, and concise responses about weather-related questions. 
        
        Guidelines:
        - Be conversational and helpful
        - Provide practical advice when appropriate
        - Keep responses concise but informative
        - If asked about clothing recommendations, consider the weather conditions
        - If asked about activities, suggest weather-appropriate options

        ${weatherContext ? `\n\nCurrent weather context:
        Location: ${weatherContext.location?.name}, ${weatherContext.location?.country}
        Temperature: ${weatherContext.current?.temperature}°C
        Condition: ${weatherContext.current?.condition}
        Description: ${weatherContext.current?.description}
        Humidity: ${weatherContext.current?.humidity}%
        Wind Speed: ${weatherContext.current?.windSpeed} km/h` : ''}`;

        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          max_tokens: 200,
          temperature: 0.7,
        });

        aiResponse = completion.choices[0].message.content || "I'm sorry, I couldn't process your request.";
      } catch (openaiError) {
        console.log("OpenAI unavailable, using offline mode");
        // Fallback to offline response
        aiResponse = generateOfflineResponse(message, weatherContext);
      }

      // Store AI response
      await storage.createChatMessage({
        userId: 1,
        message: aiResponse,
        isAI: true,
      });

      res.json({ response: aiResponse });
    } catch (error) {
      console.error("AI Chat error:", error);
      res.status(500).json({ error: "Failed to process chat message" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const messages = await storage.getUserChatMessages(1, 20); // Get last 20 messages
      res.json(messages);
    } catch (error) {
      console.error("Chat history error:", error);
      res.status(500).json({ error: "Failed to fetch chat history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
