import type {
  EmailResult,
  PlanResult,
  ResearchResult,
  SummaryResult,
} from './schemas'

// Deterministic, clearly-labelled demo responses used when no AI Gateway key
// is configured. They let the full interface be demonstrated without a live
// model. Every payload states that it is demo output.

const DEMO_NOTE = '(Demo mode — this is sample output, not a live AI response.)'

export function mockEmail(instruction: string, tone: string): EmailResult {
  return {
    subject: `Follow-up: ${instruction.slice(0, 40) || 'Your request'}`,
    body: `Hi [Recipient name],

${DEMO_NOTE}

I hope you're doing well. I'm writing regarding "${instruction || 'your request'}". This is a ${tone} draft generated in demo mode to illustrate the layout of a generated email.

Please let me know if you'd like any changes.

Best regards,
[Your name]`,
    assumptions: [
      'Recipient name is a placeholder — replace [Recipient name].',
      'Your name is a placeholder — replace [Your name].',
    ],
  }
}

export function mockSummary(): SummaryResult {
  return {
    summary: `${DEMO_NOTE} The team reviewed project progress, agreed on the next milestone, and assigned follow-up tasks.`,
    keyPoints: [
      'Reviewed current sprint progress',
      'Discussed the upcoming release timeline',
      'Raised a concern about resourcing',
    ],
    decisions: ['Proceed with the release on the agreed date'],
    actionItems: [
      { task: 'Prepare release notes', owner: 'Not specified', deadline: 'Friday' },
      { task: 'Confirm QA coverage', owner: 'Alex', deadline: 'Not specified' },
    ],
    missingInfo: [
      'No owner was stated for the release notes task.',
      'The exact release date was referenced but not written down.',
    ],
  }
}

export function mockPlan(horizon: string): PlanResult {
  return {
    blocks: [
      {
        period: horizon === 'weekly' ? 'Monday' : '09:00 – 10:30',
        tasks: [
          {
            name: 'High-priority deliverable',
            priority: 'high',
            duration: '1h 30m',
            note: 'Scheduled first while focus is highest.',
          },
        ],
      },
      {
        period: horizon === 'weekly' ? 'Tuesday' : '11:00 – 12:00',
        tasks: [
          {
            name: 'Review and email follow-ups',
            priority: 'medium',
            duration: '1h',
            note: 'Batched to reduce context switching.',
          },
        ],
      },
    ],
    tips: [
      `${DEMO_NOTE}`,
      'Batch similar tasks to reduce context switching.',
      'Protect one focus block per day for deep work.',
    ],
    warnings: [
      'Demo schedule — verify durations against your real availability.',
    ],
  }
}

export function mockResearch(): ResearchResult {
  return {
    summary: `${DEMO_NOTE} The material discusses a topic and outlines a few supporting points and takeaways.`,
    keyInsights: [
      'The main argument is stated clearly in the opening.',
      'Supporting points build toward a practical conclusion.',
    ],
    recommendations: [
      'Consider how the main takeaway applies to your context.',
    ],
    keyTerms: [
      { term: 'Key term', definition: 'A brief definition drawn from the text.' },
    ],
    caveats: [
      'This is demo output. Always verify insights against the original source.',
    ],
  }
}

export const MOCK_CHAT_REPLY = `Demo mode is active because no AI Gateway key is configured, so I'm returning a sample reply.

In live mode I can help you draft messages, plan your day, summarise meetings and answer workplace productivity questions. Add an AI Gateway key to enable real responses.

Remember to review any AI-generated content before using it professionally.`
