import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { issuesApi } from '../services/api'
import { Upload, MapPin, Send } from 'lucide-react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import toast from 'react-hot-toast'

const CATEGORIES = [
  'Pothole / Road Damage', 'Broken Streetlight', 'Garbage / Waste',
  'Water Leakage / Waterlogging', 'Sewage / Blocked Drain',
  'Damaged Footpath', 'Illegal Dumping', 'Broken Traffic Signal',
  'Damaged Public Property', 'Open Manhole', 'Electrical Wire Hazard', 'Other'
]

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

function LocationPicker({ onSelect }: { onSelect: (lat: string, lon: string) => void }) {
  useMapEvents({ click(e) { onSelect(e.latlng.lat.toFixed(6), e.latlng.lng.toFixed(6)) } })
  return null
}

export default function ReportIssue() {
  const navigate  = useNavigate()
  const fileRef   = useRef<HTMLInputElement>(null)
  const [loading, setLoading]  = useState(false)
  const [preview, setPreview]  = useState<string | null>(null)
  const [showMap, setShowMap]  = useState(false)
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null)
  const [form, setForm] = useState({
    description: '', location: '', lat: '', lon: '', ward: '',
    category: '', severity: 'MEDIUM'
  })
  const [image, setImage] = useState<File | null>(null)

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }

  const getLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported'); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6)
        const lon = pos.coords.longitude.toFixed(6)
        setForm(f => ({ ...f, lat, lon }))
        setMarkerPos([parseFloat(lat), parseFloat(lon)])
        setShowMap(true)
        toast.success('Location captured!')
      },
      () => toast.error('Could not get location')
    )
  }

  const handleMapSelect = (lat: string, lon: string) => {
    setForm(f => ({ ...f, lat, lon }))
    setMarkerPos([parseFloat(lat), parseFloat(lon)])
    toast.success(`Location selected: ${lat}, ${lon}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.description || !form.location || !form.category) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('description', form.description)
      fd.append('location',    form.location)
      fd.append('lat',         form.lat)
      fd.append('lon',         form.lon)
      fd.append('ward',        form.ward)
      fd.append('category',    form.category)
      fd.append('severity',    form.severity)
      if (image) fd.append('image', image)
      const res = await issuesApi.submit(fd)
      toast.success(`Complaint filed! ID: ${res.data.issue.id}`)
      navigate('/issues')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div className="rounded-xl px-6 py-4" style={{ background: '#1e3a5f', borderLeft: '4px solid #f97316' }}>
        <h1 className="text-xl font-bold text-white">File a Complaint</h1>
        <p className="text-slate-300 text-sm mt-0.5">Submit a civic grievance to the concerned department</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Image Upload */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Upload Photo <span className="text-slate-500">(recommended — helps AI analyse the issue)</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all hover:border-orange-500"
            style={{ borderColor: '#334155' }}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Upload className="w-10 h-10" />
                <span className="font-medium text-sm">Click to upload photo</span>
                <span className="text-xs">JPG, PNG supported</span>
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>

        {/* Category + Severity */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Complaint Category <span style={{ color: '#f97316' }}>*</span>
              </label>
              <select
                className="input"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                required
              >
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Severity Level <span style={{ color: '#f97316' }}>*</span>
              </label>
              <select
                className="input"
                value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}
              >
                {SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Description <span style={{ color: '#f97316' }}>*</span>
          </label>
          <textarea
            className="input h-28 resize-none"
            placeholder="Describe the issue in detail — what did you see? How long has it been there?"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>

        {/* Location */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Location / Landmark <span style={{ color: '#f97316' }}>*</span>
          </label>
          <input
            type="text"
            className="input"
            placeholder="e.g. Near Clock Tower, MG Road"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            required
          />
        </div>

        {/* GPS + Map */}
        <div className="rounded-xl p-5 space-y-3" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="text-sm font-medium text-slate-300">📍 GPS Coordinates</label>
            <div className="flex gap-2">
              <button type="button" onClick={getLocation}
                className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded text-white transition-all hover:opacity-90"
                style={{ background: '#1e3a5f', border: '1px solid #2d4f7c' }}>
                <MapPin className="w-3 h-3" /> Auto Detect
              </button>
              <button type="button" onClick={() => setShowMap(!showMap)}
                className="text-xs font-medium px-3 py-1.5 rounded text-white transition-all hover:opacity-90"
                style={{ background: '#1e3a5f', border: '1px solid #2d4f7c' }}>
                {showMap ? 'Hide Map' : '🗺️ Pick on Map'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input type="text" className="input" placeholder="Latitude" value={form.lat}
              onChange={e => { setForm({ ...form, lat: e.target.value }); if (e.target.value && form.lon) setMarkerPos([parseFloat(e.target.value), parseFloat(form.lon)]) }} />
            <input type="text" className="input" placeholder="Longitude" value={form.lon}
              onChange={e => { setForm({ ...form, lon: e.target.value }); if (form.lat && e.target.value) setMarkerPos([parseFloat(form.lat), parseFloat(e.target.value)]) }} />
          </div>

          {showMap && (
            <div className="rounded-xl overflow-hidden" style={{ height: '280px', border: '1px solid #334155' }}>
              <MapContainer center={markerPos || [24.5854, 73.7125]} zoom={14} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
                <LocationPicker onSelect={handleMapSelect} />
                {markerPos && <Marker position={markerPos} />}
              </MapContainer>
            </div>
          )}

          {form.lat && form.lon ? (
            <p className="text-xs text-green-400">✅ Location set: {form.lat}, {form.lon}</p>
          ) : (
            <p className="text-xs text-slate-500">Auto Detect karo ya map pe click karke exact location chuno</p>
          )}
        </div>

        {/* Ward */}
        <div className="rounded-xl p-5" style={{ background: '#1e293b', border: '1px solid #334155' }}>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Ward / Area <span className="text-slate-500">(optional)</span>
          </label>
          <input type="text" className="input" placeholder="e.g. Ward 14, Hiran Magri" value={form.ward}
            onChange={e => setForm({ ...form, ward: e.target.value })} />
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 font-semibold text-white rounded flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: '#f97316' }}>
          {loading ? (
            <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" /> AI is analysing...</>
          ) : (
            <><Send className="w-5 h-5" /> Submit Complaint</>
          )}
        </button>
      </form>
    </div>
  )
}