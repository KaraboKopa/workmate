'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Loader2, Send, Sparkles } from 'lucide-react'
import { FeatureHeader } from '@/components/common/feature-ui'
import { AiDisclaimer } from '@/components/common/ai-disclaimer'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const SUGGESTIONS = [
  'How can I run a more effective 30-minute meeting?',
  'Give me a framework to prioritise a busy week.',
  'How do I write a clear status update to my manager?',
]

export function ProductivityChat() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value })
    setInput('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Respect CJK IME composition; only submit on a plain Enter.
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      submit(input)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <FeatureHeader
        title="Productivity Chat"
        description="Ask WorkMate about productivity, communication, planning and everyday work questions."
      />

      <div className="flex h-[60vh] min-h-96 flex-col overflow-hidden rounded-xl border border-border bg-card">
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto p-4"
          aria-live="polite"
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="size-5" aria-hidden="true" />
              </span>
              <p className="max-w-sm text-sm text-muted-foreground text-pretty">
                Start a conversation, or try one of these:
              </p>
              <div className="flex flex-col flex-wrap justify-center gap-2 sm:flex-row">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submit(s)}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user'
            const text = message.parts
              .map((p) => (p.type === 'text' ? p.text : ''))
              .join('')
            return (
              <div
                key={message.id}
                className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
                    isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground',
                  )}
                >
                  {text}
                </div>
              </div>
            )
          })}

          {status === 'submitted' && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Thinking…
              </div>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive"
            >
              Something went wrong. Please try sending your message again.
            </div>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            submit(input)
          }}
          className="flex items-end gap-2 border-t border-border p-3"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a productivity question…  (Enter to send, Shift+Enter for a new line)"
            className="min-h-11 flex-1 resize-none"
            rows={1}
            aria-label="Message"
          />
          <Button
            type="submit"
            size="icon-lg"
            disabled={busy || !input.trim()}
            aria-label="Send message"
          >
            {busy ? <Loader2 className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>

      <AiDisclaimer />
    </div>
  )
}
