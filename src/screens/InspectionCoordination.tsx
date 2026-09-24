import { ClipboardList, CalendarDays, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const inspections = [
  { type: 'Factory Act Inspection', dept: 'Labour Dept', site: 'ABC Manufacturing Plant', date: '28 Sep', status: 'Scheduled', risk: 'LOW' },
  { type: 'Fire Safety Inspection', dept: 'Fire Dept', site: 'ABC Manufacturing Plant', date: '02 Oct', status: 'Proposed', risk: 'LOW' },
  { type: 'Environmental Site Inspection', dept: 'MPCB', site: 'ABC Manufacturing Plant', date: '05 Oct', status: 'Coordination needed', risk: 'MEDIUM' },
]

export default function InspectionCoordination({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1200 }}>
    <div style={{ marginBottom: 24 }}><div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Inspection Planning</div><h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Inspection Coordination</h1><div style={{ fontSize: 12, color: '#64748B' }}>Coordinate inspection activity and identify scheduling conflicts.</div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
      <div className="kpi-card"><div style={{ color: '#64748B', fontSize: 11 }}>UPCOMING</div><div style={{ fontSize: 26, fontWeight: 700, color: '#2563EB', marginTop: 7 }}>3</div></div>
      <div className="kpi-card"><div style={{ color: '#64748B', fontSize: 11 }}>COORDINATION NEEDED</div><div style={{ fontSize: 26, fontWeight: 700, color: '#D97706', marginTop: 7 }}>1</div></div>
      <div className="kpi-card"><div style={{ color: '#64748B', fontSize: 11 }}>COMPLETED</div><div style={{ fontSize: 26, fontWeight: 700, color: '#16A34A', marginTop: 7 }}>6</div></div>
    </div>
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}><table className="data-table"><thead><tr><th>Inspection</th><th>Department</th><th>Site</th><th>Date</th><th>Status</th><th>Risk</th></tr></thead><tbody>
      {inspections.map(i => <tr key={i.type}><td style={{ fontWeight: 600 }}>{i.type}</td><td>{i.dept}</td><td>{i.site}</td><td>{i.date}</td><td><span className={`badge ${i.status === 'Scheduled' ? 'badge-green' : i.status === 'Coordination needed' ? 'badge-amber' : 'badge-blue'}`}>{i.status}</span></td><td><span className={`badge ${i.risk === 'MEDIUM' ? 'badge-amber' : 'badge-green'}`}>{i.risk}</span></td></tr>)}
    </tbody></table></div>
    <div className="card" style={{ marginTop: 16, background: '#F8FAFC' }}><div style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700, fontSize: 13 }}><CalendarDays size={16} color="#2563EB" /> Coordination insight</div><div style={{ fontSize: 12, color: '#64748B', marginTop: 8 }}>One inspection currently needs coordination. Common inspection planning can reduce duplicate site visits in the prototype workflow.</div></div>
    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}><button className="card-sm" style={{ cursor: 'pointer', border: 0 }}><ClipboardList size={14} /> Plan inspection</button><button className="card-sm" style={{ cursor: 'pointer', border: 0 }} onClick={() => setScreen('sla')}><ArrowRight size={13} /> View SLA timeline</button></div>
    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14 }}><CheckCircle2 size={11} style={{ verticalAlign: 'middle' }} /> DEMO scheduling data for prototype evaluation.</div>
  </div>
}
