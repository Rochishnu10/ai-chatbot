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
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Archive, FileUp, Languages, SlidersHorizontal } from 'lucide-react';
import type { ChatSettings } from '@/hooks/use-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatSidebarProps {
  settings: ChatSettings;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
}

export function ChatSidebar({ settings, onSettingsChange }: ChatSidebarProps) {
  return (
    <aside className="w-full md:w-80 flex flex-col h-full border-l bg-background/50">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Card className="bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={settings.tone}
                  onValueChange={(value) =>
                    onSettingsChange({ tone: value as ChatSettings['tone'] })
                  }
                >
                  <SelectTrigger id="tone">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="informal">Informal</SelectItem>
                    <SelectItem value="humorous">Humorous</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                 <Select defaultValue="english" disabled>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="response-length">Response Length</Label>
                  <span className="text-xs text-muted-foreground">{settings.responseLength}</span>
                </div>
                 <Slider
                  id="response-length"
                  min={50}
                  max={500}
                  step={10}
                  value={[settings.responseLength]}
                  onValueChange={(value) => onSettingsChange({ responseLength: value[0] })}
                  disabled
                />
              </div>
            </CardContent>
          </Card>

           <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                 <Archive className="h-5 w-5"/>
                 Chat History
              </CardTitle>
            </CardHeader>
             <CardContent>
               <p className="text-sm text-muted-foreground">Previous chats will appear here.</p>
             </CardContent>
           </Card>

          <div className="space-y-2 p-2 border rounded-lg border-dashed">
            <div className="flex flex-col items-center justify-center text-center p-4">
               <FileUp className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Drag & drop files or
              </p>
              <Button variant="link" className="p-0 h-auto" disabled>
                click to upload
              </Button>
            </div>
          </div>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4 flex justify-between items-center">
        <Label htmlFor="dark-mode" className="flex items-center gap-2">Dark Mode</Label>
        <Switch id="dark-mode" checked={true} disabled />
      </div>
    </aside>
  );
}
