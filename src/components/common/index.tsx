import { Loader2 } from 'lucide-react'
import { severityBadge, statusBadge } from '../../lib/utils'

export const Spinner = ({ size = 5 }: { size?: number }) => (
  <Loader2 className={`w-${size} h-${size} animate-spin text-blue-400`} />
)

export const SeverityBadge = ({ level }: { level: string }) => (
  <span className={severityBadge(level)}>{level}</span>
)

export const StatusBadge = ({ status }: { status: string }) => (
  <span className={statusBadge(status)}>{status.replace('_', ' ')}</span>
)

export const StatCard = ({
  label, value, icon, color = 'text-blue-400'
}: { label: string; value: string | number; icon: string; color?: string }) => (
  <div className="card">
    <div className="text-2xl mb-1">{icon}</div>
    <div className={`text-3xl font-bold ${color}`}>{value}</div>
    <div className="text-slate-400 text-sm mt-1">{label}</div>
  </div>
)

export const EmptyState = ({
  icon, title, desc
}: { icon: string; title: string; desc: string }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-xl font-semibold text-slate-200 mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm">{desc}</p>
  </div>
)