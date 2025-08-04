
'use client';
import { Button } from '@/components/ui/button';
import {
  MessageSquarePlus,
  Palette,
  PanelLeft,
  PanelRight,
  Settings,
  Trash,
  User,
  MessageSquare,
} from 'lucide-react';
import type { ChatSettings, ChatSession } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

interface ChatSidebarProps {
  settings: ChatSettings;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  className?: string;
  chatHistory: ChatSession[];
  currentChatId: string | null;
  onStartNewChat: () => void;
  onLoadChat: (id: string) => void;
  onClearHistory: () => void;
}

export function ChatSidebar({
  settings,
  onSettingsChange,
  isSidebarOpen,
  onSidebarToggle,
  className,
  chatHistory,
  currentChatId,
  onStartNewChat,
  onLoadChat,
  onClearHistory,
}: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const sortedHistory = [...chatHistory].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r bg-transparent backdrop-blur-sm p-2 gap-2',
        className
      )}
    >
      <div className="flex items-center justify-between p-2">
        {isSidebarOpen && <h2 className="text-lg font-headline">History</h2>}
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? <PanelLeft /> : <PanelRight />}
        </Button>
      </div>
      <div className='px-2'>
        <Button variant="outline" className={cn('w-full rounded-full', !isSidebarOpen && 'justify-center')} onClick={onStartNewChat}>
            <MessageSquarePlus />
            {isSidebarOpen && <span>New Chat</span>}
        </Button>
      </div>
      <ScrollArea className="flex-1 -mr-2 pr-2">
        <div className="space-y-1 p-2">
          {isSidebarOpen ? (
            sortedHistory.length > 0 ? (
                sortedHistory.map((session) => (
                <Button
                  key={session.id}
                  variant={session.id === currentChatId ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 truncate"
                  onClick={() => onLoadChat(session.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className='truncate'>{session.title}</span>
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground px-2">
                Previous chats will appear here.
              </p>
            )
          ) : null}
        </div>
      </ScrollArea>
      <div className="mt-auto p-2 space-y-2">
      {isSidebarOpen && chatHistory.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-2 text-destructive hover:text-destructive">
                <Trash />
                <span>Clear History</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete your chat history. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onClearHistory} className='bg-destructive hover:bg-destructive/90'>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-2 rounded-full", !isSidebarOpen && "justify-center")}>
              <User />
              {isSidebarOpen && <span>User Settings</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mb-2" sideOffset={8} side="top" align={isSidebarOpen ? 'start' : 'center'}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                    <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="theme-sunrise">Sunrise</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="theme-rose">Rose</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                <span>Tone</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={settings.tone}
                    onValueChange={(value) =>
                      onSettingsChange({
                        tone: value as 'formal' | 'informal' | 'humorous',
                      })
                    }
                  >
                    <DropdownMenuRadioItem value="formal">
                      Formal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="informal">
                      Informal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="humorous">
                      Humorous
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
