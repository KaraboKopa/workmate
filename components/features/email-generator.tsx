'use client'

import { useEffect, useState } from 'react'
import type { EmailResult } from '@/lib/ai/schemas'
import { emailToneValues, emailAudienceValues } from '@/lib/ai/schemas'
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
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

const SAMPLES = [
  {
    label: 'Reschedule a meeting',
    value:
      'Ask to move tomorrow\'s 2pm project sync to Thursday morning because of a scheduling conflict, and offer two alternative times.',
  },
  {
    label: 'Follow up on a proposal',
    value:
      'Politely follow up with a client who received our proposal last week and has not yet responded.',
  },
  {
    label: 'Thank the team',
    value:
      'Thank the team for shipping the release on time and highlight two things that went well.',
  },
]

export function EmailGenerator() {
  const [instruction, setInstruction] = useState('')
  const [tone, setTone] = useState<string>('formal')
  const [audience, setAudience] = useState<string>('client')
  const { data, mock, loading, error, run } = useAiRequest<EmailResult>('/api/email')

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (data) {
      setSubject(data.subject)
      setBody(data.body)
    }
  }, [data])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    run({ instruction, tone, audience })
  }

  return (
    <div className="flex flex-col gap-6">
      <FeatureHeader
        title="Smart Email Generator"
        description="Describe what you need to say. WorkMate drafts a professional email with a subject line — fully editable before you send."
      />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tone">Tone</Label>
            <Select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              {emailToneValues.map((t) => (
                <option key={t} value={t}>
                  {t[0].toUpperCase() + t.slice(1)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="audience">Audience</Label>
            <Select
              id="audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              {emailAudienceValues.map((a) => (
                <option key={a} value={a}>
                  {a[0].toUpperCase() + a.slice(1)}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="instruction">What should the email say?</Label>
          <Textarea
            id="instruction"
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="e.g. Ask the client to confirm the updated timeline and share the revised budget."
            className="min-h-28"
            aria-invalid={Boolean(error)}
          />
        </div>

        <SamplePrompts items={SAMPLES} onSelect={setInstruction} />

        {error && <ErrorBanner message={error} />}

        <div>
          <SubmitButton loading={loading}>Generate email</SubmitButton>
        </div>
      </form>

      {data && (
        <Card>
          <CardContent className="flex flex-col gap-5 pt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <AiGeneratedBadge mock={mock} />
              <CopyButton
                label="Copy email"
                value={`Subject: ${subject}\n\n${body}`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="out-subject">Subject</Label>
              <Input
                id="out-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="out-body">Body (editable)</Label>
                <CopyButton label="Copy body" value={body} />
              </div>
              <Textarea
                id="out-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-64 font-normal"
              />
            </div>

            {data.assumptions.length > 0 && (
              <ResultSection title="Review before sending">
                <ResultList items={data.assumptions} />
              </ResultSection>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
