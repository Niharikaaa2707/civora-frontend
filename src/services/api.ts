import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ch_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ch_token')
      localStorage.removeItem('ch_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

export const authApi = {
  register: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const issuesApi = {
  list:     (params?: Record<string, any>) => api.get('/issues', { params }),
  get:      (id: string)                   => api.get(`/issues/${id}`),
  nearby:   (lat: number, lon: number, radius?: number) =>
              api.get('/issues/nearby', { params: { lat, lon, radius: radius ?? 500 } }),
  heatmap:  ()                             => api.get('/issues/heatmap'),
  validate: (id: string, vote_type: string, comment?: string) =>
              api.post(`/issues/${id}/validate`, { vote_type, comment }),
  updateStatus: (id: string, status: string, note?: string) =>
              api.patch(`/issues/${id}/status`, { status, note }),
  delete:   (id: string) => api.delete(`/issues/${id}`),
  submit:   (formData: FormData) =>
    api.post('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
}

export const analyticsApi = {
  summary:        () => api.get('/analytics/summary'),
  byCategory:     () => api.get('/analytics/by-category'),
  bySeverity:     () => api.get('/analytics/by-severity'),
  byStatus:       () => api.get('/analytics/by-status'),
  resolutionTime: () => api.get('/analytics/resolution-time'),
  leaderboard:    () => api.get('/analytics/leaderboard'),
  predictive:     () => api.get('/analytics/predictive'),
}

export const gamificationApi = {
  myStats:     () => api.get('/gamification/me'),
  leaderboard: () => api.get('/gamification/leaderboard'),
  missions:    () => api.get('/gamification/missions'),
  badges:      () => api.get('/gamification/badges'),
  tiers:       () => api.get('/gamification/tiers'),
}