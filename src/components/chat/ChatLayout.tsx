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
    <div className="flex h-screen w-full flex-col bg-background">
      <ChatHeader />
      <main className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col">
          <div className="flex-1 overflow-y-auto">
            <ChatMessages messages={messages} isLoading={isLoading} />
          </div>
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
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
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
           <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
             {isSidebarOpen ? <PanelRightClose /> : <PanelLeftClose />}
           </Button>
        </div>
      </main>
    </div>
  );
}
