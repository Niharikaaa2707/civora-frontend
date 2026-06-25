import { NavLink, useNavigate } from 'react-router-dom'
import { Home, Camera, List, Map, BarChart2, Trophy, LogOut, Shield, Zap } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { tierColor } from '../../lib/utils'

const navItems = [
  { to: '/dashboard',  icon: Home,      label: 'Dashboard' },
  { to: '/report',     icon: Camera,    label: 'Report Issue' },
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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-slate-100 text-lg">Civora</div>
            
          </div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-200 truncate">{user.name}</div>
              <div className={`text-xs font-semibold ${tierColor(user.tier)}`}>{user.tier}</div>
            </div>
            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
              <Zap className="w-3 h-3" /> {user.xp_points}
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  )
}