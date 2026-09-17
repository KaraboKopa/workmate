'use client'

import type { ReactNode } from 'react'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function FeatureHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-xl font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground text-pretty">
        {description}
      </p>
    </div>
  )
}

export function SamplePrompts({
  items,
  onSelect,
}: {
  items: { label: string; value: string }[]
  onSelect: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">
        Try an example
      </span>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(item.value)}
            className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  )
}

export function SubmitButton({
  loading,
  children,
  loadingText = 'Generating…',
  ...props
}: React.ComponentProps<typeof Button> & {
  loading: boolean
  loadingText?: string
}) {
  return (
    <Button type="submit" size="lg" disabled={loading} {...props}>
      {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
      {loading ? loadingText : children}
    </Button>
  )
}

export function ResultList({
  items,
  empty,
  className,
}: {
  items: string[]
  empty?: string
  className?: string
}) {
  if (!items || items.length === 0) {
    return empty ? (
      <p className="text-sm text-muted-foreground italic">{empty}</p>
    ) : null
  }
  return (
    <ul className={cn('flex flex-col gap-1.5', className)}>
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-sm text-foreground">
          <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
          <span className="text-pretty">{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function ResultSection({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
      {children}
    </section>
  )
}

// Skeleton placeholder shown while a response is streaming/generating.
export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-3" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-2">
          <div className="h-3 w-24 rounded bg-muted animate-pulse" />
          <div className="h-3 w-full rounded bg-muted animate-pulse" />
          <div className="h-3 w-4/5 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}
