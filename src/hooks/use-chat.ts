
'use client';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { chat, type ChatInput } from '@/ai/flows/chat';
import { v4 as uuidv4 } from 'uuid';

const mockUuid = () => {
    try {
        return uuidv4();
    } catch (e) {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    type: string;
    data: string;
  };
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

export interface ChatSettings {
  tone: 'formal' | 'informal' | 'humorous' | 'normal' | 'brutal';
}

const CHAT_HISTORY_KEY = 'nova-chat-history';
const CHAT_SETTINGS_KEY = 'nova-chat-settings';


export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<ChatSettings>({
    tone: 'normal',
  });
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
    if (storedHistory) {
      setChatHistory(JSON.parse(storedHistory));
    }
    const storedSettings = localStorage.getItem(CHAT_SETTINGS_KEY);
    if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        // We no longer use animation setting, so we only pull 'tone'
        if (parsedSettings.tone) {
            setSettings({ tone: parsedSettings.tone });
        }
    }
  }, []);

  useEffect(() => {
    // If there is history, load the most recent chat. Otherwise, start a new one.
    if (chatHistory.length > 0) {
        if (!currentChatId) {
            const mostRecentChat = [...chatHistory].sort((a,b) => b.timestamp - a.timestamp)[0];
            loadChat(mostRecentChat.id);
        }
    } else if (!currentChatId) {
        startNewChat();
    }
  }, [chatHistory, currentChatId]);


  useEffect(() => {
    // Save history whenever it changes
    if (chatHistory.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatHistory));
    } else {
      localStorage.removeItem(CHAT_HISTORY_KEY);
    }
  }, [chatHistory]);

  useEffect(() => {
    // Save settings whenever they change
    localStorage.setItem(CHAT_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  

  const handleSettingsChange = (newSettings: Partial<ChatSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const loadChat = (id: string) => {
    const chatToLoad = chatHistory.find((chat) => chat.id === id);
    if (chatToLoad) {
      setCurrentChatId(id);
      setMessages(chatToLoad.messages);
    }
  };

  const startNewChat = () => {
    const newId = mockUuid();
    setCurrentChatId(newId);
    setMessages([]);
  };

  const clearChatHistory = () => {
    setChatHistory([]);
    startNewChat();
  };

  const deleteChatSession = (id: string) => {
    setChatHistory(prev => {
      const newHistory = prev.filter(session => session.id !== id);
      if (currentChatId === id) {
        if (newHistory.length > 0) {
          const mostRecentChat = [...newHistory].sort((a, b) => b.timestamp - a.timestamp)[0];
          loadChat(mostRecentChat.id);
        } else {
          startNewChat();
        }
      }
      return newHistory;
    });
  };

  const updateChatHistory = (chatId: string, newMessages: Message[], userMessage: Message) => {
    setChatHistory(prev => {
        const existingChatIndex = prev.findIndex(c => c.id === chatId);
        let newHistory = [...prev];
        
        if (existingChatIndex !== -1) {
            // Update existing chat
            const updatedChat = {
                ...newHistory[existingChatIndex],
                messages: newMessages,
                timestamp: Date.now(),
            };
            newHistory[existingChatIndex] = updatedChat;
        } else {
            // Create new chat
            const newChatSession: ChatSession = {
                id: chatId,
                title: userMessage.content.substring(0, 30) || 'New Chat',
                messages: newMessages,
                timestamp: Date.now(),
            };
            newHistory.push(newChatSession);
        }
        return newHistory;
    });
  };

  const handleSend = async (text: string, attachment?: Message['attachment']) => {
    if (!currentChatId) return;

    const userMessage: Message = { role: 'user', content: text, attachment };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatInput: ChatInput = {
        message: text,
        tone: settings.tone,
        history: messages,
      };

      if (attachment && attachment.type.startsWith('image/')) {
        chatInput.photoDataUri = attachment.data;
      }
      
      const chatResult = await chat(chatInput);

      const botMessage: Message = {
        role: 'assistant',
        content: chatResult.response,
      };
      
      const finalMessages = [...newMessages, botMessage];
      setMessages(finalMessages);
      updateChatHistory(currentChatId, finalMessages, userMessage);

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
    chatHistory,
    currentChatId,
    handleSend,
    handleSettingsChange,
    loadChat,
    startNewChat,
    clearChatHistory,
    deleteChatSession,
  };
}
