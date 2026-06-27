import { useState, useEffect } from 'react'
import { analyticsApi } from '../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'
import toast from 'react-hot-toast'

const COLORS = ['#f97316','#3b82f6','#eab308','#22c55e','#a855f7','#ec4899']

export default function Analytics() {
  const [summary,    setSummary]    = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [severity,   setSeverity]   = useState<any>({})
  const [predictive, setPredictive] = useState<any>(null)
  const [leaderboard,setLeaderboard]= useState<any[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, sev, p, lb] = await Promise.all([
          analyticsApi.summary(),
          analyticsApi.byCategory(),
          analyticsApi.bySeverity(),
          analyticsApi.predictive(),
          analyticsApi.leaderboard(),
        ])
        setSummary(s.data)
        setCategories(c.data)
        setSeverity(sev.data)
        setPredictive(p.data)
        setLeaderboard(lb.data)
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#f97316' }} />
    </div>
  )

  const severityData = Object.entries(severity).map(([k, v]) => ({ name: k, value: v as number }))

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl px-6 py-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <h1 className="text-xl font-bold text-white">Analytics & Reports</h1>
        <p className="text-slate-300 text-sm mt-0.5">City-wide civic issue statistics and insights</p>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Complaints', value: summary.total, color: '#3b82f6' },
            { label: 'Open Issues', value: summary.open, color: '#ef4444' },
            { label: 'Resolved', value: summary.resolved, color: '#22c55e' },
            { label: 'Resolution Rate', value: `${summary.resolution_rate}%`, color: '#f97316' },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: '#1e293b', border: '1px solid #334155' }}>
              <div className="text-2xl font-bold mb-1" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Category Bar Chart */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#f97316' }}>
            Complaints by Category
          </h2>
          {categories.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categories} margin={{ left: -20 }}>
                <XAxis dataKey="category" tick={{ fill:'#94a3b8', fontSize:9 }} />
                <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} />
                <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', color:'#e2e8f0' }} />
                <Bar dataKey="count" fill="#f97316" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Severity Pie Chart */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: '#f97316' }}>
            Complaints by Severity
          </h2>
          {severityData.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%" cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${((percent ?? 0)*100).toFixed(0)}%`}
                >
                  {severityData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', color:'#e2e8f0' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Predictive Insights */}
      {predictive && (
        <div className="rounded-xl p-5 space-y-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#f97316' }}>
            AI Predictive Insights
          </h2>

          {predictive.alerts?.length > 0 && (
            <div className="space-y-2">
              {predictive.alerts.map((alert: any, i: number) => (
                <div key={i} className={`p-3 rounded-lg text-sm font-medium ${
                  alert.severity === 'HIGH'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: `${predictive.resolution_rate}%`, label: 'Resolution Rate', color: '#f97316' },
              { value: predictive.avg_resolution, label: 'Avg Days to Resolve', color: '#22c55e' },
              { value: predictive.total_issues, label: 'Total Reports', color: '#3b82f6' },
            ].map((s, i) => (
              <div key={i} className="rounded-lg p-3 text-center" style={{ background: '#0f172a' }}>
                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
        <div className="px-5 py-3" style={{ background: '#1e3a5f', borderBottom: '2px solid #f97316' }}>
          <h2 className="text-sm font-bold uppercase tracking-wider text-white">Top Community Contributors</h2>
        </div>
        {leaderboard.length === 0 ? (
          <div className="p-5 text-slate-400 text-sm" style={{ background: '#1e293b' }}>No contributors yet</div>
        ) : (
          <div>
            {leaderboard.map((entry: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3"
                style={{
                  background: i % 2 === 0 ? '#1e293b' : '#1a2538',
                  borderBottom: i < leaderboard.length - 1 ? '1px solid #334155' : 'none'
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

    </div>
  )
}