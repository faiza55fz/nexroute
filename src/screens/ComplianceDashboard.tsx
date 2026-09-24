import { CheckCircle2, Clock, FileText, ArrowRight, RefreshCw } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const obligations = [
  { name: 'MPCB Consent to Establish', dept: 'MPCB', status: 'Active', due: '18 days', risk: 'LOW' },
  { name: 'Factory Act Compliance', dept: 'Labour Dept', status: 'At Risk', due: '9 days', risk: 'MEDIUM' },
  { name: 'Fire Safety Renewal', dept: 'Fire Dept', status: 'Renewal', due: '32 days', risk: 'LOW' },
  { name: 'Environmental Reporting', dept: 'MPCB', status: 'Pending', due: '45 days', risk: 'LOW' },
]

export default function ComplianceDashboard({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1200 }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Continuous Compliance</div>
      <h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Compliance & Renewals</h1>
      <div style={{ fontSize: 12, color: '#64748B' }}>Monitor obligations, renewals and compliance readiness for the active project.</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
      {[
        ['Compliance Score', '86%', '#0891B2'], ['Active Obligations', '12', '#2563EB'],
        ['Renewals Due', '3', '#D97706'], ['At Risk', '1', '#DC2626'],
      ].map(([label, value, color]) => <div className="kpi-card" key={label}>
        <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontSize: 26, fontWeight: 700, color, marginTop: 8 }}>{value}</div>
      </div>)}
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 330px', gap: 20 }}>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E' }}>Compliance Obligations</div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>Demo data for prototype evaluation</div>
        </div>
        <table className="data-table"><thead><tr><th>Obligation</th><th>Department</th><th>Status</th><th>Due</th><th>Risk</th></tr></thead>
          <tbody>{obligations.map(o => <tr key={o.name}>
            <td style={{ fontWeight: 600, color: '#0D1B2E' }}>{o.name}</td><td style={{ color: '#64748B' }}>{o.dept}</td>
            <td><span className={`badge ${o.status === 'At Risk' ? 'badge-red' : o.status === 'Active' ? 'badge-blue' : 'badge-grey'}`}>{o.status}</span></td>
            <td>{o.due}</td><td><span className={`badge ${o.risk === 'MEDIUM' ? 'badge-amber' : 'badge-green'}`}>{o.risk}</span></td>
          </tr>)}</tbody>
        </table>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card" style={{ background: '#0D1B2E', borderColor: '#1E3A5F' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#F1F5F9', fontWeight: 700, fontSize: 13 }}><CheckCircle2 size={16} color="#34D399" /> Readiness overview</div>
          <div style={{ fontSize: 34, fontWeight: 700, color: '#34D399', marginTop: 14 }}>86%</div>
          <div style={{ fontSize: 11, color: '#94A3B8' }}>Most obligations are currently on track.</div>
        </div>
        <div className="card"><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Quick actions</div>
          <button className="card-sm" style={{ width: '100%', cursor: 'pointer', border: 0 }} onClick={() => setScreen('documents')}><FileText size={14} /> Review documents <ArrowRight size={13} /></button>
          <button className="card-sm" style={{ width: '100%', cursor: 'pointer', border: 0, marginTop: 8 }} onClick={() => setScreen('sla')}><Clock size={14} /> Check timelines <ArrowRight size={13} /></button>
          <button className="card-sm" style={{ width: '100%', cursor: 'pointer', border: 0, marginTop: 8 }} onClick={() => setScreen('approvals')}><RefreshCw size={14} /> View approvals <ArrowRight size={13} /></button>
        </div>
      </div>
    </div>
  </div>
}
