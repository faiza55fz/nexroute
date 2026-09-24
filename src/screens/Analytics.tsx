import { BarChart2, TrendingUp, Clock, AlertTriangle, ArrowRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const departments = [
  { name: 'MPCB', applications: 42, avg: '18d', risk: '12%' },
  { name: 'Labour Dept', applications: 31, avg: '14d', risk: '18%' },
  { name: 'Revenue', applications: 27, avg: '9d', risk: '7%' },
  { name: 'Local Authority', applications: 24, avg: '21d', risk: '22%' },
]

export default function Analytics({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1200 }}>
    <div style={{ marginBottom: 24 }}><div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Government Intelligence</div><h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Analytics & Policy Intelligence</h1><div style={{ fontSize: 12, color: '#64748B' }}>Prototype analytics for approval workload, SLA performance and bottlenecks.</div></div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
      {[
        ['Projects Tracked', '124', '#2563EB', BarChart2],
['SLA On Track', '78%', '#16A34A', TrendingUp],
['At Risk', '17', '#D97706', AlertTriangle],
['Avg Processing', '15.4d', '#0891B2', Clock],
      ].map(([label, value, color, Icon]: any) => <div className="kpi-card" key={label}><Icon size={16} color={color} /><div style={{ fontSize: 25, fontWeight: 700, color, marginTop: 7 }}>{value}</div><div style={{ fontSize: 11, color: '#64748B' }}>{label}</div></div>)}
    </div>
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}><div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}><div style={{ fontSize: 14, fontWeight: 700, color: '#0D1B2E' }}>Department performance</div><div style={{ fontSize: 11, color: '#94A3B8', marginTop: 3 }}>Illustrative demo data — not live government statistics</div></div>
      <table className="data-table"><thead><tr><th>Department</th><th>Applications</th><th>Average Processing</th><th>SLA Risk</th></tr></thead><tbody>
        {departments.map(d => <tr key={d.name}><td style={{ fontWeight: 600 }}>{d.name}</td><td>{d.applications}</td><td>{d.avg}</td><td><span className={`badge ${parseInt(d.risk) >= 18 ? 'badge-amber' : 'badge-green'}`}>{d.risk}</span></td></tr>)}
      </tbody></table></div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 16 }}><div className="card"><div style={{ fontSize: 13, fontWeight: 700 }}>Policy signals</div><div style={{ fontSize: 12, color: '#64748B', lineHeight: 1.7, marginTop: 8 }}>Use aggregated workflow data to identify recurring bottlenecks, workload pressure and SLA patterns that may inform administrative action.</div></div><div className="card"><div style={{ fontSize: 13, fontWeight: 700 }}>Drill down</div><button className="card-sm" style={{ marginTop: 10, cursor: 'pointer', border: 0 }} onClick={() => setScreen('bottleneck')}>View bottlenecks <ArrowRight size={13} /></button><button className="card-sm" style={{ marginTop: 8, cursor: 'pointer', border: 0 }} onClick={() => setScreen('sla')}>View SLA monitoring <ArrowRight size={13} /></button></div></div>
    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14 }}>DEMO · Analytics are simulated for prototype evaluation.</div>
  </div>
}
