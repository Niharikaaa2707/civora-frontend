import { useState, useEffect } from 'react'
import { gamificationApi, issuesApi, authApi } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { StatusBadge, SeverityBadge, EmptyState } from '../components/common'
import { timeAgo } from '../lib/utils'
import { Zap, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Profile() {
  const { user, token, setAuth, logout } = useAuthStore()
  const navigate = useNavigate()
  const [stats,       setStats]       = useState<any>(null)
  const [myIssues,    setMyIssues]    = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [missions,    setMissions]    = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [deleting,    setDeleting]    = useState(false)

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

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone. All your complaints will also be deleted.')) return
    if (!confirm('Final confirmation — Delete account permanently?')) return
    setDeleting(true)
    try {
      await authApi.deleteAccount()
      logout()
      toast.success('Account deleted successfully!')
      navigate('/')
    } catch (err: any) {
      toast.error('Failed to delete account')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#f97316' }} />
    </div>
  )

  const tierIcons: Record<string, string> = {
    Newcomer: '🌱', Scout: '🔭', Watchdog: '🐕', Crusader: '⚔️', Hero: '🏆'
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl px-6 py-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <h1 className="text-xl font-bold text-white">My Profile</h1>
        <p className="text-slate-300 text-sm mt-0.5">Citizen account & grievance history</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0" style={{ background: '#f97316' }}>
            {user?.name[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400 text-sm">{user?.email}</p>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <span className="text-sm font-semibold text-white">
                {tierIcons[user?.tier || 'Newcomer']} {user?.tier}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold" style={{ color: '#f97316' }}>
                <Zap className="w-4 h-4" /> {user?.xp_points} XP
              </span>
            </div>
          </div>

          {stats?.next_tier && stats.next_tier.xp_needed > 0 && (
            <div className="w-full sm:w-40">
              <div className="text-xs text-slate-400 mb-1">
                Next: {stats.next_tier.icon} {stats.next_tier.name}
              </div>
              <div className="text-xs text-slate-500 mb-2">
                {stats.next_tier.xp_needed} XP needed
              </div>
              <div className="w-full rounded-full h-2" style={{ background: '#334155' }}>
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.min(100, ((user?.xp_points || 0) / stats.next_tier.min_xp) * 100)}%`,
                    background: '#f97316'
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Reports', value: stats.total_reports, color: '#3b82f6' },
            { label: 'Resolved', value: stats.resolved, color: '#22c55e' },
            { label: 'Critical Found', value: stats.critical_found, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Badges */}
      {stats?.badges?.length > 0 && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
          <div className="px-5 py-3" style={{ background: '#1e3a5f', borderBottom: '2px solid #f97316' }}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">My Badges</h2>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3" style={{ background: '#1e293b' }}>
            {stats.badges.map((badge: any) => (
              <div key={badge.id} className="rounded-lg p-3 flex items-center gap-3" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="font-medium text-white text-sm">{badge.name}</div>
                  <div className="text-slate-400 text-xs">{badge.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Missions */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
        <div className="px-5 py-3" style={{ background: '#1e3a5f', borderBottom: '2px solid #f97316' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Active Missions</h2>
        </div>
        <div className="p-4" style={{ background: '#1e293b' }}>
          {missions.length === 0 ? (
            <p className="text-slate-400 text-sm">No active missions</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {missions.map((mission: any) => (
                <div key={mission.id} className="rounded-lg p-4" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{mission.badge_icon}</span>
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(249,115,22,0.15)', color: '#f97316' }}>
                      +{mission.xp_reward} XP
                    </span>
                  </div>
                  <div className="font-semibold text-white text-sm">{mission.title}</div>
                  <div className="text-slate-400 text-xs mt-1">{mission.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
        <div className="px-5 py-3" style={{ background: '#1e3a5f', borderBottom: '2px solid #f97316' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">City Leaderboard</h2>
        </div>
        {leaderboard.length === 0 ? (
          <div className="p-5 text-slate-400 text-sm" style={{ background: '#1e293b' }}>No data yet</div>
        ) : (
          <div>
            {leaderboard.map((entry: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: entry.name === user?.name ? 'rgba(249,115,22,0.1)' : i % 2 === 0 ? '#1e293b' : '#1a2538',
                  borderBottom: i < leaderboard.length - 1 ? '1px solid #334155' : 'none',
                  borderLeft: entry.name === user?.name ? '3px solid #f97316' : '3px solid transparent'
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg w-8 text-center">
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                  </span>
                  <div>
                    <div className="font-medium text-white text-sm">{entry.name}</div>
                    <div className="text-xs text-slate-400">{entry.tier} · {entry.issues} reports</div>
                  </div>
                </div>
                <div className="font-bold text-sm" style={{ color: '#f97316' }}>{entry.xp} XP</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Issues */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#f97316' }}>
          My Complaints ({myIssues.length})
        </h2>
        {myIssues.length === 0 ? (
          <EmptyState icon="📋" title="No complaints yet" desc="Start reporting civic issues to earn XP and badges!" />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
            {myIssues.map((issue: any, idx: number) => (
              <div
                key={issue.id}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: idx % 2 === 0 ? '#1e293b' : '#1a2538',
                  borderBottom: idx < myIssues.length - 1 ? '1px solid #334155' : 'none'
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold" style={{ color: '#f97316' }}>{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                  </div>
                  <div className="font-medium text-white text-sm truncate">{issue.category}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    📍 {issue.location} · {timeAgo(issue.created_at)} · 👍 {issue.upvotes}
                  </div>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Danger Zone — Delete Account */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #ef4444' }}>
        <div className="px-5 py-3" style={{ background: 'rgba(239,68,68,0.1)', borderBottom: '1px solid #ef4444' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-red-400">Danger Zone</h2>
        </div>
        <div className="p-5 flex items-center justify-between gap-4 flex-wrap" style={{ background: '#1e293b' }}>
          <div>
            <div className="font-semibold text-white text-sm">Delete Account</div>
            <div className="text-slate-400 text-xs mt-0.5">Permanently delete your account and all your complaints. This cannot be undone.</div>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: '#ef4444' }}
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Deleting...' : 'Delete Account'}
          </button>
        </div>
      </div>

    </div>
  )
}