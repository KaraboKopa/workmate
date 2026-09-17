// Shared feature metadata used by the landing page and dashboard navigation.
export type FeatureId = 'email' | 'summary' | 'planner' | 'research' | 'chat'

export type Feature = {
  id: FeatureId
  name: string
  tagline: string
  description: string
  icon: 'mail' | 'notes' | 'planner' | 'research' | 'chat'
}

export const FEATURES: Feature[] = [
  {
    id: 'email',
    name: 'Email Generator',
    tagline: 'Draft professional emails in seconds',
    description:
      'Turn a short instruction into a polished email with the right tone and audience, ready to copy and edit.',
    icon: 'mail',
  },
  {
    id: 'summary',
    name: 'Meeting Summarizer',
    tagline: 'Turn messy notes into clear outcomes',
    description:
      'Summarise long meeting notes and extract decisions, action items, owners and deadlines — flagging anything missing.',
    icon: 'notes',
  },
  {
    id: 'planner',
    name: 'Task Planner',
    tagline: 'Organise your day or week realistically',
    description:
      'Prioritise tasks by urgency and importance into a realistic daily or weekly plan with time-management tips.',
    icon: 'planner',
  },
  {
    id: 'research',
    name: 'Research Assistant',
    tagline: 'Summarise and understand any material',
    description:
      'Summarise pasted text or a topic, extract insights, recommendations and key terms — without inventing sources.',
    icon: 'research',
  },
  {
    id: 'chat',
    name: 'Productivity Chat',
    tagline: 'Ask anything about working smarter',
    description:
      'An interactive assistant for workplace productivity, communication and planning questions.',
    icon: 'chat',
  },
]

export const FEATURE_MAP: Record<FeatureId, Feature> = Object.fromEntries(
  FEATURES.map((f) => [f.id, f]),
) as Record<FeatureId, Feature>
