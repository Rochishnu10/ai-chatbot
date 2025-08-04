import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from '@/hooks/use-chat';
import { motion } from 'framer-motion';
import { NovaLogo } from './NovaLogo';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean;
}

export function ChatMessage({ message, isLoading }: ChatMessageProps) {
  const isBot = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'group relative flex items-start -ml-2 p-2 rounded-lg',
        { 'justify-end flex-row-reverse': !isBot }
      )}
    >
      <Avatar
        className={cn('h-8 w-8 shrink-0', {
          'animate-pulse-glow': isBot && isLoading,
        })}
      >
        <AvatarImage
          src={isBot ? '/bot-avatar.png' : '/user-avatar.png'}
          alt={isBot ? 'Bot' : 'User'}
        />
        <AvatarFallback>
          {isBot ? <NovaLogo className="h-5 w-5" /> : 'U'}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn('mx-3 flex-1 space-y-2 overflow-hidden', {
          'text-right': !isBot,
        })}
      >
        <div
          className={cn(
            'inline-block rounded-2xl px-4 py-2',
            isBot
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-primary text-primary-foreground'
          )}
        >
          {isBot && isLoading ? (
            <TypingIndicator />
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
