import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authApi.login(form)
      setAuth(res.data.user, res.data.access_token)
      toast.success(`Welcome back, ${res.data.user.name}!`)
      navigate('/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed')
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
          <Link to="/register" className="px-4 py-2 text-sm font-medium text-white rounded transition-all" style={{ background: '#f97316' }}>
            Register
          </Link>
        </div>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">Citizen Login</h1>
            <p className="text-slate-400 text-sm">Sign in to access your grievance portal</p>
            <div className="w-12 h-1 mx-auto mt-3 rounded" style={{ background: '#f97316' }} />
          </div>

          {/* Card */}
          <div className="rounded-xl p-6 sm:p-8" style={{ background: '#1e293b', border: '1px solid #334155' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 font-semibold text-white rounded transition-all hover:opacity-90 disabled:opacity-50"
                style={{ background: '#f97316' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-slate-700 text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium hover:underline" style={{ color: '#f97316' }}>
                  Register here
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