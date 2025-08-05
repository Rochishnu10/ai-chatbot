'use client';
import type { Message } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
      }
    };
    
    // A short delay ensures the DOM has updated before we try to scroll
    const timer = setTimeout(scrollToBottom, 50);

    return () => clearTimeout(timer);
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full w-full" ref={viewportRef}>
      <div className="p-4 md:p-6">
        <ChatMessage
          message={{
            role: 'assistant',
            content: "Welcome to NovaChat! How can I assist you today?",
          }}
        />
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
        {isLoading && (
          <ChatMessage
            message={{ role: 'assistant', content: '' }}
            isLoading={true}
          />
        )}
      </div>
    </ScrollArea>
  );
}
