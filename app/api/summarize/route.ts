import { generateText, Output } from 'ai'
import { DEFAULT_MODEL, isAIConfigured } from '@/lib/ai/config'
import { buildSummaryPrompt } from '@/lib/ai/prompts'
import { summarySchema } from '@/lib/ai/schemas'
import { mockSummary } from '@/lib/ai/mock'

export const maxDuration = 30

export async function POST(req: Request) {
  let body: { notes?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const notes = (body.notes ?? '').trim()
  if (notes.length < 20) {
    return Response.json(
      { error: 'Please paste meeting notes (at least a couple of sentences).' },
      { status: 400 },
    )
  }

  if (!isAIConfigured()) {
    return Response.json({ mock: true, data: mockSummary() })
  }

  try {
    const { instructions, prompt } = buildSummaryPrompt(notes)
    const { output } = await generateText({
      model: DEFAULT_MODEL,
      instructions,
      prompt,
      output: Output.object({ schema: summarySchema }),
    })
    return Response.json({ mock: false, data: output })
  } catch (error) {
    console.log('[v0] summarize route error:', error)
    return Response.json(
      { error: 'The AI service could not summarise the notes. Please try again.' },
      { status: 500 },
    )
  }
}
