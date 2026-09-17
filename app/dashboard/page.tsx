import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import type { FeatureId } from '@/lib/features'

const VALID: FeatureId[] = ['email', 'summary', 'planner', 'research', 'chat']

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ feature?: string }>
}) {
  const { feature } = await searchParams
  const initial = VALID.includes(feature as FeatureId)
    ? (feature as FeatureId)
    : 'email'
  return <DashboardShell initialFeature={initial} />
}
