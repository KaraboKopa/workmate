import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import { DEFAULT_MODEL, isAIConfigured } from '@/lib/ai/config'
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompts'
import { MOCK_CHAT_REPLY } from '@/lib/ai/mock'

export const maxDuration = 30

export async function POST(req: Request) {
  let messages: UIMessage[] = []
  try {
    const body = await req.json()
    messages = body.messages ?? []
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  // Demo/mock mode: stream a canned reply using the UI message stream protocol
  // so the client `useChat` hook works identically to live mode.
  if (!isAIConfigured()) {
    const id = crypto.randomUUID()
    const stream = createUIMessageStream({
      execute: ({ writer }) => {
        writer.write({ type: 'start' })
        writer.write({ type: 'text-start', id })
        writer.write({ type: 'text-delta', id, delta: MOCK_CHAT_REPLY })
        writer.write({ type: 'text-end', id })
      },
    })
    return createUIMessageStreamResponse({ stream })
  }

  const result = streamText({
    model: DEFAULT_MODEL,
    instructions: CHAT_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
