// Central AI configuration. The model is referenced as a plain Vercel AI
// Gateway model id ("provider/model"); no provider SDK or API key handling is
// needed in application code — the runtime supplies Gateway auth automatically.
export const DEFAULT_MODEL = 'openai/gpt-4.1-mini'

// When no AI Gateway key is present (e.g. local dev without configuration),
// the app falls back to a clearly labelled demo/mock mode so the interface can
// still be demonstrated end to end.
export function isAIConfigured(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY)
}
