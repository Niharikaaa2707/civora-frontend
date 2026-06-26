import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Camera, List, Map, BarChart2, Trophy, LogOut, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { to: '/dashboard',  icon: Home,      label: 'Dashboard' },
  { to: '/report',     icon: Camera,    label: 'File Complaint' },
  { to: '/issues',     icon: List,      label: 'Community Board' },
  { to: '/map',        icon: Map,       label: 'Issue Map' },
  { to: '/analytics',  icon: BarChart2, label: 'Analytics' },
  { to: '/profile',    icon: Trophy,    label: 'My Profile' },
]

export const Sidebar = () => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="flex flex-col h-screen sticky top-0 w-64" style={{ background: '#1e293b', borderRight: '1px solid #2d4f7c' }}>

      {/* Logo */}
      <div style={{ background: '#1e3a5f', borderBottom: '3px solid #f97316' }}>
        <div className="px-4 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: '#f97316' }}>
            <span className="text-white font-bold text-base">C</span>
          </div>
          <div>
            <div className="font-bold text-white tracking-wide">CIVORA</div>
            <div className="text-xs text-slate-300">Grievance Portal</div>
          </div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3" style={{ background: '#1e3a5f', borderBottom: '1px solid #2d4f7c' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: '#f97316' }}>
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.name}</div>
              <div className="text-xs text-slate-300">{user.tier}</div>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold" style={{ color: '#f97316' }}>
              <Zap className="w-3 h-3" /> {user.xp_points}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-lg ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`
            }
            style={({ isActive }) => isActive ? { background: '#f97316' } : {}}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3" style={{ borderTop: '1px solid #2d4f7c' }}>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}