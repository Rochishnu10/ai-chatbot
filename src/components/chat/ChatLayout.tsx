'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';

export default function ChatLayout() {
  const { messages, isLoading, settings, handleSend, handleSettingsChange } =
    useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-transparent">
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-full md:w-60' : 'w-0 md:w-20',
          'hidden md:flex'
        )}
      />
      <div className="flex flex-1 flex-col bg-background/80 backdrop-blur-sm">
         <ChatHeader />
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
