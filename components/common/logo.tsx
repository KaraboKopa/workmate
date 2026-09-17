import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string
  withWordmark?: boolean
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span className="inline-flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>
      {withWordmark && (
        <span className="text-base font-semibold tracking-tight">
          WorkMate<span className="text-primary"> AI</span>
        </span>
      )}
    </span>
  )
}
