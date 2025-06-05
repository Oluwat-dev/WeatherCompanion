import { weatherLocations, chatMessages, type WeatherLocation, type InsertWeatherLocation, type ChatMessage, type InsertChatMessage, users, type User, type InsertUser } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Weather locations
  getWeatherLocation(id: number): Promise<WeatherLocation | undefined>;
  createWeatherLocation(location: InsertWeatherLocation): Promise<WeatherLocation>;
  getUserWeatherLocations(userId: number): Promise<WeatherLocation[]>;
  
  // Chat messages
  getChatMessage(id: number): Promise<ChatMessage | undefined>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private weatherLocations: Map<number, WeatherLocation>;
  private chatMessages: Map<number, ChatMessage>;
  private currentUserId: number;
  private currentLocationId: number;
  private currentMessageId: number;

  constructor() {
    this.users = new Map();
    this.weatherLocations = new Map();
    this.chatMessages = new Map();
    this.currentUserId = 1;
    this.currentLocationId = 1;
    this.currentMessageId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWeatherLocation(id: number): Promise<WeatherLocation | undefined> {
    return this.weatherLocations.get(id);
  }

  async createWeatherLocation(insertLocation: InsertWeatherLocation): Promise<WeatherLocation> {
    const id = this.currentLocationId++;
    const location: WeatherLocation = { 
      ...insertLocation, 
      id,
      userId: insertLocation.userId || null
    };
    this.weatherLocations.set(id, location);
    return location;
  }

  async getUserWeatherLocations(userId: number): Promise<WeatherLocation[]> {
    return Array.from(this.weatherLocations.values()).filter(
      (location) => location.userId === userId,
    );
  }

  async getChatMessage(id: number): Promise<ChatMessage | undefined> {
    return this.chatMessages.get(id);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = this.currentMessageId++;
    const message: ChatMessage = { 
      ...insertMessage, 
      id, 
      timestamp: new Date(),
      userId: insertMessage.userId || null,
      isAI: insertMessage.isAI || false
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getUserChatMessages(userId: number, limit: number = 50): Promise<ChatMessage[]> {
    const userMessages = Array.from(this.chatMessages.values())
      .filter((message) => message.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
    
    return userMessages.reverse(); // Return in chronological order
  }
}

export const storage = new MemStorage();
