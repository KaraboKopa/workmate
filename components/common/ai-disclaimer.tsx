import { ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

// Single source of truth for the required responsible-AI disclaimer text.
export const DISCLAIMER_TEXT =
  'AI-generated content may contain errors or omissions. Please review and verify all information before using it for professional communication, decisions, scheduling, or research.'

export function AiDisclaimer({ className }: { className?: string }) {
  return (
    <div
      role="note"
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-border bg-muted/60 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground',
        className,
      )}
    >
      <ShieldAlert
        className="mt-0.5 size-4 shrink-0 text-primary"
        aria-hidden="true"
      />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span>{' '}
        {DISCLAIMER_TEXT}
      </p>
    </div>
  )
}

// Small inline label to mark generated output as AI-produced.
export function AiGeneratedBadge({ mock }: { mock?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
      {mock ? 'AI-generated (demo)' : 'AI-generated'}
    </span>
  )
}
