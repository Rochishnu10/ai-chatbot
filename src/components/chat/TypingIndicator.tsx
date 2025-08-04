import { cn } from '@/lib/utils';

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 p-2">
      <span className="sr-only">Typing...</span>
      <div
        className={cn(
          'h-2 w-2 rounded-full bg-primary/80 animate-bounce-dot-1'
        )}
      />
      <div
        className={cn(
          'h-2 w-2 rounded-full bg-primary/80 animate-bounce-dot-2'
        )}
      />
      <div
        className={cn(
          'h-2 w-2 rounded-full bg-primary/80 animate-bounce-dot-3'
        )}
      />
    </div>
  );
}
