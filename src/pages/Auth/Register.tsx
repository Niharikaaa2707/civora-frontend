import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '', phone: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match!')
      return
    }
    setLoading(true)
    try {
      await authApi.register({
        name:     form.name,
        email:    form.email,
        password: form.password,
        phone:    form.phone,
      })
      toast.success('Account created! Please sign in.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0f172a' }}>

      {/* Top strip */}
      <div style={{ background: '#1e3a5f', borderBottom: '3px solid #f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="text-xs text-slate-300">Government of India — Citizen Grievance Portal</span>
          <span className="text-xs text-slate-300 hidden sm:block">Helpline: 1800-XXX-XXXX</span>
        </div>
      </div>

      {/* Navbar */}
      <div style={{ background: '#1e3a5f', borderBottom: '1px solid #2d4f7c' }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#f97316' }}>
              <span className="text-white font-bold text-base">C</span>
            </div>
            <div>
              <div className="font-bold text-lg text-white tracking-wide">CIVORA</div>
              <div className="text-xs text-slate-300 hidden sm:block">Civic Issue Reporting Portal</div>
            </div>
          </Link>
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-white border border-slate-400 rounded hover:bg-slate-700 transition-all">
            Sign In
          </Link>
        </div>
      </div>

      {/* Register Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Citizen Registration</h1>
            <p className="text-slate-400 text-sm">Create your account to file and track complaints</p>
            <div className="w-12 h-1 mx-auto mt-3 rounded" style={{ background: '#f97316' }} />
          </div>

          {/* Card */}
          <div className="rounded-xl p-6 sm:p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Full Name <span style={{ color: '#f97316' }}>*</span>
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Niharika Sharma"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Email Address <span style={{ color: '#f97316' }}>*</span>
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Mobile Number <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="tel"
                  className="input"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Password <span style={{ color: '#f97316' }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Confirm Password <span style={{ color: '#f97316' }}>*</span>
                  </label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white rounded transition-all hover:opacity-90 disabled:opacity-50 mt-2"
                style={{ background: '#f97316' }}
              >
                {loading ? 'Creating account...' : 'Register'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-700 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-medium hover:underline" style={{ color: '#f97316' }}>
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          <p className="text-center mt-4">
            <Link to="/" className="text-slate-500 hover:text-slate-400 text-sm">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ background: '#1e3a5f', borderTop: '3px solid #f97316' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 text-center">
          <p className="text-slate-400 text-xs">© 2026 Civora — Citizen Grievance Portal. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}