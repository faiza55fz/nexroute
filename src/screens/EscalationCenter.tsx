import { AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const cases = [
  { id: 'ESC-014', issue: 'Environmental Clearance SLA risk', dept: 'MoEFCC / MPCB', severity: 'CRITICAL', owner: 'Pending assignment', status: 'Open' },
  { id: 'ESC-013', issue: 'Factory Registration dependency', dept: 'Labour Dept', severity: 'HIGH', owner: 'Nodal Officer', status: 'In Review' },
  { id: 'ESC-011', issue: 'Building approval timeline', dept: 'Local Authority', severity: 'MEDIUM', owner: 'Department Officer', status: 'Monitoring' },
]

export default function EscalationCenter({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1200 }}>
    <div style={{ marginBottom: 24 }}><div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Proactive Intervention</div><h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Escalation Center</h1><div style={{ fontSize: 12, color: '#64748B' }}>Monitor SLA risks and coordinate intervention before delays become breaches.</div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
      <div className="kpi-card"><AlertTriangle size={16} color="#DC2626" /><div style={{ fontSize: 25, fontWeight: 700, color: '#DC2626', marginTop: 7 }}>2</div><div style={{ fontSize: 11, color: '#64748B' }}>Critical / high risks</div></div>
      <div className="kpi-card"><Clock size={16} color="#D97706" /><div style={{ fontSize: 25, fontWeight: 700, color: '#D97706', marginTop: 7 }}>3</div><div style={{ fontSize: 11, color: '#64748B' }}>Open interventions</div></div>
      <div className="kpi-card"><CheckCircle2 size={16} color="#16A34A" /><div style={{ fontSize: 25, fontWeight: 700, color: '#16A34A', marginTop: 7 }}>11</div><div style={{ fontSize: 11, color: '#64748B' }}>Resolved this cycle</div></div>
    </div>
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}><table className="data-table"><thead><tr><th>Case</th><th>Issue</th><th>Department</th><th>Severity</th><th>Owner</th><th>Status</th></tr></thead><tbody>
      {cases.map(c => <tr key={c.id}><td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{c.id}</td><td style={{ fontWeight: 600 }}>{c.issue}</td><td>{c.dept}</td><td><span className={`badge ${c.severity === 'CRITICAL' ? 'badge-red' : c.severity === 'HIGH' ? 'badge-amber' : 'badge-blue'}`}>{c.severity}</span></td><td>{c.owner}</td><td>{c.status}</td></tr>)}
    </tbody></table></div>
    <div className="card" style={{ marginTop: 16 }}><div style={{ fontSize: 13, fontWeight: 700 }}>Recommended intervention</div><div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, marginTop: 8 }}>Prioritise the highest-risk approval, identify the blocking dependency, assign an owner and record the intervention outcome.</div><button className="card-sm" style={{ marginTop: 12, cursor: 'pointer', border: 0 }} onClick={() => setScreen('bottleneck')}>Inspect bottleneck intelligence <ArrowRight size={13} /></button></div>
    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14 }}>DEMO · Escalation records are simulated for prototype evaluation.</div>
  </div>
}
