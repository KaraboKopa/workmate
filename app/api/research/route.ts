import { generateText, Output } from 'ai'
import { DEFAULT_MODEL, isAIConfigured } from '@/lib/ai/config'
import { buildResearchPrompt } from '@/lib/ai/prompts'
import { researchSchema } from '@/lib/ai/schemas'
import { mockResearch } from '@/lib/ai/mock'

export const maxDuration = 30

export async function POST(req: Request) {
  let body: { content?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const content = (body.content ?? '').trim()
  if (content.length < 20) {
    return Response.json(
      { error: 'Please paste research text or describe a topic (a few sentences).' },
      { status: 400 },
    )
  }

  if (!isAIConfigured()) {
    return Response.json({ mock: true, data: mockResearch() })
  }

  try {
    const { instructions, prompt } = buildResearchPrompt(content)
    const { output } = await generateText({
      model: DEFAULT_MODEL,
      instructions,
      prompt,
      output: Output.object({ schema: researchSchema }),
    })
    return Response.json({ mock: false, data: output })
  } catch (error) {
    console.log('[v0] research route error:', error)
    return Response.json(
      { error: 'The AI service could not analyse the material. Please try again.' },
      { status: 500 },
    )
  }
}
