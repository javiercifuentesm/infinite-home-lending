export function AgentV2TypingRow() {
  return (
    <div className="flex items-center gap-2 py-2 text-slate-500" aria-live="polite" aria-label="Assistant is typing">
      <span className="sr-only">Assistant is typing</span>
      <span className="inline-flex gap-1">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-slate-400 [animation-delay:300ms]" />
      </span>
    </div>
  );
}
