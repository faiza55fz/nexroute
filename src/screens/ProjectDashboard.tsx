import { AlertTriangle, CheckCircle, Clock, FileText, ArrowRight, TrendingUp, Bell, Plus, ChevronRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const kpis = [
  { label: 'Approval Readiness', value: '78%', sub: '14 of 18 approvals tracked', color: '#2563EB', bar: 78 },
  { label: 'Document Readiness', value: '84%', sub: '21 of 25 documents verified', color: '#16A34A', bar: 84 },
  { label: 'SLA Health', value: 'MEDIUM', sub: '3 approvals at risk', color: '#D97706', bar: null },
  { label: 'Compliance Score', value: '86%', sub: 'Next renewal in 32 days', color: '#0891B2', bar: 86 },
]

const upcomingActions = [
  { priority: 'HIGH', action: 'Upload Environmental Clearance NOC', dept: 'MoEFCC', due: '2 days', screen: 'documents' as Screen },
  { priority: 'HIGH', action: 'Schedule Factory Act Inspection', dept: 'Labour Dept', due: '5 days', screen: 'inspection' as Screen },
  { priority: 'MEDIUM', action: 'Respond to MIDC site query', dept: 'MIDC', due: '7 days', screen: 'approvals' as Screen },
  { priority: 'LOW', action: 'Review Fire NOC checklist', dept: 'Fire Dept', due: '14 days', screen: 'documents' as Screen },
]

const approvalProgress = [
  { name: 'Land Conversion & NA Order', dept: 'Revenue', status: 'completed', days: null },
  { name: 'Environmental Clearance', dept: 'MoEFCC / MPCB', status: 'active', days: 21 },
  { name: 'Factory Registration', dept: 'Labour Dept', status: 'blocked', days: null },
  { name: 'Building Plan Approval', dept: 'Local Authority', status: 'active', days: 8 },
  { name: 'Fire NOC', dept: 'Fire Dept', status: 'pending', days: null },
  { name: 'MPCB Consent to Establish', dept: 'MPCB', status: 'active', days: 14 },
]

const alerts = [
  { type: 'critical', text: '2 SLA risks detected — Environmental Clearance & Factory Registration approaching deadline.' },
  { type: 'warning', text: '1 dependency blocked — Factory Registration waiting for Environmental Clearance.' },
  { type: 'info', text: '1 incentive scheme identified — Package Scheme of Incentives (PSI) 2019 may apply.' },
]

const statusColor: Record<string, string> = {
  completed: '#16A34A', active: '#2563EB', blocked: '#DC2626', pending: '#94A3B8'
}

const statusLabel: Record<string, string> = {
  completed: 'Completed', active: 'In Progress', blocked: 'Blocked', pending: 'Pending'
}

const badgeClass: Record<string, string> = {
  HIGH: 'badge badge-red', MEDIUM: 'badge badge-amber', LOW: 'badge badge-blue'
}

export default function ProjectDashboard({ setScreen }: Props) {
  return (
    <div style={{ padding: '24px', maxWidth: 1200 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
            Project Overview
          </div>
          <h1 style={{ fontFamily: 'DM Sans', fontSize: 24, fontWeight: 700, color: '#0D1B2E', marginBottom: 4 }}>
            ABC Manufacturing Plant
          </h1>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="badge badge-blue">IN PROGRESS</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>Pune, Maharashtra</span>
            <span style={{ fontSize: 12, color: '#CBD5E1' }}>·</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>Chemical Manufacturing</span>
            <span style={{ fontSize: 12, color: '#CBD5E1' }}>·</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>₹45 Cr Investment</span>
            <span style={{ fontSize: 12, color: '#CBD5E1' }}>·</span>
            <span style={{ fontSize: 12, color: '#64748B' }}>250 Employment</span>
          </div>
        </div>
        <button
          onClick={() => setScreen('onboarding')}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 6,
            background: '#1B3A6B', color: 'white',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600
          }}
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {/* Alert banners */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {alerts.map((a, i) => (
          <div key={i} className={`alert-banner alert-${a.type === 'critical' ? 'critical' : a.type === 'warning' ? 'warning' : 'info'}`}>
            <AlertTriangle size={14} />
            <span style={{ flex: 1 }}>{a.text}</span>
            <ChevronRight size={13} style={{ flexShrink: 0, opacity: 0.5 }} />
          </div>
        ))}
      </div>

      {/* KPI row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {kpis.map(k => (
          <div key={k.label} className="kpi-card">
            <div style={{ fontSize: 11, fontWeight: 600, color: '#64748B', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: k.color, fontFamily: 'DM Sans', marginBottom: 4 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: k.bar ? 10 : 0 }}>
              {k.sub}
            </div>
            {k.bar && (
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${k.bar}%`, background: k.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
        {/* Left: Approval Roadmap */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: '14px 20px', borderBottom: '1px solid #F1F5F9',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E' }}>Approval Roadmap</div>
              <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>18 approvals identified · 6 active</div>
            </div>
            <button
              onClick={() => setScreen('approvals')}
              style={{
                display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600,
                color: '#2563EB', background: 'none', border: 'none', cursor: 'pointer'
              }}
            >
              View all <ArrowRight size={13} />
            </button>
          </div>

          {/* Overall progress bar */}
          <div style={{ padding: '12px 20px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>Overall Progress</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B' }}>42%</span>
            </div>
            <div className="progress-track" style={{ height: 8 }}>
              <div className="progress-fill" style={{ width: '42%', background: 'linear-gradient(90deg, #1B3A6B, #2563EB)' }} />
            </div>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Approval</th>
                <th>Department</th>
                <th>Status</th>
                <th>Days Elapsed</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {approvalProgress.map(a => (
                <tr key={a.name} style={{ cursor: 'pointer' }} onClick={() => setScreen('approvals')}>
                  <td style={{ fontSize: 13, fontWeight: 500, color: '#0D1B2E' }}>{a.name}</td>
                  <td style={{ fontSize: 12, color: '#64748B' }}>{a.dept}</td>
                  <td>
                    <span className={`badge ${
                      a.status === 'completed' ? 'badge-green' :
                      a.status === 'active' ? 'badge-blue' :
                      a.status === 'blocked' ? 'badge-red' : 'badge-grey'
                    }`}>
                      {statusLabel[a.status]}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: '#64748B', fontFamily: 'JetBrains Mono' }}>
                    {a.days ? `${a.days}d` : '—'}
                  </td>
                  <td><ChevronRight size={13} color="#CBD5E1" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: Intelligence panel + upcoming actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Intelligence panel */}
          <div className="card" style={{ background: '#0D1B2E', borderColor: '#1E3A5F' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <TrendingUp size={16} color="#60A5FA" />
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F1F5F9' }}>Intelligence Insights</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { count: 2, label: 'SLA risks detected', color: '#DC2626', screen: 'sla' as Screen },
                { count: 1, label: 'dependency blocking workflow', color: '#D97706', screen: 'dependency' as Screen },
                { count: 3, label: 'documents need attention', color: '#F59E0B', screen: 'documents' as Screen },
                { count: 1, label: 'incentive scheme may apply', color: '#16A34A', screen: 'incentives' as Screen },
              ].map((item, i) => (
                <div
                  key={i}
                  onClick={() => setScreen(item.screen)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '8px 10px', borderRadius: 6,
                    background: 'rgba(255,255,255,0.04)', cursor: 'pointer',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div style={{
                    width: 28, height: 28, borderRadius: 6,
                    background: item.color + '22',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, color: item.color, fontFamily: 'JetBrains Mono'
                  }}>
                    {item.count}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', flex: 1 }}>{item.label}</div>
                  <ChevronRight size={12} color="#334155" />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Actions */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0D1B2E' }}>Upcoming Actions</div>
            </div>
            <div style={{ padding: '8px' }}>
              {upcomingActions.map((a, i) => (
                <div
                  key={i}
                  onClick={() => setScreen(a.screen)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 8px', borderRadius: 6, cursor: 'pointer',
                    borderBottom: i < upcomingActions.length - 1 ? '1px solid #F1F5F9' : 'none'
                  }}
                >
                  <span className={badgeClass[a.priority]} style={{ flexShrink: 0, marginTop: 2 }}>
                    {a.priority}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#0D1B2E', marginBottom: 2 }}>
                      {a.action}
                    </div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>
                      {a.dept} · Due in {a.due}
                    </div>
                  </div>
                  <ChevronRight size={13} color="#CBD5E1" style={{ flexShrink: 0, marginTop: 2 }} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Dependency Graph', icon: '⬡', screen: 'dependency' as Screen, color: '#2563EB' },
              { label: 'SLA Monitoring', icon: '◷', screen: 'sla' as Screen, color: '#D97706' },
              { label: 'Compliance', icon: '✓', screen: 'compliance' as Screen, color: '#16A34A' },
              { label: 'Incentives', icon: '◈', screen: 'incentives' as Screen, color: '#0891B2' },
            ].map(n => (
              <div
                key={n.label}
                onClick={() => setScreen(n.screen)}
                className="card-sm"
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span style={{ fontSize: 16, color: n.color }}>{n.icon}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#475569' }}>{n.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
