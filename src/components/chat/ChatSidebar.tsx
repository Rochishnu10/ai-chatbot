
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
import { Archive, FileUp, SlidersHorizontal, Moon, Sun, Palette } from 'lucide-react';
import type { ChatSettings } from '@/hooks/use-chat';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface ChatSidebarProps {
  settings: ChatSettings;
  onSettingsChange: (settings: Partial<ChatSettings>) => void;
}

export function ChatSidebar({ settings, onSettingsChange }: ChatSidebarProps) {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <aside className="w-full md:w-80 flex flex-col h-full border-l bg-background/80 backdrop-blur-sm">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1" className="border-none">
              <Card className="bg-card/50">
                <AccordionTrigger className="p-6 pb-2 data-[state=open]:border-b">
                  <CardHeader className="p-0 flex flex-row items-center justify-between w-full">
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <SlidersHorizontal className="h-5 w-5" />
                      Settings
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select
                        value={settings.tone}
                        onValueChange={(value) =>
                          onSettingsChange({
                            tone: value as ChatSettings['tone'],
                          })
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
                        <Label htmlFor="response-length">
                          Response Length
                        </Label>
                        <span className="text-xs text-muted-foreground">
                          {settings.responseLength}
                        </span>
                      </div>
                      <Slider
                        id="response-length"
                        min={50}
                        max={500}
                        step={10}
                        value={[settings.responseLength]}
                        onValueChange={(value) =>
                          onSettingsChange({ responseLength: value[0] })
                        }
                        disabled
                      />
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>

          <Card className="bg-card/50">
            <CardHeader>
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Chat History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Previous chats will appear here.
              </p>
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
      <div className='p-4'>
        <Accordion type="single" collapsible>
            <AccordionItem value="item-1" className="border-none">
              <Card className="bg-card/50">
                <AccordionTrigger className="p-6 pb-2 data-[state=open]:border-b">
                  <CardHeader className="p-0 flex flex-row items-center justify-between w-full">
                    <CardTitle className="text-lg font-headline flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                       Appearance
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="space-y-4 pt-4">
                     <div className="space-y-2">
                      <Label htmlFor="theme">Theme</Label>
                       <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger id="theme">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Emerald</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="theme-sunrise">Sunrise</SelectItem>
                          <SelectItem value="theme-ocean">Ocean</SelectItem>
                          <SelectItem value="theme-crimson">Crimson</SelectItem>
                          <SelectItem value="theme-cyberpunk">Cyberpunk</SelectItem>
                          <SelectItem value="theme-vintage">Vintage</SelectItem>
                          <SelectItem value="theme-galaxy">Galaxy</SelectItem>
                          <SelectItem value="theme-mint">Mint</SelectItem>
                          <SelectItem value="theme-rose">Rose</SelectItem>
                          <SelectItem value="theme-dusk">Dusk</SelectItem>
                          <SelectItem value="theme-arctic">Arctic</SelectItem>
                          <SelectItem value="theme-forest">Forest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
      </div>
    </aside>
  );
}

    