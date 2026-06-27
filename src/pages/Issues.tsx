import { useState, useEffect } from 'react'
import { issuesApi } from '../services/api'
import { SeverityBadge, StatusBadge, EmptyState } from '../components/common'
import { timeAgo } from '../lib/utils'
import { ThumbsUp, Filter, ChevronDown, ChevronUp, Trash2 } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['PENDING_REVIEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED']

export default function Issues() {
  const { user }  = useAuthStore()
  const [issues,  setIssues]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [sort,    setSort]    = useState('newest')
  const [status,  setStatus]  = useState('')
  const [severity,setSeverity]= useState('')
  const [changingStatus, setChangingStatus] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const params: any = { sort, limit: 50 }
      if (status)   params.status   = status
      if (severity) params.severity = severity
      const res = await issuesApi.list(params)
      setIssues(res.data.issues)
    } catch {
      toast.error('Failed to load issues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [sort, status, severity])

  const handleUpvote = async (issueId: string) => {
    try {
      await issuesApi.validate(issueId, 'upvote')
      toast.success('Vote recorded! +3 XP')
      load()
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Already voted')
    }
  }

  const handleStatusChange = async (issueId: string, newStatus: string) => {
    try {
      await issuesApi.updateStatus(issueId, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      setChangingStatus(null)
      load()
    } catch (err: any) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (issueId: string) => {
    if (!confirm('Are you sure you want to delete this complaint?')) return
    try {
      await issuesApi.delete(issueId)
      toast.success('Complaint deleted!')
      load()
    } catch (err: any) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl px-6 py-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <h1 className="text-xl font-bold text-white">Community Grievance Board</h1>
        <p className="text-slate-300 text-sm mt-0.5">All civic complaints — upvote to raise priority</p>
      </div>

      {/* Filters */}
      <div className="rounded-xl p-4 flex flex-wrap items-center gap-3" style={{ background: '#1e293b', border: '1px solid #334155' }}>
        <Filter className="w-4 h-4 text-slate-400" />
        <select className="input w-auto text-sm" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Most Recent</option>
          <option value="upvotes">Most Upvoted</option>
          <option value="priority">Highest Priority</option>
          <option value="critical">Critical First</option>
        </select>
        <select className="input w-auto text-sm" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select className="input w-auto text-sm" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <span className="text-xs text-slate-400 ml-auto">{issues.length} complaints</span>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#f97316' }} />
        </div>
      ) : issues.length === 0 ? (
        <EmptyState icon="🏙️" title="No complaints found" desc="No complaints match your filters." />
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
          {issues.map((issue: any, idx: number) => (
            <div
              key={issue.id}
              style={{
                background: idx % 2 === 0 ? '#1e293b' : '#1a2538',
                borderBottom: idx < issues.length - 1 ? '1px solid #334155' : 'none'
              }}
            >
              <div className="flex items-start gap-4 px-4 py-4">
                <div className="flex-1 min-w-0">

                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs font-bold" style={{ color: '#f97316' }}>{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                    <StatusBadge status={issue.status} />
                    {issue.severity === 'CRITICAL' && (
                      <span className="text-red-400 text-xs font-bold">🚨 CRITICAL</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-white text-sm">{issue.category}</h3>
                  <p className="text-slate-400 text-xs mt-1 line-clamp-2">{issue.description}</p>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-slate-500">
                    <span>📍 {issue.location}</span>
                    <span>🕒 {timeAgo(issue.created_at)}</span>
                    <span>🏢 {issue.department}</span>
                    <span>👤 {issue.reporter_name}</span>
                    <span>🎯 Priority: {issue.priority_score}/10</span>
                  </div>

                  {/* Expand */}
                  <button
                    onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                    className="flex items-center gap-1 text-xs font-medium mt-2 hover:underline"
                    style={{ color: '#f97316' }}
                  >
                    {expandedId === issue.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expandedId === issue.id ? 'Show Less' : 'View Details & Resolution Plan'}
                  </button>

                  {/* Expanded */}
                  {expandedId === issue.id && (
                    <div className="mt-4 space-y-3 pt-4" style={{ borderTop: '1px solid #334155' }}>

                      {issue.risk_description && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          <div className="text-xs font-semibold text-red-400 mb-1">⚠️ Risk Assessment</div>
                          <p className="text-slate-300 text-sm">{issue.risk_description}</p>
                        </div>
                      )}

                      {issue.severity_reason && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
                          <div className="text-xs font-semibold mb-1" style={{ color: '#f97316' }}>📊 Severity Reason</div>
                          <p className="text-slate-300 text-sm">{issue.severity_reason}</p>
                        </div>
                      )}

                      {issue.immediate_action && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
                          <div className="text-xs font-semibold text-yellow-400 mb-1">⚡ Immediate Action Required</div>
                          <p className="text-slate-300 text-sm">{issue.immediate_action}</p>
                        </div>
                      )}

                      {issue.resolution_plan && issue.resolution_plan.length > 0 && (
                        <div className="rounded-lg p-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                          <div className="text-xs font-semibold text-blue-400 mb-3">📋 Resolution Plan</div>
                          <div className="space-y-2">
                            {issue.resolution_plan.map((step: string, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5" style={{ background: '#f97316' }}>
                                  {i + 1}
                                </div>
                                <p className="text-slate-300 text-sm">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-lg p-3 text-center" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                          <div className="text-xl font-bold text-green-400">{issue.estimated_days || issue.sla_days}</div>
                          <div className="text-xs text-slate-400 mt-1">Est. Days to Resolve</div>
                        </div>
                        <div className="rounded-lg p-3 text-center" style={{ background: '#0f172a', border: '1px solid #334155' }}>
                          <div className="text-xl font-bold" style={{ color: '#f97316' }}>{issue.ai_confidence ? `${Math.round(issue.ai_confidence * 100)}%` : 'N/A'}</div>
                          <div className="text-xs text-slate-400 mt-1">AI Confidence</div>
                        </div>
                      </div>

                      {issue.image_b64 && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-2">📸 Reported Image</div>
                          <img src={`data:image/jpeg;base64,${issue.image_b64}`} alt="Issue" className="w-full max-h-48 object-cover rounded-lg" />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Change + Delete */}
                  {issue.reporter_id === user?.id && (
                    <div className="mt-3 flex items-center gap-3 flex-wrap">
                      {changingStatus === issue.id ? (
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button key={s} onClick={() => handleStatusChange(issue.id, s)}
                              className="text-xs px-2 py-1 rounded font-medium transition-all"
                              style={{
                                background: issue.status === s ? '#f97316' : '#334155',
                                color: 'white'
                              }}>
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                          <button onClick={() => setChangingStatus(null)} className="text-xs px-2 py-1 rounded text-slate-400" style={{ background: '#1e293b', border: '1px solid #334155' }}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setChangingStatus(issue.id)}
                          className="flex items-center gap-1 text-xs font-medium hover:underline"
                          style={{ color: '#f97316' }}>
                          <ChevronDown className="w-3 h-3" /> Update Status
                        </button>
                      )}
                      <button onClick={() => handleDelete(issue.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium">
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Upvote */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleUpvote(issue.id)}
                    disabled={issue.upvoted_by?.includes(user?.id)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg transition-all"
                    style={{
                      background: issue.upvoted_by?.includes(user?.id) ? 'rgba(249,115,22,0.15)' : '#334155',
                      color: issue.upvoted_by?.includes(user?.id) ? '#f97316' : '#94a3b8',
                      cursor: issue.upvoted_by?.includes(user?.id) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-bold">{issue.upvotes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}