'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyButton({
  value,
  label = 'Copy',
  className,
}: {
  value: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
      aria-label={copied ? 'Copied to clipboard' : `${label} to clipboard`}
    >
      {copied ? (
        <Check className="text-chart-3" aria-hidden="true" />
      ) : (
        <Copy aria-hidden="true" />
      )}
      {copied ? 'Copied' : label}
    </Button>
  )
}
