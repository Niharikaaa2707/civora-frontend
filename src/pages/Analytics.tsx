import { useState, useEffect } from 'react'
import { analyticsApi } from '../services/api'
import { StatCard } from '../components/common'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, Legend
} from 'recharts'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6','#f97316','#eab308','#22c55e','#a855f7','#ec4899']

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
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
    </div>
  )

  const severityData = Object.entries(severity).map(([k, v]) => ({ name: k, value: v as number }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">📊 Analytics</h1>
        <p className="text-slate-400 mt-1">City-wide civic issue insights</p>
      </div>

      {/* Stats */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total Issues"     value={summary.total}            icon="📋" />
          <StatCard label="Open"             value={summary.open}             icon="🔴" color="text-red-400" />
          <StatCard label="Resolved"         value={summary.resolved}         icon="✅" color="text-green-400" />
          <StatCard label="Resolution Rate"  value={`${summary.resolution_rate}%`} icon="📈" color="text-blue-400" />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Category Bar Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Issues by Category</h2>
          {categories.length === 0 ? (
            <p className="text-slate-400 text-sm">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categories} margin={{ left: -20 }}>
                <XAxis dataKey="category" tick={{ fill:'#94a3b8', fontSize:10 }} />
                <YAxis tick={{ fill:'#94a3b8', fontSize:11 }} />
                <Tooltip
                  contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', color:'#e2e8f0' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Severity Pie Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-100 mb-4">Issues by Severity</h2>
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
                <Tooltip
                  contentStyle={{ background:'#1e293b', border:'1px solid #334155', borderRadius:'8px', color:'#e2e8f0' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Predictive Insights */}
      {predictive && (
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold text-slate-100">🔮 AI Predictive Insights</h2>

          {predictive.alerts?.length > 0 && (
            <div className="space-y-2">
              {predictive.alerts.map((alert: any, i: number) => (
                <div key={i} className={`p-3 rounded-xl text-sm font-medium ${
                  alert.severity === 'HIGH'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                }`}>
                  {alert.message}
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card">
              <div className="text-2xl font-bold text-blue-400">{predictive.resolution_rate}%</div>
              <div className="text-slate-400 text-sm">Resolution Rate</div>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-green-400">{predictive.avg_resolution}</div>
              <div className="text-slate-400 text-sm">Avg Days to Resolve</div>
            </div>
            <div className="card">
              <div className="text-2xl font-bold text-purple-400">{predictive.total_issues}</div>
              <div className="text-slate-400 text-sm">Total Reports</div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="card">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">🏆 Top Community Contributors</h2>
        {leaderboard.length === 0 ? (
          <p className="text-slate-400 text-sm">No contributors yet</p>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-xl">
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
    </div>
  )
}