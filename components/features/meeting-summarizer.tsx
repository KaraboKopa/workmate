'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { SummaryResult } from '@/lib/ai/schemas'
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
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const SAMPLE = `Weekly product sync — attendees: Priya, Marco, Sam.
Priya shared that onboarding redesign is 70% done. Marco raised that the analytics integration is blocked waiting on API keys. We agreed to launch the beta next Friday. Sam will write the release notes. Someone needs to chase the vendor about the keys. Budget for Q3 was mentioned but not confirmed.`

const SAMPLES = [{ label: 'Load example notes', value: SAMPLE }]

export function MeetingSummarizer() {
  const [notes, setNotes] = useState('')
  const { data, mock, loading, error, run } =
    useAiRequest<SummaryResult>('/api/summarize')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (data) setSummary(data.summary)
  }, [data])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    run({ notes })
  }

  const copyText = data
    ? [
        `Summary:\n${summary}`,
        `Key points:\n${data.keyPoints.map((p) => `- ${p}`).join('\n')}`,
        `Decisions:\n${data.decisions.map((d) => `- ${d}`).join('\n') || '- None stated'}`,
        `Action items:\n${data.actionItems
          .map((a) => `- ${a.task} (Owner: ${a.owner}, Deadline: ${a.deadline})`)
          .join('\n') || '- None'}`,
        `Missing / uncertain:\n${data.missingInfo.map((m) => `- ${m}`).join('\n') || '- None'}`,
      ].join('\n\n')
    : ''

  return (
    <div className="flex flex-col gap-6">
      <FeatureHeader
        title="Meeting Notes Summarizer"
        description="Paste raw meeting notes. WorkMate extracts a summary, decisions, action items with owners and deadlines, and flags anything missing or uncertain."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes">Meeting notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Paste your meeting notes or transcript here…"
            className="min-h-48"
            aria-invalid={Boolean(error)}
          />
        </div>

        <SamplePrompts items={SAMPLES} onSelect={setNotes} />

        {error && <ErrorBanner message={error} />}

        <div>
          <SubmitButton loading={loading} loadingText="Summarising…">
            Summarise notes
          </SubmitButton>
        </div>
      </form>

      {data && (
        <Card>
          <CardContent className="flex flex-col gap-6 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AiGeneratedBadge mock={mock} />
              <CopyButton label="Copy summary" value={copyText} />
            </div>

            <ResultSection title="Summary (editable)">
              <Textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="min-h-24"
                aria-label="Editable summary"
              />
            </ResultSection>

            <div className="grid gap-6 sm:grid-cols-2">
              <ResultSection title="Key points">
                <ResultList items={data.keyPoints} empty="No key points found." />
              </ResultSection>
              <ResultSection title="Decisions">
                <ResultList
                  items={data.decisions}
                  empty="No decisions were explicitly stated."
                />
              </ResultSection>
            </div>

            <ResultSection title="Action items">
              {data.actionItems.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No action items found.
                </p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 font-medium">Task</th>
                        <th className="px-3 py-2 font-medium">Owner</th>
                        <th className="px-3 py-2 font-medium">Deadline</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.actionItems.map((a, i) => (
                        <tr key={i} className="border-t border-border">
                          <td className="px-3 py-2">{a.task}</td>
                          <td className="px-3 py-2">
                            <OwnerCell value={a.owner} />
                          </td>
                          <td className="px-3 py-2">
                            <OwnerCell value={a.deadline} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ResultSection>

            {data.missingInfo.length > 0 && (
              <ResultSection title="Missing or uncertain">
                <div className="flex flex-col gap-2 rounded-lg border border-chart-4/30 bg-chart-4/10 p-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <AlertTriangle className="size-4 text-chart-4" aria-hidden="true" />
                    Review these gaps
                  </div>
                  <ResultList items={data.missingInfo} />
                </div>
              </ResultSection>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function OwnerCell({ value }: { value: string }) {
  const unknown = value.trim().toLowerCase() === 'not specified'
  return (
    <span className={unknown ? 'text-muted-foreground italic' : 'text-foreground'}>
      {value}
    </span>
  )
}
