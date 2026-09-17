'use client'

import { useEffect, useState } from 'react'
import { BadgeCheck } from 'lucide-react'
import type { ResearchResult } from '@/lib/ai/schemas'
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

const SAMPLE = `Remote work has reshaped how teams collaborate. Studies referenced internally suggest asynchronous communication reduces meeting load but can slow decision-making when expectations are unclear. Teams that document decisions and set clear response-time norms tend to report higher satisfaction. However, onboarding new hires remotely remains a challenge, and informal knowledge sharing declines without deliberate effort.`

const SAMPLES = [{ label: 'Load example text', value: SAMPLE }]

export function ResearchAssistant() {
  const [content, setContent] = useState('')
  const { data, mock, loading, error, run } =
    useAiRequest<ResearchResult>('/api/research')
  const [summary, setSummary] = useState('')

  useEffect(() => {
    if (data) setSummary(data.summary)
  }, [data])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    run({ content })
  }

  const copyText = data
    ? [
        `Summary:\n${summary}`,
        `Key insights:\n${data.keyInsights.map((i) => `- ${i}`).join('\n')}`,
        `Recommendations:\n${data.recommendations.map((r) => `- ${r}`).join('\n')}`,
        `Key terms:\n${data.keyTerms.map((t) => `- ${t.term}: ${t.definition}`).join('\n')}`,
      ].join('\n\n')
    : ''

  return (
    <div className="flex flex-col gap-6">
      <FeatureHeader
        title="AI Research Assistant"
        description="Paste an article, notes or a topic. WorkMate produces a plain-language summary, insights, recommendations and key terms — grounded only in what you provide."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="content">Research text or topic</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the text you want to understand, or describe a topic…"
            className="min-h-48"
            aria-invalid={Boolean(error)}
          />
        </div>

        <SamplePrompts items={SAMPLES} onSelect={setContent} />

        {error && <ErrorBanner message={error} />}

        <div>
          <SubmitButton loading={loading} loadingText="Analysing…">
            Analyse material
          </SubmitButton>
        </div>
      </form>

      {data && (
        <Card>
          <CardContent className="flex flex-col gap-6 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AiGeneratedBadge mock={mock} />
              <CopyButton label="Copy analysis" value={copyText} />
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
              <ResultSection title="Key insights">
                <ResultList items={data.keyInsights} empty="No insights found." />
              </ResultSection>
              <ResultSection title="Recommendations">
                <ResultList
                  items={data.recommendations}
                  empty="No recommendations available."
                />
              </ResultSection>
            </div>

            {data.keyTerms.length > 0 && (
              <ResultSection title="Key terms">
                <dl className="grid gap-3 sm:grid-cols-2">
                  {data.keyTerms.map((t, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-border bg-muted/40 p-3"
                    >
                      <dt className="text-sm font-semibold">{t.term}</dt>
                      <dd className="mt-0.5 text-sm text-muted-foreground text-pretty">
                        {t.definition}
                      </dd>
                    </div>
                  ))}
                </dl>
              </ResultSection>
            )}

            <div className="flex items-start gap-2.5 rounded-lg border border-chart-2/30 bg-chart-2/10 p-3 text-sm">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-chart-2" aria-hidden="true" />
              <div className="flex flex-col gap-1">
                <span className="font-medium">Verify against the source</span>
                <ResultList
                  items={
                    data.caveats.length > 0
                      ? data.caveats
                      : ['Always verify these points against the original source.']
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
