
'use client';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  MessageSquarePlus,
  SlidersHorizontal,
  Palette,
  PanelLeft,
  PanelRight,
  User,
  Settings,
} from 'lucide-react';
import type { ChatSettings } from '@/hooks/use-chat';
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatSidebarProps {
  settings: ChatSettings;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  className?: string;
}

export function ChatSidebar({
  settings,
  onSettingsChange,
  isSidebarOpen,
  onSidebarToggle,
  className,
}: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-full border-r bg-background/80 backdrop-blur-sm p-4 gap-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        {isSidebarOpen && <h2 className="text-lg font-headline">History</h2>}
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          {isSidebarOpen ? <PanelLeft /> : <PanelRight />}
        </Button>
      </div>
      <Button variant="outline" className={cn('w-full rounded-full', !isSidebarOpen && 'justify-center')}>
        <MessageSquarePlus />
        {isSidebarOpen && <span>New Chat</span>}
      </Button>
      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {isSidebarOpen && (
            <p className="text-sm text-muted-foreground px-2">
              Previous chats will appear here.
            </p>
          )}
        </div>
      </ScrollArea>
      <div className="mt-auto mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className={cn("w-full justify-start gap-2 rounded-full", !isSidebarOpen && "justify-center")}>
              <User />
              {isSidebarOpen && <span>User Settings</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 mb-2" side="right" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Theme</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                   <DropdownMenuItem onClick={() => setTheme('theme-sunrise')}>Sunrise</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('theme-mint')}>Mint</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('theme-rose')}>Rose</DropdownMenuItem>
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
                  <DropdownMenuItem
                    onClick={() => onSettingsChange({ tone: 'formal' })}
                  >
                    Formal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSettingsChange({ tone: 'informal' })}
                  >
                    Informal
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onSettingsChange({ tone: 'humorous' })}
                  >
                    Humorous
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
