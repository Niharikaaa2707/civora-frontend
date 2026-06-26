import { useNavigate } from 'react-router-dom'
import { MapPin, Users, BarChart2, Menu, X } from 'lucide-react'
import { useState } from 'react'

const features = [
  { icon: '🤖', title: 'AI Detection', desc: 'Every issue is automatically categorised and prioritised using AI' },
  { icon: '📍', title: 'Geo Mapping', desc: 'Pin issues on map with precise GPS coordinates' },
  { icon: '🗳️', title: 'Community Verify', desc: 'Neighbours upvote issues to push priority cases higher' },
  { icon: '🏆', title: 'Earn Rewards', desc: 'Get XP points and badges for reporting civic problems' },
  { icon: '📊', title: 'Live Analytics', desc: 'Real-time dashboards with predictive hotspot insights' },
  { icon: '⚡', title: 'Fast Resolution', desc: 'Issues auto-routed to the right government department' },
]

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: '#0f172a' }}>

      {/* Top strip */}
      <div style={{ background: '#1e3a5f', borderBottom: '3px solid #f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs text-slate-300 hidden sm:block">Government of India — Citizen Grievance Portal</span>
          <span className="text-xs text-slate-300 sm:hidden">Citizen Grievance Portal</span>
          <span className="text-xs text-slate-300">Helpline: 1800-XXX-XXXX</span>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: '#1e3a5f', borderBottom: '1px solid #2d4f7c' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#f97316' }}>
              <span className="text-white font-bold text-base">C</span>
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-wide">CIVORA</div>
              <div className="text-xs text-slate-300 hidden sm:block">Civic Issue Reporting Portal</div>
            </div>
          </div>

          {/* Desktop buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="px-5 py-2 text-sm font-medium text-white border border-slate-400 rounded hover:bg-slate-700 transition-all">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="px-5 py-2 text-sm font-medium text-white rounded transition-all" style={{ background: '#f97316' }}>
              Register
            </button>
          </div>

          {/* Mobile menu button */}
          <button className="sm:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden px-4 pb-4 flex flex-col gap-2" style={{ background: '#1e3a5f' }}>
            <button onClick={() => navigate('/login')} className="w-full py-2 text-sm font-medium text-white border border-slate-400 rounded hover:bg-slate-700 transition-all">
              Sign In
            </button>
            <button onClick={() => navigate('/register')} className="w-full py-2 text-sm font-medium text-white rounded transition-all" style={{ background: '#f97316' }}>
              Register
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)', borderBottom: '3px solid #f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <div className="inline-block text-xs font-semibold px-3 py-1 rounded mb-4 text-white" style={{ background: '#f97316' }}>
              AI-Powered Platform
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Report Civic Issues.<br />
              <span style={{ color: '#f97316' }}>Get Them Resolved.</span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto md:mx-0">
              A transparent platform for citizens to report potholes, water leakages, broken streetlights and other civic problems directly to the concerned authorities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <button onClick={() => navigate('/register')} className="px-8 py-3 font-semibold text-white rounded transition-all hover:opacity-90" style={{ background: '#f97316' }}>
                File a Complaint
              </button>
              <button onClick={() => navigate('/login')} className="px-8 py-3 font-semibold text-white rounded border border-slate-400 hover:bg-slate-700 transition-all">
                Track Status
              </button>
            </div>
          </div>

          {/* Stats box */}
          <div className="rounded-xl p-5 w-full md:w-64 md:min-w-64" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-center mb-4">
              <div className="text-sm text-slate-400 uppercase tracking-wider">Portal Statistics</div>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:gap-0">
              {[
                { icon: <MapPin className="w-4 h-4" />, value: '10,000+', label: 'Issues Reported' },
                { icon: <Users className="w-4 h-4" />, value: '5,000+', label: 'Registered Citizens' },
                { icon: <BarChart2 className="w-4 h-4" />, value: '80%', label: 'Resolution Rate' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col md:flex-row items-center md:items-start gap-1 md:gap-3 py-2 md:py-3 border-b border-slate-700 last:border-0 text-center md:text-left">
                  <div style={{ color: '#f97316' }} className="mt-0.5">{s.icon}</div>
                  <div>
                    <div className="font-bold text-white text-sm md:text-base">{s.value}</div>
                    <div className="text-xs text-slate-400">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notice Bar */}
      <div style={{ background: '#f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-2">
          <p className="text-white text-xs sm:text-sm font-medium text-center">
            📢 All complaints are tracked in real-time and forwarded to concerned departments within 24 hours.
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">How Civora Works</h2>
          <div className="w-16 h-1 mx-auto rounded" style={{ background: '#f97316' }} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((f, i) => (
            <div key={i} className="rounded-xl p-4 md:p-5 flex gap-4 hover:border-orange-500 transition-all border" style={{ background: '#1e293b', borderColor: '#334155' }}>
              <div className="text-2xl md:text-3xl shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-white mb-1 text-sm md:text-base">{f.title}</h3>
                <p className="text-slate-400 text-xs md:text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1e3a5f', borderTop: '3px solid #f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-5 text-center">
          <p className="text-slate-400 text-xs md:text-sm">© 2026 Civora — Citizen Grievance Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}