import { useNavigate } from 'react-router-dom'
import { Shield, MapPin, Users, BarChart2, Zap, ArrowRight } from 'lucide-react'

const features = [
  { icon: '🤖', title: 'AI Detection',      desc: 'Gemini AI auto-categorises and scores every reported issue' },
  { icon: '📍', title: 'Geo Mapping',       desc: 'Pin issues on interactive map with precise coordinates' },
  { icon: '🗳️', title: 'Community Verify',  desc: 'Neighbours upvote issues to push priority cases higher' },
  { icon: '🏆', title: 'Earn Rewards',      desc: 'Get XP points and badges for reporting civic problems' },
  { icon: '📊', title: 'Live Analytics',    desc: 'Real-time dashboards with predictive hotspot insights' },
  { icon: '⚡', title: 'Fast Resolution',   desc: 'Auto-route issues to the right government department' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-slate-100">Civora</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/login')}    className="btn-secondary">Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <div className="text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-blue-400 text-sm font-medium mb-6">
          <Zap className="w-4 h-4" /> AI-Powered Civic Intelligence
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-tight">
          Fix Your City.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            Be the Hero.
          </span>
        </h1>
        <p className="text-slate-400 text-xl max-w-2xl mx-auto mb-10">
          Report potholes, water leakages, broken streetlights and more.
          AI analyses every issue and routes it to the right authority — instantly.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => navigate('/register')}
            className="btn-primary flex items-center gap-2 text-lg px-8 py-3"
          >
            Start Reporting <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary text-lg px-8 py-3"
          >
            Sign In
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-12 px-6 py-8 border-y border-slate-800 mb-16">
        {[
          { icon: <MapPin className="w-5 h-5" />, value: '10,000+', label: 'Issues Reported' },
          { icon: <Users className="w-5 h-5" />, value: '5,000+', label: 'Active Citizens' },
          { icon: <BarChart2 className="w-5 h-5"/>, value: '80%',    label: 'Resolution Rate' },
        ].map((s, i) => (
          <div key={i} className="text-center">
            <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">{s.icon}</div>
            <div className="text-3xl font-bold text-slate-100">{s.value}</div>
            <div className="text-slate-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <div className="px-8 pb-24 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-100 mb-12">
          Everything your city needs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="card-hover">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}