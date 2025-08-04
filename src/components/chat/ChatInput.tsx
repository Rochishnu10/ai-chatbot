
'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Paperclip, SendHorizonal, Smile, X, File as FileIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  onSend: (message: string, attachment?: { name: string; type: string; data: string } | null) => void;
  isLoading: boolean;
}

const emojis = ['😊', '😂', '❤️', '👍', '🤔', '🎉', '🔥', '🙏'];

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<{ name: string; type: string; data: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSend = () => {
    if ((message.trim() || attachment) && !isLoading) {
      onSend(message.trim(), attachment);
      setMessage('');
      setAttachment(null);
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
      const reader = new FileReader();
      reader.onload = (e) => {
        setAttachment({
          name: file.name,
          type: file.type,
          data: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);

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

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }

  return (
    <div className="p-4 border-t bg-transparent">
       <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
      <AnimatePresence>
        {attachment && (
            <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: '1rem' }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="relative p-3 rounded-lg border bg-secondary/30 overflow-hidden"
            >
            <div className="flex items-center gap-3">
                <FileIcon className="h-6 w-6 text-primary" />
                <div className="flex-1 text-sm font-medium truncate">
                {attachment.name}
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={removeAttachment}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove attachment</span>
                </Button>
            </div>
            </motion.div>
        )}
      </AnimatePresence>
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
            disabled={isLoading || (!message.trim() && !attachment)}
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
