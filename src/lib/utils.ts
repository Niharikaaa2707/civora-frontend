export function severityColor(s: string) {
  return { CRITICAL:'text-red-400', HIGH:'text-orange-400', MEDIUM:'text-yellow-400', LOW:'text-green-400' }[s] || 'text-slate-400'
}

export function severityBadge(s: string) {
  return { CRITICAL:'badge-critical', HIGH:'badge-high', MEDIUM:'badge-medium', LOW:'badge-low' }[s] || 'badge-low'
}

export function statusBadge(s: string) {
  if (s === 'RESOLVED') return 'status-resolved'
  if (s === 'IN_PROGRESS' || s === 'ACKNOWLEDGED') return 'status-progress'
  if (s === 'REJECTED') return 'status-rejected'
  return 'status-open'
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function tierColor(t: string) {
  return {
    Newcomer: 'text-slate-400',
    Scout:    'text-blue-400',
    Watchdog: 'text-purple-400',
    Crusader: 'text-orange-400',
    Hero:     'text-yellow-400'
  }[t] || 'text-slate-400'
}