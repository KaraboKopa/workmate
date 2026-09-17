import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CheckCircle2,
  FileText,
  Mail,
  MessagesSquare,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { FEATURES, type FeatureId } from '@/lib/features'
import { Logo } from '@/components/common/logo'
import { AiDisclaimer } from '@/components/common/ai-disclaimer'
import { Card, CardContent } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const ICONS: Record<FeatureId, LucideIcon> = {
  email: Mail,
  summary: FileText,
  planner: CalendarClock,
  research: BookOpen,
  chat: MessagesSquare,
}

const STEPS = [
  {
    title: 'Pick a tool',
    body: 'Choose email, meeting notes, planning, research or open chat from the dashboard.',
  },
  {
    title: 'Add your input',
    body: 'Describe what you need or paste your content. Use a sample prompt to see it work.',
  },
  {
    title: 'Review and edit',
    body: 'Every result is editable and clearly labelled. Verify it, tweak it, then copy it out.',
  },
]

const BENEFITS = [
  'Save time on repetitive writing and planning',
  'Consistent, professional tone across communication',
  'Structured outputs with owners, deadlines and priorities',
  'Responsible-AI guardrails that flag what is missing',
  'Works on mobile, tablet and desktop',
  'Demo mode so it runs even without an API key',
]

export function LandingPage() {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link
              href="/dashboard?feature=chat"
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }), 'hidden sm:inline-flex')}
            >
              Try the chat
            </Link>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }))}
            >
              Open dashboard
              <ArrowRight />
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            AI productivity, built responsibly
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl md:text-6xl">
            Your AI-powered workplace productivity assistant
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground text-pretty sm:text-lg">
            WorkMate AI helps you draft emails, summarise meetings, plan your
            day and understand research — with clear, editable results and
            responsible-AI guardrails at every step.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'h-11 px-6 text-base')}
            >
              Get started
              <ArrowRight />
            </Link>
            <Link
              href="/dashboard?feature=email"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'h-11 px-6 text-base')}
            >
              Generate an email
            </Link>
          </div>
          <AiDisclaimer className="mt-4 max-w-2xl text-left" />
        </section>

        {/* Features */}
        <section
          aria-labelledby="features-heading"
          className="mx-auto max-w-6xl px-4 py-8 sm:px-6"
        >
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h2 id="features-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Five tools, one assistant
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground text-pretty">
              Purpose-built features for the tasks professionals do every day.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = ICONS[f.id]
              return (
                <Link
                  key={f.id}
                  href={`/dashboard?feature=${f.id}`}
                  className="group rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                >
                  <Card className="h-full transition-colors group-hover:border-primary/40">
                    <CardContent className="flex flex-col gap-3 pt-5">
                      <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-semibold">{f.name}</h3>
                        <p className="text-xs font-medium text-primary">
                          {f.tagline}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground text-pretty">
                        {f.description}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        Open
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section
          aria-labelledby="how-heading"
          className="mx-auto max-w-6xl px-4 py-12 sm:px-6"
        >
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h2 id="how-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Card key={step.title}>
                <CardContent className="flex flex-col gap-2 pt-5">
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    {step.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits + Responsible AI */}
        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Why WorkMate AI
              </h2>
              <ul className="flex flex-col gap-3">
                {BENEFITS.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-chart-3" aria-hidden="true" />
                    <span className="text-pretty">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="bg-muted/40">
              <CardContent className="flex flex-col gap-4 pt-5">
                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-semibold">Responsible by design</h3>
                <p className="text-sm text-muted-foreground text-pretty">
                  WorkMate never invents facts, names, dates or sources. It tells
                  you when information is missing, labels all AI-generated content,
                  and keeps every result editable so you stay in control.
                </p>
                <AiDisclaimer />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-border bg-card px-6 py-12 text-center shadow-sm">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              Ready to work smarter?
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground text-pretty">
              Jump into the dashboard and try any tool in seconds — no setup
              required.
            </p>
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: 'default', size: 'lg' }), 'h-11 px-6 text-base')}
            >
              Open the dashboard
              <ArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <Logo />
          <p>Built as a workplace productivity prototype. Review AI output before use.</p>
        </div>
      </footer>
    </div>
  )
}
