import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage, WeatherData } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function useAIChat() {
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat/history"],
    staleTime: 0, // Always fetch fresh data
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, weatherContext }: { message: string; weatherContext?: WeatherData }) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        weatherContext,
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch chat history
      queryClient.invalidateQueries({ queryKey: ["/api/chat/history"] });
    },
  });

  const sendMessage = useCallback(
    (message: string, weatherContext?: WeatherData) => {
      sendMessageMutation.mutate({ message, weatherContext });
    },
    [sendMessageMutation]
  );

  return {
    messages,
    sendMessage,
    isProcessing: sendMessageMutation.isPending,
    error: sendMessageMutation.error,
  };
}
