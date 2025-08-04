'use client';

import { NovaLogo } from './NovaLogo';

export function ChatHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 shrink-0">
      <div className="flex items-center gap-3">
        <NovaLogo />
        <h1 className="text-lg font-headline font-semibold">NovaChat</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative h-2 w-2">
          <div className="absolute h-full w-full animate-ping rounded-full bg-accent" />
          <div className="h-full w-full rounded-full bg-accent" />
        </div>
        <span className="text-sm text-muted-foreground">Online</span>
      </div>
    </header>
  );
}
