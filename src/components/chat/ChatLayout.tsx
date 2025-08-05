
'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useChat } from '@/hooks/use-chat';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatSidebar } from './ChatSidebar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

export default function ChatLayout() {
  const {
    messages,
    isLoading,
    settings,
    handleSend,
    handleSettingsChange,
    chatHistory,
    startNewChat,
    loadChat,
    clearChatHistory,
    deleteChatSession,
    currentChatId,
  } = useChat();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-transparent">
      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onStartNewChat={startNewChat}
        onLoadChat={loadChat}
        onClearHistory={clearChatHistory}
        onDeleteSession={deleteChatSession}
        className={cn(
          'transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'w-full md:w-80' : 'w-0 md:w-16',
          'hidden md:flex'
        )}
      />
      <div className="flex flex-1 flex-col bg-transparent backdrop-blur-sm h-full max-w-full overflow-hidden">
        <ChatHeader>
            <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                {!isMobileSidebarOpen && (
                  <SheetTrigger asChild className="md:hidden">
                      <Button variant="ghost" size="icon" className="rounded-full">
                          <Menu />
                      </Button>
                  </SheetTrigger>
                )}
                <SheetContent side="left" className="p-0 w-3/4 max-w-sm flex flex-col">
                    <SheetHeader className='p-4 pb-0'>
                      <SheetTitle className='sr-only'>Sidebar</SheetTitle>
                      <SheetDescription className='sr-only'>
                        Chat history, settings, and new chat options.
                      </SheetDescription>
                    </SheetHeader>
                    <ChatSidebar
                        isSidebarOpen={true}
                        onSidebarToggle={() => setIsMobileSidebarOpen(false)}
                        settings={settings}
                        onSettingsChange={handleSettingsChange}
                        chatHistory={chatHistory}
                        currentChatId={currentChatId}
                        onStartNewChat={() => {
                          startNewChat();
                          setIsMobileSidebarOpen(false);
                        }}
                        onLoadChat={(id) => {
                          loadChat(id);
                          setIsMobileSidebarOpen(false);
                        }}
                        onClearHistory={clearChatHistory}
                        onDeleteSession={(id) => {
                          deleteChatSession(id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className='w-full border-none'
                    />
                </SheetContent>
            </Sheet>
        </ChatHeader>
        <div className="flex-1 overflow-y-auto">
          <ChatMessages messages={messages} isLoading={isLoading} />
        </div>
        <ChatInput onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
