
'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { chat, type ChatInput } from '@/ai/flows/chat';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
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

  const handleSend = async (text: string, attachment?: Message['attachment']) => {
    const userMessage: Message = { role: 'user', content: text, attachment };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // TODO: Handle attachment in the AI flow
      if (attachment) {
        console.log('Sending attachment:', attachment.name);
      }
      const chatInput: ChatInput = {
        message: text,
        tone: settings.tone,
      };
      const chatResult = await chat(chatInput);

      const botMessage: Message = {
        role: 'assistant',
        content: chatResult.response,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the AI. The model may be overloaded. Please try again later.',
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
