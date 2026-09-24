import { Gift, CheckCircle2, ArrowRight } from 'lucide-react'
import type { Screen } from '../App'

interface Props { setScreen: (s: Screen) => void }

const schemes = [
  { name: 'Package Scheme of Incentives (PSI) 2019', authority: 'Government of Maharashtra', relevance: 'Potentially applicable', status: 'Review eligibility' },
  { name: 'Industrial Promotion Support', authority: 'State support programme', relevance: 'Potential match', status: 'Documents needed' },
  { name: 'Energy Efficiency Support', authority: 'Relevant state authority', relevance: 'Project dependent', status: 'Explore' },
]

export default function IncentivesSchemes({ setScreen }: Props) {
  return <div style={{ padding: 24, maxWidth: 1200 }}>
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 11, color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Support Discovery</div>
      <h1 style={{ fontFamily: 'DM Sans', fontSize: 24, color: '#0D1B2E', margin: '4px 0' }}>Incentives & Schemes</h1>
      <div style={{ fontSize: 12, color: '#64748B' }}>Potential support schemes matched to the current project profile.</div>
    </div>
    <div className="card" style={{ background: '#EFF6FF', borderColor: '#BFDBFE', marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}><Gift size={20} color="#2563EB" /><div>
        <div style={{ fontWeight: 700, color: '#0D1B2E' }}>1 scheme may apply to this project</div>
        <div style={{ fontSize: 12, color: '#64748B', marginTop: 4 }}>Eligibility is indicative in this prototype and should be verified against current official scheme rules.</div>
      </div></div>
    </div>
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <table className="data-table"><thead><tr><th>Scheme</th><th>Authority</th><th>Relevance</th><th>Status</th></tr></thead>
        <tbody>{schemes.map(s => <tr key={s.name}><td style={{ fontWeight: 600, color: '#0D1B2E' }}>{s.name}</td><td>{s.authority}</td><td><span className="badge badge-blue">{s.relevance}</span></td><td>{s.status}</td></tr>)}</tbody>
      </table>
    </div>
    <button className="card-sm" style={{ marginTop: 16, cursor: 'pointer', border: 0 }} onClick={() => setScreen('documents')}><CheckCircle2 size={14} /> Check required documents <ArrowRight size={13} /></button>
    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 14 }}>DEMO · Scheme matching shown for prototype evaluation, not live government integration.</div>
  </div>
}
