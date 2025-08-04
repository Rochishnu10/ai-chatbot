'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adjustTone, type AdjustToneInput } from '@/ai/flows/adjust-tone';
import { chat, type ChatInput } from '@/ai/flows/chat';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSettings {
  tone: 'formal' | 'informal' | 'humorous';
  language: string;
  responseLength: number;
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'informal',
    language: 'English',
    responseLength: 250,
  });
  const { toast } = useToast();

  const handleSettingsChange = (newSettings: Partial<ChatSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleSend = async (text: string) => {
    const userMessage: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const chatInput: ChatInput = { message: text };
      const chatResult = await chat(chatInput);

      const toneInput: AdjustToneInput = {
        originalResponse: chatResult.response,
        tone: settings.tone,
      };
      
      const toneResult = await adjustTone(toneInput);

      const botMessage: Message = {
        role: 'assistant',
        content: toneResult.adjustedResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI.',
      });
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    settings,
    handleSend,
    handleSettingsChange,
  };
}
