import { Bell, Search, ChevronRight, LogOut } from 'lucide-react'
import type { Role, Screen } from '../App'

interface Props {
  role: Role
  screen: Screen
  setScreen: (s: Screen) => void
  onLogout: () => void
}

const screenLabels: Record<string, string> = {
  dashboard: 'Project Dashboard',
  approvals: 'Approval Roadmap',
  dependency: 'Workflow & Dependencies',
  documents: 'Document Readiness',
  sla: 'SLA & Timeline Intelligence',
  bottleneck: 'Bottleneck Intelligence',
  inspection: 'Inspection Coordination',
  compliance: 'Compliance & Renewals',
  incentives: 'Incentives & Government Support',
  assistant: 'Regulatory Knowledge Assistant',
  'gov-dashboard': 'Operations Dashboard',
  escalation: 'Escalation Center',
  analytics: 'Analytics & Policy Intelligence',
  onboarding: 'New Project',
}

const roleColors: Record<Role, string> = {
  applicant: '#2563EB',
  officer: '#0891B2',
  admin: '#7C3AED',
}

export default function Topbar({ role, screen, setScreen, onLogout }: Props) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#94A3B8', fontWeight: 500 }}>NexRoute</span>
        <ChevronRight size={12} color="#CBD5E1" />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#0D1B2E' }}>
          {screenLabels[screen] || screen}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F8FAFC', border: '1px solid #E2E8F0',
          borderRadius: 6, padding: '6px 12px', width: 220
        }}>
          <Search size={13} color="#94A3B8" />
          <input
            placeholder="Search approvals, projects..."
            style={{ background: 'none', border: 'none', outline: 'none', fontSize: 12, color: '#64748B', width: '100%' }}
          />
        </div>

        {/* Notifications */}
        <button
          style={{
            position: 'relative', background: 'none', border: 'none',
            cursor: 'pointer', padding: 6, borderRadius: 6,
          }}
          title="Notifications"
        >
          <Bell size={18} color="#64748B" />
          <span style={{
            position: 'absolute', top: 4, right: 4,
            width: 8, height: 8, borderRadius: '50%',
            background: '#DC2626', border: '2px solid white'
          }} />
        </button>

        {/* Role badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '5px 12px', borderRadius: 6,
          background: roleColors[role] + '14',
          border: `1px solid ${roleColors[role]}33`
        }}>
          <div style={{
            width: 24, height: 24, borderRadius: '50%',
            background: roleColors[role],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: 'white'
          }}>
            {role === 'applicant' ? 'AK' : role === 'officer' ? 'RK' : 'NA'}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2E' }}>
              {role === 'applicant' ? 'Amit Kumar' : role === 'officer' ? 'Rajan Kulkarni' : 'Nodal Authority'}
            </div>
            <div style={{ fontSize: 10, color: '#64748B' }}>
              {role === 'applicant' ? 'Entrepreneur' : role === 'officer' ? 'Sr. Industrial Officer' : 'DPIIT Maharashtra'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
