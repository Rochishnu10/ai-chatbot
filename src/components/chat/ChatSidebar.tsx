
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
  Trash2,
  Orbit,
  ChevronDown,
} from 'lucide-react';
import type { ChatSettings, ChatSession, BackgroundAnimation } from '@/hooks/use-chat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label';
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
  onDeleteSession: (id: string) => void;
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
  onDeleteSession,
}: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation(); // Prevent the chat from loading when deleting
    onDeleteSession(sessionId);
  }

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
                <div key={session.id} className="relative group">
                  <Button
                    variant={session.id === currentChatId ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-2 truncate"
                    onClick={() => onLoadChat(session.id)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className='truncate'>{session.title}</span>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={(e) => e.stopPropagation()}
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this chat session. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={(e) => handleDelete(e, session.id)} className='bg-destructive hover:bg-destructive/90'>
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
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
        <Collapsible open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <CollapsibleContent className='p-2 space-y-4 mb-2'>
                <div className='space-y-2'>
                    <Label className='flex items-center gap-2'><Palette/> Theme</Label>
                    <RadioGroup value={theme} onValueChange={setTheme} className='pl-6'>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='light' id='light'/><Label htmlFor='light'>Light</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='dark' id='dark'/><Label htmlFor='dark'>Dark</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='theme-sunrise' id='sunrise'/><Label htmlFor='sunrise'>Sunrise</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='theme-rose' id='rose'/><Label htmlFor='rose'>Rose</Label></div>
                    </RadioGroup>
                </div>
                <div className='space-y-2'>
                    <Label className='flex items-center gap-2'><Orbit/> Animation</Label>
                    <RadioGroup value={settings.animation} onValueChange={(value) => onSettingsChange({ animation: value as BackgroundAnimation })} className='pl-6'>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='orbit' id='orbit'/><Label htmlFor='orbit'>Orbit</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='nebula' id='nebula'/><Label htmlFor='nebula'>Nebula</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='pulse' id='pulse'/><Label htmlFor='pulse'>Pulse</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='none' id='none'/><Label htmlFor='none'>None</Label></div>
                    </RadioGroup>
                </div>
                <div className='space-y-2'>
                    <Label className='flex items-center gap-2'><Settings/> Tone</Label>
                    <RadioGroup value={settings.tone} onValueChange={(value) => onSettingsChange({ tone: value as 'formal' | 'informal' | 'humorous' })} className='pl-6'>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='formal' id='formal'/><Label htmlFor='formal'>Formal</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='informal' id='informal'/><Label htmlFor='informal'>Informal</Label></div>
                        <div className='flex items-center space-x-2'><RadioGroupItem value='humorous' id='humorous'/><Label htmlFor='humorous'>Humorous</Label></div>
                    </RadioGroup>
                </div>

            </CollapsibleContent>
            <CollapsibleTrigger asChild>
                <Button variant="ghost" className={cn("w-full justify-between gap-2 rounded-full", !isSidebarOpen && "justify-center")}>
                    <div className='flex items-center gap-2'>
                        <User />
                        {isSidebarOpen && <span>User Settings</span>}
                    </div>
                    {isSidebarOpen && <ChevronDown className={cn('h-4 w-4 transition-transform', isSettingsOpen && 'rotate-180')} />}
                </Button>
            </CollapsibleTrigger>
        </Collapsible>
      </div>
    </aside>
  );
}
