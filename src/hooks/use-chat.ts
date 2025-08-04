'use client';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { adjustTone, type AdjustToneInput } from '@/ai/flows/adjust-tone';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatSettings {
  tone: 'formal' | 'informal' | 'humorous';
  language: string;
  responseLength: number;
}

const mockResponses = {
  default:
    "I'm processing your request. Based on my analysis, here are the key points I've identified. Let me know if you need more detail.",
  formal:
    'Upon careful consideration of your inquiry, I have synthesized the relevant information. The following summary outlines the principal findings. Should you require further elucidation, please do not hesitate to ask.',
  informal:
    "Hey there! I've had a look at what you sent over. Here's the gist of it. Just give me a shout if you want to dig deeper on anything!",
  humorous:
    "Alright, I've put on my thinking cap... which is virtual and very stylish, by the way. After sifting through the data, I've got the scoop for you! Ready for the punchline?",
};

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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const input: AdjustToneInput = {
        originalResponse: mockResponses.default,
        tone: settings.tone,
      };

      const result = await adjustTone(input);

      const botMessage: Message = {
        role: 'assistant',
        content: result.adjustedResponse,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error adjusting tone:', error);
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
