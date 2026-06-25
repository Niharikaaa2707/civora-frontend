export interface Issue {
  id: string
  title: string
  description: string
  category: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: string
  location: string
  lat: string
  lon: string
  ward: string
  reporter_id: string
  reporter_name: string
  department: string
  ai_analysis: any
  ai_confidence: number
  priority_score: number
  upvotes: number
  upvoted_by: string[]
  image_b64: string
  duplicate_of: string | null
  sla_days: number
  created_at: string
  resolved_at: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  xp_points: number
  tier: string
  badges: string[]
}

export interface AnalyticsSummary {
  total: number
  open: number
  resolved: number
  critical: number
  resolution_rate: number
  resolved_today: number
}

export interface LeaderboardEntry {
  name: string
  xp: number
  tier: string
  badges: number
  issues: number
}

export interface Mission {
  id: string
  title: string
  description: string
  target_action: string
  category: string
  target_count: number
  xp_reward: number
  badge_icon: string
  active: boolean
}