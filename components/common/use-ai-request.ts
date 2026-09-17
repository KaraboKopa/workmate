'use client'

import { useCallback, useState } from 'react'

type State<T> = {
  data: T | null
  mock: boolean
  loading: boolean
  error: string | null
}

// Small client helper for the structured (non-streaming) AI endpoints. It
// handles loading and error state and surfaces whether the response came from
// demo/mock mode.
export function useAiRequest<T>(endpoint: string) {
  const [state, setState] = useState<State<T>>({
    data: null,
    mock: false,
    loading: false,
    error: null,
  })

  const run = useCallback(
    async (body: unknown) => {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) {
          setState((s) => ({
            ...s,
            loading: false,
            error: json?.error ?? 'Something went wrong. Please try again.',
          }))
          return
        }
        setState({
          data: json.data as T,
          mock: Boolean(json.mock),
          loading: false,
          error: null,
        })
      } catch {
        setState((s) => ({
          ...s,
          loading: false,
          error: 'Network error. Please check your connection and try again.',
        }))
      }
    },
    [endpoint],
  )

  const reset = useCallback(
    () => setState({ data: null, mock: false, loading: false, error: null }),
    [],
  )

  return { ...state, run, reset }
}
