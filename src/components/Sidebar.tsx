
import { useEffect, useState } from 'react'
import {
  LayoutDashboard, Map, FileText, GitBranch, Clock,
  ClipboardList, RefreshCw, Gift, BookOpen,
  CheckSquare, BarChart2, AlertTriangle,
  Building2, ChevronDown, LogOut
} from 'lucide-react'
import type { Role, Screen } from '../App'

interface Project {
  id: number
  name: string
  code: string
  project_type: string | null
  description: string | null
  status: string
}

interface Props {
  role: Role
  screen: Screen
  setScreen: (s: Screen) => void
  setRole: (r: Role) => void
  projectId: number | null
  setProjectId: (id: number) => void
}

const applicantNav = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'approvals', label: 'Approval Roadmap', icon: Map },
  { id: 'dependency', label: 'Workflow & Dependencies', icon: GitBranch },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'sla', label: 'SLA & Timeline', icon: Clock },
  { id: 'bottleneck', label: 'Bottleneck Intelligence', icon: AlertTriangle },
  { id: 'inspection', label: 'Inspections', icon: ClipboardList },
  { id: 'compliance', label: 'Compliance & Renewals', icon: RefreshCw },
  { id: 'incentives', label: 'Incentives & Schemes', icon: Gift },
  { id: 'assistant', label: 'Regulatory Assistant', icon: BookOpen },
]

const officerNav = [
  { id: 'gov-dashboard', label: 'Operations Dashboard', icon: LayoutDashboard },
  { id: 'sla', label: 'SLA Monitoring', icon: Clock },
  { id: 'bottleneck', label: 'Bottleneck Intelligence', icon: AlertTriangle },
  { id: 'inspection', label: 'Inspections', icon: ClipboardList },
  { id: 'escalation', label: 'Escalation Center', icon: AlertTriangle },
  { id: 'compliance', label: 'Compliance', icon: CheckSquare },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
]

const adminNav = [
  { id: 'gov-dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'analytics', label: 'Analytics & Policy', icon: BarChart2 },
  { id: 'sla', label: 'SLA Analytics', icon: Clock },
  { id: 'bottleneck', label: 'Bottleneck Intelligence', icon: AlertTriangle },
  { id: 'inspection', label: 'Inspection Analytics', icon: ClipboardList },
  { id: 'escalation', label: 'Escalation Management', icon: AlertTriangle },
]

const roleLabels: Record<Role, string> = {
  applicant: 'Applicant',
  officer: 'Government Officer',
  admin: 'Nodal Authority',
}

export default function Sidebar({
  role, screen, setScreen, setRole, projectId, setProjectId
}: Props) {
  const nav = role === 'applicant'
    ? applicantNav
    : role === 'officer' ? officerNav : adminNav

  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [projectError, setProjectError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/projects')
      .then(res => {
        if (!res.ok) throw new Error('Could not load projects')
        return res.json()
      })
      .then((data: Project[]) => {
        setProjects(data)
        setProjectError('')
        if (data.length > 0 && !data.some(p => p.id === projectId)) {
          setProjectId(data[0].id)
        }
      })
      .catch(() => setProjectError('Backend unavailable'))
      .finally(() => setLoadingProjects(false))
  }, [])

  const activeProject = projects.find(p => p.id === projectId)

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB, #0891B2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Building2 size={18} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'DM Sans', fontWeight: 700, fontSize: 15, color: '#F1F5F9', letterSpacing: '-0.01em' }}>
              NexRoute
            </div>
            <div style={{ fontSize: 10, color: '#4A5568', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Maharashtra
            </div>
          </div>
        </div>
      </div>

      {/* Role switcher */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 8,
          padding: '8px 12px',
        }}>
          <div style={{ fontSize: 10, color: '#4A5568', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 3 }}>
            Signed in as
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: 13, color: '#E2E8F0', fontWeight: 600 }}>
              {roleLabels[role]}
            </div>
            <ChevronDown size={12} color="#4A5568" />
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 4 }}>
            {(['applicant', 'officer', 'admin'] as Role[]).map(r => (
              <button
                key={r}
                onClick={() => {
                  setRole(r)
                  setScreen(r === 'applicant' ? 'dashboard' : 'gov-dashboard')
                }}
                style={{
                  fontSize: 9, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                  background: role === r ? '#1B3A6B' : 'transparent',
                  color: role === r ? '#93C5FD' : '#4A5568',
                  border: '1px solid ' + (role === r ? '#2563EB' : 'transparent'),
                  cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em'
                }}
              >
                {r === 'applicant' ? 'App' : r === 'officer' ? 'Gov' : 'Admin'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic project selector */}
      {role === 'applicant' && (
        <div style={{ padding: '0 12px 8px' }}>
          <div style={{
            background: 'rgba(37,99,235,0.12)',
            border: '1px solid rgba(37,99,235,0.25)',
            borderRadius: 6, padding: '8px 12px'
          }}>
            <label htmlFor="active-project" style={{
              fontSize: 10, color: '#60A5FA', fontWeight: 600,
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}>
              Active Project
            </label>

            {loadingProjects ? (
              <div style={{ color: '#E2E8F0', fontSize: 12, marginTop: 6 }}>
                Loading projects...
              </div>
            ) : projectError ? (
              <div style={{ color: '#FCA5A5', fontSize: 12, marginTop: 6 }}>
                {projectError}
              </div>
            ) : (
              <>
                <select
                  id="active-project"
                  value={projectId ?? ''}
                  onChange={e => setProjectId(Number(e.target.value))}
                  style={{
                    width: '100%', marginTop: 6, padding: '7px 4px',
                    background: '#10233F', color: '#E2E8F0',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 5, fontSize: 12, fontWeight: 600
                  }}
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>
                  {activeProject?.project_type || 'Project type not specified'}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div style={{ padding: '4px 0 8px' }}>
        <div className="sidebar-section-label">Navigation</div>
        {nav.map(item => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`sidebar-nav-item ${screen === item.id ? 'active' : ''}`}
              onClick={() => setScreen(item.id as Screen)}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </div>
          )
        })}
      </div>

      {/* Bottom actions */}
      <div style={{ marginTop: 'auto', padding: '12px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div
          className="sidebar-nav-item"
          onClick={() => window.location.reload()}
          style={{ color: '#DC2626' }}
        >
          <LogOut size={14} />
          <span style={{ fontSize: 13 }}>Sign Out</span>
        </div>
      </div>

      {/* Demo indicator */}
      <div style={{ padding: '0 16px 16px' }}>
        <div style={{ fontSize: 10, color: '#1E3A5F', background: 'rgba(37,99,235,0.08)', borderRadius: 6, padding: '8px 10px', lineHeight: 1.6 }}>
          <span style={{ color: '#2563EB', fontWeight: 600 }}>DEMO</span> · Simulated data for prototype evaluation. Not live government integration.
        </div>
      </div>
    </div>
  )
}