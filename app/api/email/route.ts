import { generateText, Output } from 'ai'
import { DEFAULT_MODEL, isAIConfigured } from '@/lib/ai/config'
import { buildEmailPrompt } from '@/lib/ai/prompts'
import { emailSchema } from '@/lib/ai/schemas'
import { mockEmail } from '@/lib/ai/mock'

export const maxDuration = 30

export async function POST(req: Request) {
  let body: { instruction?: string; tone?: string; audience?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const instruction = (body.instruction ?? '').trim()
  const tone = body.tone ?? 'formal'
  const audience = body.audience ?? 'colleague'

  if (!instruction) {
    return Response.json(
      { error: 'Please describe the email you want to generate.' },
      { status: 400 },
    )
  }

  if (!isAIConfigured()) {
    return Response.json({ mock: true, data: mockEmail(instruction, tone) })
  }

  try {
    const { instructions, prompt } = buildEmailPrompt({ instruction, tone, audience })
    const { output } = await generateText({
      model: DEFAULT_MODEL,
      instructions,
      prompt,
      output: Output.object({ schema: emailSchema }),
    })
    return Response.json({ mock: false, data: output })
  } catch (error) {
    console.log('[v0] email route error:', error)
    return Response.json(
      { error: 'The AI service could not generate the email. Please try again.' },
      { status: 500 },
    )
  }
}
