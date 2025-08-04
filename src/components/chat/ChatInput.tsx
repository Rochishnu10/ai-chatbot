'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Paperclip, SendHorizonal, Smile } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const emojis = ['😊', '😂', '❤️', '👍', '🤔', '🎉', '🔥', '🙏'];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSend(message.trim());
      setMessage('');
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: 'File Selected',
        description: `You have selected ${file.name}.`,
      });
      // Reset file input
      event.target.value = '';
    }
  };

  const handleMicClick = () => {
    toast({
      title: 'Coming Soon!',
      description: 'Voice input is not yet implemented.',
    });
  };

  return (
    <div className="relative p-4 border-t bg-transparent">
       <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here..."
          rows={1}
          maxRows={5}
          className="min-h-[48px] w-full resize-none rounded-2xl border-input bg-secondary/50 p-4 pr-40 text-sm shadow-sm focus:border-primary focus:ring-primary"
          disabled={isLoading}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
              >
                <Smile className="h-5 w-5" />
                <span className="sr-only">Emoji</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-4 gap-2">
                    {emojis.map((emoji) => (
                        <Button
                        key={emoji}
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl"
                        >
                        {emoji}
                        </Button>
                    ))}
                </div>
            </PopoverContent>
          </Popover>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            onClick={handleMicClick}
          >
            <Mic className="h-5 w-5" />
            <span className="sr-only">Voice input</span>
          </Button>
          <Button
            size="icon"
            variant="default"
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className="rounded-full bg-primary text-primary-foreground w-10 h-10 hover:bg-primary/90 transition-all active:scale-95"
          >
            <SendHorizonal className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
