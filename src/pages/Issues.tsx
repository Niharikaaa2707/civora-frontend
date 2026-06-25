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
    if (!confirm('Are you sure you want to delete this issue?')) return
    try {
      await issuesApi.delete(issueId)
      toast.success('Issue deleted!')
      load()
    } catch (err: any) {
      toast.error('Failed to delete')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-100">🗳️ Community Board</h1>
        <p className="text-slate-400 mt-1">Browse all civic issues — upvote to raise priority</p>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-4">
        <Filter className="w-4 h-4 text-slate-400" />
        <select className="input w-auto" value={sort} onChange={e => setSort(e.target.value)}>
          <option value="newest">Most Recent</option>
          <option value="upvotes">Most Upvoted</option>
          <option value="priority">Highest Priority</option>
          <option value="critical">Critical First</option>
        </select>
        <select className="input w-auto" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING_REVIEW">Pending Review</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>
        <select className="input w-auto" value={severity} onChange={e => setSeverity(e.target.value)}>
          <option value="">All Severity</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Issues List */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-400" />
        </div>
      ) : issues.length === 0 ? (
        <EmptyState icon="🏙️" title="No issues found" desc="No issues match your filters." />
      ) : (
        <div className="space-y-4">
          {issues.map((issue: any) => (
            <div key={issue.id} className="card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">

                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-blue-400 font-mono text-sm font-semibold">{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                    <StatusBadge status={issue.status} />
                    {issue.severity === 'CRITICAL' && (
                      <span className="text-red-400 text-xs font-bold">🚨 CRITICAL</span>
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-100">{issue.category}</h3>
                  <p className="text-slate-400 text-sm mt-1 line-clamp-2">{issue.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-500">
                    <span>📍 {issue.location}</span>
                    <span>🕒 {timeAgo(issue.created_at)}</span>
                    <span>🏢 {issue.department}</span>
                    <span>👤 {issue.reporter_name}</span>
                    <span>🎯 Priority: {issue.priority_score}/10</span>
                  </div>

                  {/* Expand Button */}
                  <button
                    onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium mt-3"
                  >
                    {expandedId === issue.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    {expandedId === issue.id ? 'Show Less' : 'View Details & Resolution Plan'}
                  </button>

                  {/* Expanded Details */}
                  {expandedId === issue.id && (
                    <div className="mt-4 space-y-4 border-t border-slate-700 pt-4">

                      {/* Risk Description */}
                      {issue.risk_description && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <div className="text-xs font-semibold text-red-400 mb-1">⚠️ Risk Assessment</div>
                          <p className="text-slate-300 text-sm">{issue.risk_description}</p>
                        </div>
                      )}

                      {/* Severity Reason */}
                      {issue.severity_reason && (
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                          <div className="text-xs font-semibold text-orange-400 mb-1">📊 Severity Reason</div>
                          <p className="text-slate-300 text-sm">{issue.severity_reason}</p>
                        </div>
                      )}

                      {/* Immediate Action */}
                      {issue.immediate_action && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
                          <div className="text-xs font-semibold text-yellow-400 mb-1">⚡ Immediate Action Required</div>
                          <p className="text-slate-300 text-sm">{issue.immediate_action}</p>
                        </div>
                      )}

                      {/* Resolution Plan */}
                      {issue.resolution_plan && issue.resolution_plan.length > 0 && (
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                          <div className="text-xs font-semibold text-blue-400 mb-3">📋 Resolution Plan</div>
                          <div className="space-y-2">
                            {issue.resolution_plan.map((step: string, i: number) => (
                              <div key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full bg-blue-500/30 text-blue-400 text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                                  {i + 1}
                                </div>
                                <p className="text-slate-300 text-sm">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Timeline */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-green-400">{issue.estimated_days || issue.sla_days}</div>
                          <div className="text-xs text-slate-400 mt-1">Estimated Days to Resolve</div>
                        </div>
                        <div className="bg-slate-700/50 rounded-xl p-3 text-center">
                          <div className="text-2xl font-bold text-purple-400">{issue.ai_confidence ? `${Math.round(issue.ai_confidence * 100)}%` : 'N/A'}</div>
                          <div className="text-xs text-slate-400 mt-1">AI Confidence Score</div>
                        </div>
                      </div>

                      {/* Image */}
                      {issue.image_b64 && (
                        <div>
                          <div className="text-xs font-semibold text-slate-400 mb-2">📸 Reported Image</div>
                          <img
                            src={`data:image/jpeg;base64,${issue.image_b64}`}
                            alt="Issue"
                            className="w-full max-h-48 object-cover rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Status Change */}
                  {issue.reporter_id === user?.id && (
                    <div className="mt-3 flex items-center gap-3">
                      {changingStatus === issue.id ? (
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(issue.id, s)}
                              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                                issue.status === s
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }`}
                            >
                              {s.replace('_', ' ')}
                            </button>
                          ))}
                          <button
                            onClick={() => setChangingStatus(null)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setChangingStatus(issue.id)}
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                          <ChevronDown className="w-3 h-3" /> Update Status
                        </button>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(issue.id)}
                        className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-medium ml-2"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Upvote */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleUpvote(issue.id)}
                    disabled={issue.upvoted_by?.includes(user?.id)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                      issue.upvoted_by?.includes(user?.id)
                        ? 'bg-blue-500/20 text-blue-400 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-blue-500/20 hover:text-blue-400 text-slate-400'
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-sm font-bold">{issue.upvotes}</span>
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