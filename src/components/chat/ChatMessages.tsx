'use client';
import type { Message } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
      <div className="p-4 md:p-6" ref={viewportRef}>
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
          <div className="flex items-start">
             <ChatMessage
              message={{ role: 'assistant', content: '' }}
              isLoading={true}
            />
            <TypingIndicator />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
