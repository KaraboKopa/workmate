'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CalendarClock,
  FileText,
  Mail,
  Menu,
  MessagesSquare,
  X,
  type LucideIcon,
} from 'lucide-react'
import { FEATURES, FEATURE_MAP, type FeatureId } from '@/lib/features'
import { Logo } from '@/components/common/logo'
import { AiDisclaimer } from '@/components/common/ai-disclaimer'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { EmailGenerator } from '@/components/features/email-generator'
import { MeetingSummarizer } from '@/components/features/meeting-summarizer'
import { TaskPlanner } from '@/components/features/task-planner'
import { ResearchAssistant } from '@/components/features/research-assistant'
import { ProductivityChat } from '@/components/features/productivity-chat'

const ICONS: Record<FeatureId, LucideIcon> = {
  email: Mail,
  summary: FileText,
  planner: CalendarClock,
  research: BookOpen,
  chat: MessagesSquare,
}

export function DashboardShell({
  initialFeature = 'email',
}: {
  initialFeature?: FeatureId
}) {
  const [active, setActive] = useState<FeatureId>(initialFeature)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const activeFeature = FEATURE_MAP[active]

  function NavList() {
    return (
      <nav aria-label="Features" className="flex flex-col gap-1">
        {FEATURES.map((f) => {
          const Icon = ICONS[f.id]
          const isActive = f.id === active
          return (
            <button
              key={f.id}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => {
                setActive(f.id)
                setMobileNavOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden="true" />
              {f.name}
            </button>
          )
        })}
      </nav>
    )
  }

  return (
    <div className="flex min-h-svh flex-col bg-background md:flex-row">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
        <div className="flex h-16 items-center border-b border-sidebar-border px-5">
          <Link href="/" aria-label="WorkMate AI home">
            <Logo />
          </Link>
        </div>
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          <NavList />
          <div className="mt-auto">
            <AiDisclaimer />
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex h-16 items-center justify-between border-b border-border bg-sidebar px-4 md:hidden">
        <Link href="/" aria-label="WorkMate AI home">
          <Logo />
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileNavOpen}
          onClick={() => setMobileNavOpen((o) => !o)}
        >
          {mobileNavOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {mobileNavOpen && (
        <div className="border-b border-border bg-sidebar p-4 md:hidden">
          <NavList />
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6 sm:px-6 md:py-8">
          {active === 'email' && <EmailGenerator />}
          {active === 'summary' && <MeetingSummarizer />}
          {active === 'planner' && <TaskPlanner />}
          {active === 'research' && <ResearchAssistant />}
          {active === 'chat' && <ProductivityChat />}

          {active !== 'chat' && (
            <p className="sr-only">{activeFeature.description}</p>
          )}

          <div className="md:hidden">
            <AiDisclaimer />
          </div>
        </div>
      </main>
    </div>
  )
}
