import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsApi, issuesApi } from '../services/api'
import { SeverityBadge, StatusBadge, EmptyState } from '../components/common'
import { useAuthStore } from '../store/authStore'
import { timeAgo } from '../lib/utils'
import { ArrowRight, Zap, FileText, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'
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
      <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#f97316' }} />
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Welcome Banner */}
      <div className="rounded-xl px-6 py-5 flex items-center justify-between flex-wrap gap-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <div>
          <h1 className="text-xl font-bold text-white">
            Welcome, {user?.name.split(' ')[0]}
          </h1>
          <p className="text-slate-300 text-sm mt-0.5">Citizen Dashboard — Grievance Management Portal</p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid #f97316' }}>
          <Zap className="w-4 h-4" style={{ color: '#f97316' }} />
          <div>
            <div className="text-xs text-slate-300">XP Points</div>
            <div className="font-bold text-white">{user?.xp_points} — {user?.tier}</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Complaints', value: summary.total, icon: <FileText className="w-5 h-5" />, color: '#3b82f6' },
            { label: 'Open Issues', value: summary.open, icon: <AlertCircle className="w-5 h-5" />, color: '#ef4444' },
            { label: 'Resolved', value: summary.resolved, icon: <CheckCircle className="w-5 h-5" />, color: '#22c55e' },
            { label: 'Critical', value: summary.critical, icon: <AlertTriangle className="w-5 h-5" />, color: '#f97316' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <div className="flex items-center justify-between mb-2">
                <div style={{ color: s.color }}>{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
              </div>
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="w-full rounded-full h-1 mt-2" style={{ background: '#334155' }}>
                <div className="h-1 rounded-full" style={{ background: s.color, width: `${Math.min(100, (s.value / Math.max(summary.total, 1)) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resolution Rate */}
      {summary && (
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-white">Overall Resolution Rate</h3>
              <p className="text-slate-400 text-xs mt-0.5">{summary.resolved} out of {summary.total} complaints resolved</p>
            </div>
            <span className="text-2xl font-bold" style={{ color: '#f97316' }}>{summary.resolution_rate}%</span>
          </div>
          <div className="w-full rounded-full h-3" style={{ background: '#334155' }}>
            <div
              className="h-3 rounded-full transition-all"
              style={{ width: `${summary.resolution_rate}%`, background: 'linear-gradient(90deg, #f97316, #ea580c)' }}
            />
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-bold text-white mb-3 uppercase tracking-wider" style={{ color: '#f97316' }}>Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: '📸', label: 'File Complaint', path: '/report', desc: 'Report a new issue' },
            { icon: '🗺️', label: 'Issue Map', path: '/map', desc: 'View on map' },
            { icon: '📊', label: 'Analytics', path: '/analytics', desc: 'View statistics' },
            { icon: '🏆', label: 'Leaderboard', path: '/profile', desc: 'My profile & XP' },
          ].map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              className="rounded-xl p-4 text-left transition-all hover:border-orange-500 group"
              style={{ background: '#1e293b', border: '1px solid #334155' }}
            >
              <span className="text-2xl block mb-2">{a.icon}</span>
              <div className="text-sm font-semibold text-white">{a.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{a.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Issues */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold uppercase tracking-wider" style={{ color: '#f97316' }}>Recent Complaints</h2>
          <button
            onClick={() => navigate('/issues')}
            className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-all"
          >
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {issues.length === 0 ? (
          <EmptyState icon="📋" title="No complaints yet" desc="Be the first to report a civic issue!" />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
            {issues.map((issue: any, idx: number) => (
              <div
                key={issue.id}
                className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-slate-700 transition-all"
                style={{ background: idx % 2 === 0 ? '#1e293b' : '#1a2538', borderBottom: idx < issues.length - 1 ? '1px solid #334155' : 'none' }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold" style={{ color: '#f97316' }}>{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                  </div>
                  <div className="font-medium text-white text-sm truncate">{issue.category}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    📍 {issue.location} · {timeAgo(issue.created_at)}
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