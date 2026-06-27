import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { issuesApi } from '../services/api'
import { SeverityBadge, StatusBadge } from '../components/common'
import { timeAgo } from '../lib/utils'
import toast from 'react-hot-toast'

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ef4444',
  HIGH:     '#f97316',
  MEDIUM:   '#eab308',
  LOW:      '#22c55e',
}

export default function MapExplorer() {
  const [, setFeatures] = useState<any[]>([])
  const [loading,  setLoading]  = useState(true)
  const [issues,   setIssues]   = useState<any[]>([])

  useEffect(() => {
    const load = async () => {
      try {
        const [heatRes, issueRes] = await Promise.all([
          issuesApi.heatmap(),
          issuesApi.list({ limit: 100 }),
        ])
        setFeatures(heatRes.data.features)
        setIssues(issueRes.data.issues)
      } catch {
        toast.error('Failed to load map data')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const geoIssues = issues.filter(i => i.lat && i.lon)

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-xl px-6 py-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <h1 className="text-xl font-bold text-white">Issue Map</h1>
        <p className="text-slate-300 text-sm mt-0.5">All geo-tagged complaints plotted on the map</p>
      </div>

      {/* Legend */}
      <div className="rounded-xl p-4 flex flex-wrap items-center gap-4" style={{ background: '#1e293b', border: '1px solid #334155' }}>
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Severity:</span>
        {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
          <div key={sev} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span className="text-xs text-slate-400">{sev}</span>
          </div>
        ))}
        <span className="text-xs text-slate-500 ml-auto">{geoIssues.length} geo-tagged complaints</span>
      </div>

      {/* Map */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: '#f97316' }} />
        </div>
      ) : geoIssues.length === 0 ? (
        <div className="rounded-xl p-16 text-center" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="text-5xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-white mb-2">No geo-tagged complaints yet</h3>
          <p className="text-slate-400 text-sm">Add GPS coordinates when filing a complaint to see it on the map</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden" style={{ height: '500px', border: '1px solid #334155' }}>
          <MapContainer
            center={[parseFloat(geoIssues[0]?.lat) || 24.5854, parseFloat(geoIssues[0]?.lon) || 73.7125]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
            {geoIssues.map((issue: any) => (
              <CircleMarker
                key={issue.id}
                center={[parseFloat(issue.lat), parseFloat(issue.lon)]}
                radius={issue.severity === 'CRITICAL' ? 14 : issue.severity === 'HIGH' ? 11 : 8}
                pathOptions={{
                  color:       SEVERITY_COLORS[issue.severity] || '#f97316',
                  fillColor:   SEVERITY_COLORS[issue.severity] || '#f97316',
                  fillOpacity: 0.7,
                  weight:      2,
                }}
              >
                <Popup>
                  <div className="min-w-48">
                    <div className="font-bold text-slate-800">{issue.id}</div>
                    <div className="text-sm text-slate-600 mt-1">{issue.category}</div>
                    <div className="text-xs text-slate-500 mt-1">📍 {issue.location}</div>
                    <div className="text-xs text-slate-500">{timeAgo(issue.created_at)}</div>
                    <div className="mt-2">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        issue.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                        issue.severity === 'HIGH'     ? 'bg-orange-100 text-orange-700' :
                        issue.severity === 'MEDIUM'   ? 'bg-yellow-100 text-yellow-700' :
                                                        'bg-green-100 text-green-700'
                      }`}>{issue.severity}</span>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Issue list */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: '#f97316' }}>
          Geo-tagged Complaints ({geoIssues.length})
        </h2>
        {geoIssues.length === 0 ? null : (
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #334155' }}>
            {geoIssues.map((issue: any, idx: number) => (
              <div
                key={issue.id}
                className="flex items-center justify-between px-4 py-3"
                style={{
                  background: idx % 2 === 0 ? '#1e293b' : '#1a2538',
                  borderBottom: idx < geoIssues.length - 1 ? '1px solid #334155' : 'none'
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-xs font-bold" style={{ color: '#f97316' }}>{issue.id}</span>
                    <SeverityBadge level={issue.severity} />
                  </div>
                  <div className="font-medium text-white text-sm truncate">{issue.category}</div>
                  <div className="text-slate-500 text-xs mt-0.5">
                    📍 {issue.location} · 🌐 {issue.lat}, {issue.lon}
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