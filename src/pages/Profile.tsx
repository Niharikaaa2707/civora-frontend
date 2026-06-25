import { useState, useEffect } from 'react'
import { gamificationApi, issuesApi, authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { StatusBadge, SeverityBadge, EmptyState } from '../components/common'
import { tierColor, timeAgo } from '../lib/utils'
import { Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, token, setAuth } = useAuthStore()
  const [stats,       setStats]       = useState<any>(null)
  const [myIssues,    setMyIssues]    = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [missions,    setMissions]    = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, i, lb, m, meRes] = await Promise.all([
          gamificationApi.myStats(),
          issuesApi.list({ limit: 100 }),
          gamificationApi.leaderboard(),
          gamificationApi.missions(),
          authApi.me(),
        ])
        setStats(s.data)
        setMyIssues(i.data.issues.filter((x: any) => x.reporter_id === user?.id))
        setLeaderboard(lb.data)
        setMissions(m.data)
        setAuth(meRes.data, token!)
      } catch {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
    </div>
  )

  const tierIcons: Record<string, string> = {
    Newcomer: '🌱', Scout: '🔭', Watchdog: '🐕', Crusader: '⚔️', Hero: '🏆'
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-slate-100">🏆 My Profile</h1>

      {/* Profile Card */}
      <div className="card flex items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold">
          {user?.name[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-slate-100">{user?.name}</h2>
          <p className="text-slate-400">{user?.email}</p>
          <div className="flex items-center gap-4 mt-2">
            <span className={`font-bold text-lg ${tierColor(user?.tier || '')}`}>
              {tierIcons[user?.tier || 'Newcomer']} {user?.tier}
            </span>
            <span className="flex items-center gap-1 text-yellow-400 font-bold">
              <Zap className="w-4 h-4" /> {user?.xp_points} XP
            </span>
          </div>
        </div>

        {stats?.next_tier && stats.next_tier.xp_needed > 0 && (
          <div className="text-right">
            <div className="text-sm text-slate-400 mb-1">
              Next: {stats.next_tier.icon} {stats.next_tier.name}
            </div>
            <div className="text-xs text-slate-500">
              {stats.next_tier.xp_needed} XP needed
            </div>
            <div className="w-32 bg-slate-700 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, ((user?.xp_points || 0) / stats.next_tier.min_xp) * 100)}%`
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl font-bold text-blue-400">{stats.total_reports}</div>
            <div className="text-slate-400 text-sm mt-1">Total Reports</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-green-400">{stats.resolved}</div>
            <div className="text-slate-400 text-sm mt-1">Resolved</div>
          </div>
          <div className="card text-center">
            <div className="text-3xl font-bold text-red-400">{stats.critical_found}</div>
            <div className="text-slate-400 text-sm mt-1">Critical Found</div>
          </div>
        </div>
      )}

      {/* Badges */}
      {stats?.badges?.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">🎖️ My Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {stats.badges.map((badge: any) => (
              <div key={badge.id} className="bg-slate-700/50 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-medium text-slate-200 text-sm">{badge.name}</div>
                  <div className="text-slate-400 text-xs">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Missions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">⚡ Active Missions</h2>
        {missions.length === 0 ? (
          <p className="text-slate-400 text-sm">No active missions</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {missions.map((mission: any) => (
              <div key={mission.id} className="bg-slate-700/50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{mission.badge_icon}</span>
                  <span className="text-yellow-400 text-xs font-bold">+{mission.xp_reward} XP</span>
                </div>
                <div className="font-semibold text-slate-200">{mission.title}</div>
                <div className="text-slate-400 text-xs mt-1">{mission.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">🏆 City Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <p className="text-slate-400 text-sm">No data yet</p>
        ) : (
          <div className="space-y-2">
            {leaderboard.map((entry: any, i: number) => (
              <div
                key={i}
                className={`flex items-center justify-between p-3 rounded-xl ${
                  entry.name === user?.name
                    ? 'bg-blue-500/20 border border-blue-500/30'
                    : 'bg-slate-700/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl w-8 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                  </span>
                  <div>
                    <div className="font-medium text-slate-200">{entry.name}</div>
                    <div className="text-xs text-slate-400">{entry.tier} · {entry.issues} reports</div>
                  </div>
                </div>
                <div className="text-yellow-400 font-bold">{entry.xp} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Issues */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">📋 My Reports ({myIssues.length})</h2>
        {myIssues.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No reports yet"
            desc="Start reporting civic issues to earn XP and badges!"
          />
        ) : (
          <div className="space-y-3">
            {myIssues.map((issue: any) => (
              <div key={issue.id} className="card flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-mono text-xs">{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                  </div>
                  <div className="font-medium text-slate-200 truncate">{issue.category}</div>
                  <div className="text-slate-500 text-xs mt-1">
                    📍 {issue.location} · {timeAgo(issue.created_at)} · 👍 {issue.upvotes}
                  </div>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}