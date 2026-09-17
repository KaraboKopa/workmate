import { generateText, Output } from 'ai'
import { DEFAULT_MODEL, isAIConfigured } from '@/lib/ai/config'
import { buildPlanPrompt } from '@/lib/ai/prompts'
import { planSchema } from '@/lib/ai/schemas'
import { mockPlan } from '@/lib/ai/mock'

export const maxDuration = 30

export async function POST(req: Request) {
  let body: { tasks?: string; horizon?: string }
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const tasks = (body.tasks ?? '').trim()
  const horizon = body.horizon === 'weekly' ? 'weekly' : 'daily'

  if (!tasks) {
    return Response.json(
      { error: 'Please list the tasks you want to plan.' },
      { status: 400 },
    )
  }

  if (!isAIConfigured()) {
    return Response.json({ mock: true, data: mockPlan(horizon) })
  }

  try {
    const { instructions, prompt } = buildPlanPrompt({ tasks, horizon })
    const { output } = await generateText({
      model: DEFAULT_MODEL,
      instructions,
      prompt,
      output: Output.object({ schema: planSchema }),
    })
    return Response.json({ mock: false, data: output })
  } catch (error) {
    console.log('[v0] plan route error:', error)
    return Response.json(
      { error: 'The AI service could not build the plan. Please try again.' },
      { status: 500 },
    )
  }
}
