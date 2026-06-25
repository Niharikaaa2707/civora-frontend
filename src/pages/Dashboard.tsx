import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsApi, issuesApi } from '../services/api'
import { StatCard, EmptyState, SeverityBadge, StatusBadge } from '../components/common'
import { useAuthStore } from '../store/authStore'
import { timeAgo, tierColor } from '../lib/utils'
import { ArrowRight, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuthStore()
  const navigate  = useNavigate()
  const [summary,  setSummary]  = useState<any>(null)
  const [issues,   setIssues]   = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, i] = await Promise.all([
          analyticsApi.summary(),
          issuesApi.list({ sort: 'newest', limit: 5 }),
        ])
        setSummary(s.data)
        setIssues(i.data.issues)
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            Welcome back, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1">Here's what's happening in your community</p>
        </div>
        <div className="card flex items-center gap-3">
          <div className="text-2xl">
            {{ Newcomer:'🌱', Scout:'🔭', Watchdog:'🐕', Crusader:'⚔️', Hero:'🏆' }[user?.tier || 'Newcomer'] || '🌱'}
          </div>
          <div>
            <div className={`font-bold text-sm ${tierColor(user?.tier || 'Newcomer')}`}>{user?.tier}</div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs">
              <Zap className="w-3 h-3" /> {user?.xp_points} XP
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Issues"    value={summary.total}            icon="📋" />
          <StatCard label="Open Issues"     value={summary.open}             icon="🔴" color="text-red-400" />
          <StatCard label="Resolved"        value={summary.resolved}         icon="✅" color="text-green-400" />
          <StatCard label="Critical"        value={summary.critical}         icon="🚨" color="text-orange-400" />
        </div>
      )}

      {/* Resolution rate */}
      {summary && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-100">Community Impact Score</h3>
            <span className="text-blue-400 font-bold">{summary.resolution_rate}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all"
              style={{ width: `${summary.resolution_rate}%` }}
            />
          </div>
          <p className="text-slate-400 text-sm mt-2">
            {summary.resolved} out of {summary.total} issues resolved
          </p>
        </div>
      )}

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">Recent Reports</h2>
          <button
            onClick={() => navigate('/issues')}
            className="btn-ghost flex items-center gap-1 text-sm"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {issues.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No issues yet"
            desc="Be the first to report a civic issue in your community!"
          />
        ) : (
          <div className="space-y-3">
            {issues.map((issue: any) => (
              <div key={issue.id} className="card-hover flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-mono text-xs">{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                  </div>
                  <div className="font-medium text-slate-200 truncate">{issue.category}</div>
                  <div className="text-slate-500 text-xs mt-1">
                    📍 {issue.location} · {timeAgo(issue.created_at)}
                  </div>
                </div>
                <StatusBadge status={issue.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-slate-100 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: '📸', label: 'Report Issue',     path: '/report' },
            { icon: '🗺️', label: 'View Map',          path: '/map' },
            { icon: '📊', label: 'Analytics',         path: '/analytics' },
            { icon: '🏆', label: 'Leaderboard',       path: '/profile' },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              className="card-hover flex flex-col items-center gap-2 py-6 text-center"
            >
              <span className="text-3xl">{a.icon}</span>
              <span className="text-sm font-medium text-slate-300">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}