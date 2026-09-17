import { z } from 'zod'

// Shared, structured output contracts for each AI feature. These are used both
// to constrain the model's response (via the AI SDK `Output.object`) and to
// validate any response before it is displayed on the client.

export const emailToneValues = [
  'formal',
  'informal',
  'friendly',
  'persuasive',
] as const
export const emailAudienceValues = [
  'client',
  'manager',
  'colleague',
  'team',
] as const

export type EmailTone = (typeof emailToneValues)[number]
export type EmailAudience = (typeof emailAudienceValues)[number]

export const emailSchema = z.object({
  subject: z.string().describe('A concise, professional subject line.'),
  body: z
    .string()
    .describe('The full email body including greeting and sign-off.'),
  assumptions: z
    .array(z.string())
    .describe(
      'Any placeholders or assumptions the writer must review, e.g. "[Insert date]". Empty if none.',
    ),
})
export type EmailResult = z.infer<typeof emailSchema>

export const summarySchema = z.object({
  summary: z.string().describe('A concise paragraph summarising the notes.'),
  keyPoints: z.array(z.string()).describe('Main discussion points.'),
  decisions: z
    .array(z.string())
    .describe('Decisions that were explicitly made. Empty if none stated.'),
  actionItems: z
    .array(
      z.object({
        task: z.string(),
        owner: z
          .string()
          .describe('Responsible person, or "Not specified" if unknown.'),
        deadline: z
          .string()
          .describe('Deadline, or "Not specified" if unknown.'),
      }),
    )
    .describe('Concrete action items extracted from the notes.'),
  missingInfo: z
    .array(z.string())
    .describe(
      'Information that is missing, unclear or uncertain in the source notes.',
    ),
})
export type SummaryResult = z.infer<typeof summarySchema>

export const planSchema = z.object({
  blocks: z
    .array(
      z.object({
        period: z
          .string()
          .describe('A day or time block, e.g. "Monday" or "09:00 – 10:30".'),
        tasks: z.array(
          z.object({
            name: z.string(),
            priority: z.enum(['high', 'medium', 'low']),
            duration: z.string().describe('Estimated duration, e.g. "1h".'),
            note: z
              .string()
              .describe('Short rationale for placement or ordering.'),
          }),
        ),
      }),
    )
    .describe('The organised schedule grouped by period.'),
  tips: z.array(z.string()).describe('Time-management improvement suggestions.'),
  warnings: z
    .array(z.string())
    .describe(
      'Warnings about unrealistic load, over-commitment or missing information.',
    ),
})
export type PlanResult = z.infer<typeof planSchema>

export const researchSchema = z.object({
  summary: z.string().describe('A simple, plain-language summary.'),
  keyInsights: z.array(z.string()).describe('The most important insights.'),
  recommendations: z
    .array(z.string())
    .describe('Actionable recommendations grounded only in the provided text.'),
  keyTerms: z
    .array(z.object({ term: z.string(), definition: z.string() }))
    .describe('Important terms with brief definitions.'),
  caveats: z
    .array(z.string())
    .describe(
      'Uncertainties, gaps, or reminders to verify against the original source.',
    ),
})
export type ResearchResult = z.infer<typeof researchSchema>
