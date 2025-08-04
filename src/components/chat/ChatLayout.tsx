'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatLayout() {
  const { messages, isLoading, settings, handleSend, handleSettingsChange } =
    useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full flex-col bg-transparent">
      <ChatHeader onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen}/>
      <main className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            isSidebarOpen ? 'w-full md:w-80' : 'w-0',
            'hidden md:block'
          )}
        >
          {isSidebarOpen && (
            <ChatSidebar
              settings={settings}
              onSettingsChange={handleSettingsChange}
            />
          )}
        </div>
        <div className="flex flex-1 flex-col bg-background/80 backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
