'use client'

import { useState } from 'react'
import { AlertTriangle, Lightbulb } from 'lucide-react'
import type { PlanResult } from '@/lib/ai/schemas'
import { useAiRequest } from '@/components/common/use-ai-request'
import {
  ErrorBanner,
  FeatureHeader,
  ResultList,
  ResultSection,
  SamplePrompts,
  SubmitButton,
} from '@/components/common/feature-ui'
import { AiGeneratedBadge } from '@/components/common/ai-disclaimer'
import { CopyButton } from '@/components/common/copy-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

const SAMPLE = `- Finish Q3 report (high priority, ~3h, due tomorrow)
- Reply to client emails (medium, ~45m)
- Prepare slides for Thursday demo (high, ~2h, due Wednesday)
- Team 1:1s (2 x 30m)
- Review pull requests (low, ~1h)
- Gym / lunch break`

const SAMPLES = [{ label: 'Load example tasks', value: SAMPLE }]

const priorityVariant = {
  high: 'priorityHigh',
  medium: 'priorityMedium',
  low: 'priorityLow',
} as const

export function TaskPlanner() {
  const [tasks, setTasks] = useState('')
  const [horizon, setHorizon] = useState('daily')
  const { data, mock, loading, error, run } = useAiRequest<PlanResult>('/api/plan')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    run({ tasks, horizon })
  }

  const copyText = data
    ? data.blocks
        .map(
          (b) =>
            `${b.period}\n${b.tasks
              .map((t) => `  - [${t.priority}] ${t.name} (${t.duration}) — ${t.note}`)
              .join('\n')}`,
        )
        .join('\n\n')
    : ''

  return (
    <div className="flex flex-col gap-6">
      <FeatureHeader
        title="AI Task Planner"
        description="List your tasks with any deadlines, durations and priorities. WorkMate builds a realistic, prioritised plan and suggests time-management improvements."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5 sm:max-w-48">
          <Label htmlFor="horizon">Plan for</Label>
          <Select
            id="horizon"
            value={horizon}
            onChange={(e) => setHorizon(e.target.value)}
          >
            <option value="daily">A single day</option>
            <option value="weekly">The week</option>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tasks">Your tasks</Label>
          <Textarea
            id="tasks"
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            placeholder="One task per line. Include priority, duration and deadline where you can."
            className="min-h-40"
            aria-invalid={Boolean(error)}
          />
        </div>

        <SamplePrompts items={SAMPLES} onSelect={setTasks} />

        {error && <ErrorBanner message={error} />}

        <div>
          <SubmitButton loading={loading} loadingText="Planning…">
            Build my plan
          </SubmitButton>
        </div>
      </form>

      {data && (
        <Card>
          <CardContent className="flex flex-col gap-6 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AiGeneratedBadge mock={mock} />
              <CopyButton label="Copy plan" value={copyText} />
            </div>

            <div className="flex flex-col gap-4">
              {data.blocks.map((block, i) => (
                <div key={i} className="rounded-lg border border-border">
                  <div className="border-b border-border bg-muted/50 px-4 py-2 text-sm font-semibold">
                    {block.period}
                  </div>
                  <ul className="divide-y divide-border">
                    {block.tasks.map((t, j) => (
                      <li key={j} className="flex flex-col gap-1 px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={priorityVariant[t.priority]}>
                            {t.priority}
                          </Badge>
                          <span className="font-medium">{t.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {t.duration}
                          </span>
                        </div>
                        {t.note && (
                          <p className="text-sm text-muted-foreground text-pretty">
                            {t.note}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {data.tips.length > 0 && (
              <ResultSection title="Time-management tips">
                <div className="flex flex-col gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Lightbulb className="size-4 text-primary" aria-hidden="true" />
                    Suggestions
                  </div>
                  <ResultList items={data.tips} />
                </div>
              </ResultSection>
            )}

            {data.warnings.length > 0 && (
              <ResultSection title="Heads up">
                <div className="flex flex-col gap-2 rounded-lg border border-chart-4/30 bg-chart-4/10 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <AlertTriangle className="size-4 text-chart-4" aria-hidden="true" />
                    Realism check
                  </div>
                  <ResultList items={data.warnings} />
                </div>
              </ResultSection>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
