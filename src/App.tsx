import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { Sidebar } from './components/common/Sidebar'
import Landing from './pages/Landing'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import Issues from './pages/Issues'
import MapExplorer from './pages/MapExplorer'
import Analytics from './pages/Analytics'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore()
  return token ? <>{children}</> : <Navigate to="/login" />
}

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-screen overflow-hidden">
    <Sidebar />
    <main className="flex-1 overflow-y-auto bg-slate-900">
      <div className="p-6 max-w-7xl mx-auto">
        {children}
      </div>
    </main>
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/report"    element={<ProtectedRoute><AppLayout><ReportIssue /></AppLayout></ProtectedRoute>} />
      <Route path="/issues"    element={<ProtectedRoute><AppLayout><Issues /></AppLayout></ProtectedRoute>} />
      <Route path="/map"       element={<ProtectedRoute><AppLayout><MapExplorer /></AppLayout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AppLayout><Analytics /></AppLayout></ProtectedRoute>} />
      <Route path="/profile"   element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}